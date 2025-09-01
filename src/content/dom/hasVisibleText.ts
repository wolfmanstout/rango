/**
 * Utility functions for detecting visible text content in elements.
 * Used to determine if elements should be labeled based on their text content.
 */

/**
 * Checks if an element is an icon, image, or visual-only element
 * that should always be hintable regardless of text content.
 */
function isIconOrImage(element: Element): boolean {
	return element.matches(
		"img, svg, i[class*='icon'], i[class*='fa-'], [role='img'], canvas, video, audio"
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

	// For container elements, check if they're mostly interactive vs mostly text
	if (element.matches("div, nav, section, header, footer, main")) {
		const interactiveChildren = element.querySelectorAll(
			"button, a, input, select, textarea, [role='button'], [role='link']"
		);
		const textLength = allText.length;
		const interactiveCount = interactiveChildren.length;

		// If there are many interactive children relative to text, treat as container
		if (interactiveCount > 0 && textLength / interactiveCount < 10) {
			return false;
		}
	}

	// For all other elements, if they have text content > 1 char, they have visible text
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

	// Check for actual visible text content
	const hasText = hasActualVisibleText(element);

	// Special handling for interactive elements
	if (
		element.matches(
			"button, [role='button'], a, [role='link'], input, textarea"
		)
	) {
		let textContent: string | undefined;

		if (element.matches("input, textarea")) {
			const inputElement = element as HTMLInputElement | HTMLTextAreaElement;
			textContent =
				inputElement.value?.trim() ||
				inputElement.placeholder?.trim() ||
				element.textContent?.trim();
		} else {
			textContent = element.textContent?.trim();
		}

		// If it's very short text (single character), should be hinted
		if (!textContent || textContent.length <= 1) {
			return false;
		}

		return hasText;
	}

	return hasText;
}
