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
 * Checks if an element has accessible text through ARIA attributes or title.
 */
function hasAriaText(element: Element): boolean {
	return (
		element.hasAttribute("aria-label") ||
		element.hasAttribute("aria-labelledby") ||
		element.hasAttribute("title")
	);
}

/**
 * Checks if an element is an unlabeled form control that should be hintable.
 */
function isUnlabeledFormControl(element: Element): boolean {
	if (!element.matches("input, select, textarea")) return false;

	// Check for associated label element
	const id = element.getAttribute("id");
	const associatedLabel = id
		? document.querySelector(`label[for="${id}"]`)
		: null;
	const wrappingLabel = element.closest("label");

	return !associatedLabel && !wrappingLabel && !hasAriaText(element);
}

/**
 * Checks if an element has meaningful visible text content.
 * This looks for substantial text that would serve as a clear label.
 */
function hasActualVisibleText(element: Element): boolean {
	// Get direct text content (not from descendants)
	const directText = Array.from(element.childNodes)
		.filter((node) => node.nodeType === Node.TEXT_NODE)
		.map((node) => node.textContent?.trim())
		.join(" ")
		.trim();

	// If there's substantial direct text, consider it as having text
	if (directText && directText.length > 2 && /\w{2,}/.test(directText)) {
		return true;
	}

	// For elements that typically contain only text (like paragraphs, headings)
	if (element.matches("p, h1, h2, h3, h4, h5, h6, span, div")) {
		const allText = element.textContent?.trim();
		if (allText && allText.length > 3 && /\w{3,}/.test(allText)) {
			// Check if this is mostly text vs mostly interactive elements
			const interactiveChildren = element.querySelectorAll(
				"button, a, input, select, textarea, [role='button'], [role='link']"
			);
			const textLength = allText.length;
			const interactiveCount = interactiveChildren.length;

			// If there are many interactive children relative to text, treat as container
			if (interactiveCount > 0 && textLength / interactiveCount < 10) {
				return false;
			}

			return true;
		}
	}

	return false;
}

/**
 * Determines if an element contains visible text content.
 *
 * Elements are considered to have "no visible text" (and thus should be hinted) if they are:
 * - Icons, images, or visual-only elements
 * - Unlabeled form controls
 * - Elements without meaningful visible text content
 *
 * Elements are considered to have "visible text" (and thus should NOT be hinted) if they:
 * - Have ARIA labels or titles
 * - Contain meaningful visible text content
 *
 * @param element The element to check
 * @returns false if element should be hinted (no visible text), true if it has visible text
 */
export function hasVisibleText(element: Element): boolean {
	// Always hint icons, images, and unlabeled controls
	if (isIconOrImage(element) || isUnlabeledFormControl(element)) {
		return false; // Treat as "no visible text" so it gets hinted
	}

	// Elements with ARIA text are considered as having text (unless they're also images/icons)
	if (hasAriaText(element) && !isIconOrImage(element)) {
		return true;
	}

	// Check for actual visible text content
	const hasText = hasActualVisibleText(element);

	// Special handling for interactive elements
	if (element.matches("button, [role='button'], a, [role='link']")) {
		const textContent = element.textContent?.trim();

		// If it's very short text or contains mainly icons, should be hinted
		if (!textContent || textContent.length <= 2) {
			return false;
		}

		// Check if it's mainly an icon with some text
		const hasImageIcon = element.querySelector(
			"img, svg, i[class*='icon'], i[class*='fa-'], [role='img']"
		);
		if (hasImageIcon && textContent.length <= 10) {
			return false; // Icon buttons with short labels should still be hinted
		}

		return hasText;
	}

	return hasText;
}
