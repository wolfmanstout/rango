/**
 * Validates if a string is a valid glob pattern by checking for common glob syntax
 * and ensuring it doesn't contain invalid characters.
 */
export function isValidGlobPattern(pattern: string): boolean {
	if (!pattern || typeof pattern !== "string") return false;

	// Check for invalid characters that could break URL matching
	const invalidChars = /[<>"|\\]/;
	if (invalidChars.test(pattern)) return false;

	// Basic validation - pattern should be reasonable for URL matching
	// Allow common glob characters: *, ?, [], {}, and valid URL characters
	const validGlobPattern = /^[\w\-.~:/?#@!$&'()*+,;=[\]{}]+$/;

	return validGlobPattern.test(pattern);
}
