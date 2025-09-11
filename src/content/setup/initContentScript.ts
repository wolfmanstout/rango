import { initKeyboardClicking } from "../actions/keyboardClicking";
import { updateCustomSelectors } from "../hints/selectors";
import observe from "../observe";
import { settingsSync } from "../settings/settingsSync";
import { isExcludedSite } from "../../common/isExcludedSite";
import { loadContentScriptContext } from "./contentScriptContext";
import { updateTitleDecorations } from "./decorateTitle";
import { loadDevtoolsUtils } from "./devtoolsUtils";

/**
 * Initializes the content script.
 * Returns early if the current site is in the excluded sites list.
 */
export async function initContentScript() {
	loadDevtoolsUtils();
	await loadContentScriptContext();
	await settingsSync.init();

	// Check if current site should be excluded from Rango functionality
	const excludedSites = settingsSync.get("excludedSites");
	if (isExcludedSite(location.href, excludedSites)) {
		console.debug(
			"Rango: Skipping initialization for excluded site:",
			location.href
		);
		return;
	}

	updateCustomSelectors();
	await updateTitleDecorations();
	await observe();
	if (settingsSync.get("keyboardClicking")) initKeyboardClicking();
}
