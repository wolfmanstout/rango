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
 * Gets the text content from associated labels for form controls.
 * This helper function extracts label text that can be used for voice targeting.
 */
function getAssociatedLabelText(element: Element): string | undefined {
	if (!element.matches("input, select, textarea")) return undefined;

	// Check for associated label element
	const id = element.getAttribute("id");
	const associatedLabel = id
		? document.querySelector(`label[for="${id}"]`)
		: null;
	const wrappingLabel = element.closest("label");

	// Return the first available label text
	return (
		associatedLabel?.textContent?.trim() ?? wrappingLabel?.textContent?.trim()
	);
}

/**
 * Checks if an element has meaningful visible text content.
 * This looks for substantial text that would serve as a clear label,
 * including text from the element itself and associated labels.
 */
function hasActualVisibleText(element: Element): boolean {
	// Get visible text from element - for inputs, check value/placeholder
	let elementText: string | undefined;

	if (element.matches("input, textarea")) {
		const inputElement = element as HTMLInputElement | HTMLTextAreaElement;
		// For input elements, check value first, then placeholder, then text content
		elementText =
			inputElement.value?.trim() ??
			inputElement.placeholder?.trim() ??
			element.textContent?.trim();
	} else if (element.matches("select")) {
		// For select elements, check if there are meaningful options
		const selectElement = element as HTMLSelectElement;
		const options = Array.from(selectElement.options);
		const meaningfulOptions = options.filter(
			(option) =>
				option.textContent?.trim() && option.textContent.trim().length > 1
		);
		// If there are meaningful options, the select has targetable content
		if (meaningfulOptions.length > 0) {
			return true;
		}

		elementText = element.textContent?.trim();
	} else {
		// For other elements, use text content
		elementText = element.textContent?.trim();
	}

	// Check for associated label text for form controls
	const labelText = getAssociatedLabelText(element);

	// Combine all available text sources
	const allText = elementText ?? labelText;

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
 * - Interactive elements with only single characters or symbols
 * - Form controls without any visible text (no value, placeholder, or label)
 *
 * Elements are considered to have "targetable text" (and thus should NOT be hinted) if they:
 * - Contain multi-character visible text that can be spoken to target the element
 * - Have associated labels that provide targetable text
 * - Are form controls with meaningful values, placeholders, or option text
 *
 * @param element The element to check
 * @returns false if element should be hinted (no targetable text), true if it has targetable text
 */
export function hasVisibleText(element: Element): boolean {
	// Always hint icons and images - these are purely visual elements
	if (isIconOrImage(element)) {
		return false; // No targetable text, so should be hinted
	}

	// For all elements (including form controls), check if they have meaningful visible text
	return hasActualVisibleText(element);
}
