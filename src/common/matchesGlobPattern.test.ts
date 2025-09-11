import { matchesGlobPattern } from "./matchesGlobPattern";

describe("matchesGlobPattern", () => {
	test("matches exact URLs", () => {
		expect(
			matchesGlobPattern("https://meet.google.com", ["https://meet.google.com"])
		).toBe(true);
		expect(
			matchesGlobPattern("https://example.com", ["https://meet.google.com"])
		).toBe(false);
	});

	test("matches wildcard patterns", () => {
		expect(
			matchesGlobPattern("https://meet.google.com/abc-def", [
				"*://meet.google.com/*",
			])
		).toBe(true);
		expect(
			matchesGlobPattern("http://meet.google.com/xyz", [
				"*://meet.google.com/*",
			])
		).toBe(true);
		expect(
			matchesGlobPattern("https://zoom.us/j/123", ["*://meet.google.com/*"])
		).toBe(false);
	});

	test("matches multiple patterns", () => {
		const patterns = [
			"*://meet.google.com/*",
			"*://zoom.us/*",
			"*://teams.microsoft.com/*",
		];
		expect(matchesGlobPattern("https://meet.google.com/abc", patterns)).toBe(
			true
		);
		expect(matchesGlobPattern("https://zoom.us/j/123", patterns)).toBe(true);
		expect(
			matchesGlobPattern("https://teams.microsoft.com/l/meetup", patterns)
		).toBe(true);
		expect(matchesGlobPattern("https://slack.com/workspace", patterns)).toBe(
			false
		);
	});

	test("handles question mark wildcards", () => {
		expect(
			matchesGlobPattern("https://a.example.com", ["https://?.example.com"])
		).toBe(true);
		expect(
			matchesGlobPattern("https://ab.example.com", ["https://?.example.com"])
		).toBe(false);
		expect(
			matchesGlobPattern("https://x.example.com", ["https://?.example.com"])
		).toBe(true);
	});

	test("handles brace patterns", () => {
		expect(
			matchesGlobPattern("https://meet.google.com", [
				"https://{meet,teams}.{google,microsoft}.com",
			])
		).toBe(true);
		expect(
			matchesGlobPattern("https://teams.microsoft.com", [
				"https://{meet,teams}.{google,microsoft}.com",
			])
		).toBe(true);
		expect(
			matchesGlobPattern("https://slack.com", [
				"https://{meet,teams}.{google,microsoft}.com",
			])
		).toBe(false);
	});

	test("case insensitive matching", () => {
		expect(
			matchesGlobPattern("https://MEET.GOOGLE.COM/abc-def", ["*://meet.google.com/*"])
		).toBe(true);
		expect(
			matchesGlobPattern("https://meet.google.com/xyz", ["*://MEET.GOOGLE.COM/*"])
		).toBe(true);
	});

	test("handles empty arrays and strings", () => {
		expect(matchesGlobPattern("", [])).toBe(false);
		expect(matchesGlobPattern("https://example.com", [])).toBe(false);
		expect(matchesGlobPattern("", ["*"])).toBe(false);
	});

	test("handles invalid regex patterns gracefully", () => {
		// Should fall back to string contains check
		expect(
			matchesGlobPattern("https://example.com/[invalid", ["*example.com*"])
		).toBe(true);
		expect(matchesGlobPattern("https://other.com", ["*example.com*"])).toBe(
			false
		);
	});

	test("common video conferencing sites", () => {
		const url1 = "https://meet.google.com/abc-defg-hij";
		const url2 = "https://zoom.us/j/1234567890";
		const url3 = "https://teams.microsoft.com/l/meetup-join/meeting_id";
		const url4 = "https://discord.com/channels/123/456";

		const patterns = [
			"*://meet.google.com/*",
			"*://zoom.us/*",
			"*://teams.microsoft.com/*",
		];

		expect(matchesGlobPattern(url1, patterns)).toBe(true);
		expect(matchesGlobPattern(url2, patterns)).toBe(true);
		expect(matchesGlobPattern(url3, patterns)).toBe(true);
		expect(matchesGlobPattern(url4, patterns)).toBe(false);
	});
});
