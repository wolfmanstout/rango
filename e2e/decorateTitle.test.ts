import { TargetType } from "puppeteer";
import { sleep } from "./utils/testHelpers";

// There is another tab open before the current one that also gets a marker.
// That's why we have to use this one.
const tabMarker = "B";

async function getServiceWorker() {
	const workerTarget = await browser.waitForTarget(
		(target) => target.type() === TargetType.SERVICE_WORKER
	);
	return (await workerTarget.worker())!;
}

async function setSetting<T>(key: string, value: T) {
	const worker = await getServiceWorker();
	await worker.evaluate(
		async ({ key, value }) => {
			await chrome.storage.sync.set({ [key]: value });
		},
		{ key, value }
	);
}

beforeAll(async () => {
	await page.goto("http://localhost:8080/basic.html");
});

afterAll(async () => {
	// Reset setting to default
	await setSetting("useCompactTabMarkerDelimiter", false);
});

test("The URL and the tab marker are attached to the title", async () => {
	await sleep(500);

	const title = await page.title();

	expect(title).toBe(
		`${tabMarker} | Document - http://localhost:8080/basic.html`
	);
});

test("If something in the page changes and the URL changes it updates the title", async () => {
	await page.evaluate(() => {
		document.body.innerHTML = "<h1>New page</h1>";
		history.pushState({}, "", "new.html");
	});

	await sleep(200);

	const title = await page.title();

	expect(title).toBe(
		`${tabMarker} | Document - http://localhost:8080/new.html`
	);
});

test("If the hash changes the URL in the title is updated", async () => {
	await page.evaluate(() => {
		document.body.innerHTML =
			"<h1 id='first'>New page</h1><a href='#first'>First</a>";
		document.querySelector("a")?.click();
	});

	await sleep(200);

	const title = await page.title();

	expect(title).toBe(
		`${tabMarker} | Document - http://localhost:8080/new.html#first`
	);
});

test("Compact delimiter uses | instead of  |  when setting is enabled", async () => {
	await setSetting("useCompactTabMarkerDelimiter", true);
	await page.goto("http://localhost:8080/basic.html");
	await sleep(500);

	const title = await page.title();

	expect(title).toBe(
		`${tabMarker}|Document - http://localhost:8080/basic.html`
	);
});
