/**
 * Utility functions for detecting visible text content in elements.
 * Used to determine if elements should be hinted based on their text content.
 */

/**
 * Checks if an element is an icon, image, or visual-only element
 * that should always be hintable regardless of text content.
 */
function isIconOrImage(element: Element): boolean {
	return element.matches(
		// Standard image and media elements
		"img, svg, canvas, video, audio, " +
			// Elements with semantic image role
			"[role='img'], " +
			// Icon font patterns - <i> tags with icon-related classes
			"i[class*='icon'], " + // Generic icon libraries (Material Icons, Bootstrap Icons, etc.)
			"i[class*='fa-']" // Font Awesome icons (fa-solid, fa-regular, fa-home, etc.)
	);
}

/**
 * Checks if an element is an unlabeled form control that should be hintable.
 */
function isUnlabeledFormControl(element: Element): boolean {
	if (!element.matches("input, select, textarea")) return false;

	// Input buttons (submit, button, reset) with value are self-labeled
	if (element.matches("input")) {
		const inputElement = element as HTMLInputElement;
		const type = inputElement.type;

		if (["submit", "button", "reset"].includes(type)) {
			// These input types are self-labeled by their value attribute
			const value = inputElement.value?.trim();
			if (value && value.length > 1) {
				return false; // Has visible text via value, not unlabeled
			}
		}
	}

	// Check for associated label element
	const id = element.getAttribute("id");
	const associatedLabel = id
		? document.querySelector(`label[for="${id}"]`)
		: null;
	const wrappingLabel = element.closest("label");

	return !associatedLabel && !wrappingLabel;
}

/**
 * Checks if an element has meaningful visible text content.
 * This looks for substantial text that would serve as a clear label.
 */
function hasActualVisibleText(element: Element): boolean {
	// Get visible text from element - for inputs, check value/placeholder
	let allText: string | undefined;

	if (element.matches("input, textarea")) {
		const inputElement = element as HTMLInputElement | HTMLTextAreaElement;
		// For input elements, check value first, then placeholder, then text content
		allText =
			inputElement.value?.trim() ||
			inputElement.placeholder?.trim() ||
			element.textContent?.trim();
	} else {
		// For other elements, use text content
		allText = element.textContent?.trim();
	}

	// If no text at all, definitely no visible text
	if (!allText || allText.length <= 1 || !/\w+/.test(allText)) {
		return false;
	}

	// If element has meaningful text content, it has visible text
	return true;
}

/**
 * Determines if an element contains visible text content that can be targeted by voice.
 *
 * The principle: If an element has visible text that can be targeted using voice text selection,
 * then it doesn't need a Rango hint. Only elements without targetable text need hints.
 *
 * Elements are considered to have "no targetable text" (and thus should be hinted) if they are:
 * - Icons, images, or visual-only elements
 * - Form controls without visible labels
 * - Interactive elements with only single characters or symbols
 *
 * Elements are considered to have "targetable text" (and thus should NOT be hinted) if they:
 * - Contain multi-character visible text that can be spoken to target the element
 *
 * @param element The element to check
 * @returns false if element should be hinted (no targetable text), true if it has targetable text
 */
export function hasVisibleText(element: Element): boolean {
	// Always hint icons, images, and unlabeled controls - these can't be targeted by voice text selection
	if (isIconOrImage(element) || isUnlabeledFormControl(element)) {
		return false; // No targetable text, so should be hinted
	}

	// For all other elements, check if they have meaningful visible text
	return hasActualVisibleText(element);
}
