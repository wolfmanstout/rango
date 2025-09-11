import { matchesGlobPattern } from "./matchesGlobPattern";

/**
 * Checks if the current site should be excluded from Rango functionality
 * based on the configured exclusion patterns.
 *
 * @param url - The URL to check (typically location.href)
 * @param excludedPatterns - Array of glob patterns for excluded sites
 * @returns True if the site should be excluded, false otherwise
 *
 * @example
 * isExcludedSite('https://meet.google.com/abc-def', ['*://meet.google.com/*'])
 * // returns true
 */
export function isExcludedSite(
	url: string,
	excludedPatterns: string[]
): boolean {
	return matchesGlobPattern(url, excludedPatterns);
}
