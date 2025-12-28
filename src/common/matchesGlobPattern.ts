/**
 * Converts a glob pattern to a regular expression for URL matching.
 * Supports * wildcard and {a,b} brace expansion.
 */
function globToRegex(pattern: string): RegExp {
	// Escape special regex characters (including ? which is treated as literal)
	let regexPattern = pattern
		.replaceAll(/[.+^$()[\]\\?]/g, "\\$&")
		.replaceAll("*", ".*"); // * matches any sequence

	// Handle brace expansion: {a,b} becomes (a|b)
	// Replace commas with pipes only inside the brace groups
	regexPattern = regexPattern.replaceAll(
		/{([^}]+)}/g,
		(_, content: string) => `(${content.replaceAll(",", "|")})`
	);

	return new RegExp(`^${regexPattern}$`, "i");
}

/**
 * Checks if a URL matches any of the provided glob patterns.
 *
 * @param url - The URL to test (typically location.href)
 * @param patterns - Array of glob patterns to match against
 * @returns True if the URL matches any pattern, false otherwise
 *
 * @example
 * matchesGlobPattern('https://meet.google.com/abc-def', ['*://meet.google.com/*'])
 * // returns true
 *
 * matchesGlobPattern('https://example.com', ['*://meet.google.com/*', '*://zoom.us/*'])
 * // returns false
 */
export function matchesGlobPattern(url: string, patterns: string[]): boolean {
	if (!url || patterns.length === 0) return false;

	return patterns.some((pattern) => {
		try {
			const regex = globToRegex(pattern);
			return regex.test(url);
		} catch {
			// If pattern conversion fails, fall back to simple string matching (case insensitive)
			return url.toLowerCase().includes(pattern.toLowerCase());
		}
	});
}
