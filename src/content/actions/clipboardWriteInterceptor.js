// Prevent capturing already-patched functions if script is re-injected
const originalDocumentExecCommand = window.rangoOriginalExecCommand || document.execCommand;
const originalClipboardWrite = window.rangoOriginalClipboardWrite || window.navigator.clipboard.write;
const originalClipboardWriteText = window.rangoOriginalClipboardWriteText || window.navigator.clipboard.writeText;

// Store originals globally to prevent re-injection issues
window.rangoOriginalExecCommand = originalDocumentExecCommand;
window.rangoOriginalClipboardWrite = originalClipboardWrite; 
window.rangoOriginalClipboardWriteText = originalClipboardWriteText;

const isReinjection = !!window.rangoClipboardInterceptorLoaded;
const execName = originalDocumentExecCommand.name || 'anonymous';
const writeName = originalClipboardWrite.name || 'anonymous';
const writeTextName = originalClipboardWriteText.name || 'anonymous';

console.log(`[Rango Debug] Clipboard interceptor script loaded - isReinjection: ${isReinjection}, functions: execCommand=${execName}, clipboardWrite=${writeName}, clipboardWriteText=${writeTextName}`);

// Mark that the script has been loaded
window.rangoClipboardInterceptorLoaded = true;

window.addEventListener("message", (event) => {
	if (event.origin !== window.location.origin) return;

	if (event.data.type === "RANGO_START_CLIPBOARD_WRITE_INTERCEPTION") {
		startClipboardWriteInterception();
	}

	if (event.data.type === "RANGO_STOP_CLIPBOARD_WRITE_INTERCEPTION") {
		stopClipboardWriteInterception();
	}

	if (event.data.type === "RANGO_CHECK_INTERCEPTOR_LOADED") {
		window.postMessage(
			{ type: "RANGO_INTERCEPTOR_LOADED" },
			window.location.origin
		);
	}
});

function startClipboardWriteInterception() {
	const writePatched = window.navigator.clipboard.write !== originalClipboardWrite;
	const writeTextPatched = window.navigator.clipboard.writeText !== originalClipboardWriteText;
	const execPatched = document.execCommand !== originalDocumentExecCommand;
	
	console.log(`[Rango Debug] Starting clipboard write interception - writeAlreadyPatched: ${writePatched}, writeTextAlreadyPatched: ${writeTextPatched}, execCommandAlreadyPatched: ${execPatched}`);

	window.navigator.clipboard.write = async () => {
		postMessageClipboardWriteIntercepted();
		stopClipboardWriteInterception();
	};

	window.navigator.clipboard.writeText = async (text) => {
		postMessageClipboardWriteIntercepted(text);
		stopClipboardWriteInterception();
	};

	document.execCommand = (...args) => {
		if (args[0] === "copy") {
			postMessageClipboardWriteIntercepted(window.getSelection()?.toString());
			stopClipboardWriteInterception();
			return;
		}

		originalDocumentExecCommand.apply(document, args);
	};

	window.postMessage(
		{ type: "RANGO_CLIPBOARD_WRITE_INTERCEPTION_READY" },
		window.location.origin
	);
}

function stopClipboardWriteInterception() {
	const writeIsPatched = window.navigator.clipboard.write !== originalClipboardWrite;
	const writeTextIsPatched = window.navigator.clipboard.writeText !== originalClipboardWriteText;
	const execIsPatched = document.execCommand !== originalDocumentExecCommand;
	const restoreExecName = originalDocumentExecCommand.name || 'anonymous';
	const restoreWriteName = originalClipboardWrite.name || 'anonymous';
	const restoreWriteTextName = originalClipboardWriteText.name || 'anonymous';
	
	console.log(`[Rango Debug] Stopping clipboard write interception - currentWriteIsPatched: ${writeIsPatched}, currentWriteTextIsPatched: ${writeTextIsPatched}, currentExecCommandIsPatched: ${execIsPatched}, restoringTo: execCommand=${restoreExecName}, clipboardWrite=${restoreWriteName}, clipboardWriteText=${restoreWriteTextName}`);

	document.execCommand = originalDocumentExecCommand;
	window.navigator.clipboard.write = originalClipboardWrite;
	window.navigator.clipboard.writeText = originalClipboardWriteText;
}

function postMessageClipboardWriteIntercepted(text) {
	window.postMessage(
		{ type: "RANGO_CLIPBOARD_WRITE_INTERCEPTED", text },
		window.location.origin
	);
}

document.querySelector("#rango-clipboard-write-interceptor").remove();

window.postMessage(
	{ type: "RANGO_INTERCEPTOR_LOADED" },
	window.location.origin
);
