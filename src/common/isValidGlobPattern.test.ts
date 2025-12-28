import { isValidGlobPattern } from "./isValidGlobPattern";

describe("isValidGlobPattern", () => {
	test("accepts valid URL patterns with wildcards", () => {
		expect(isValidGlobPattern("*://meet.google.com/*")).toBe(true);
		expect(isValidGlobPattern("*://zoom.us/*")).toBe(true);
		expect(isValidGlobPattern("https://example.com/path")).toBe(true);
	});

	test("accepts patterns with brace expansion", () => {
		expect(
			isValidGlobPattern("https://{meet,teams}.{google,microsoft}.com")
		).toBe(true);
		expect(isValidGlobPattern("*://{a,b,c}.example.com/*")).toBe(true);
	});

	test("accepts patterns with query strings", () => {
		expect(isValidGlobPattern("*://example.com/page?id=*")).toBe(true);
		expect(isValidGlobPattern("https://site.com/?query=value")).toBe(true);
	});

	test("accepts patterns with URL-safe special characters", () => {
		expect(isValidGlobPattern("https://example.com/path#section")).toBe(true);
		expect(isValidGlobPattern("https://user@example.com")).toBe(true);
		expect(isValidGlobPattern("*://example.com/a,b,c")).toBe(true);
	});

	test("rejects patterns with invalid characters", () => {
		expect(isValidGlobPattern("*://example.com/<script>")).toBe(false);
		expect(isValidGlobPattern("*://example.com/>")).toBe(false);
		expect(isValidGlobPattern('*://example.com/"quote"')).toBe(false);
		expect(isValidGlobPattern("*://example.com/path|other")).toBe(false);
		expect(isValidGlobPattern("C:\\Users\\path")).toBe(false);
	});

	test("rejects empty and invalid inputs", () => {
		expect(isValidGlobPattern("")).toBe(false);
		expect(isValidGlobPattern(null as unknown as string)).toBe(false);
		expect(isValidGlobPattern(undefined as unknown as string)).toBe(false);
		expect(isValidGlobPattern(123 as unknown as string)).toBe(false);
	});

	test("rejects patterns with spaces", () => {
		expect(isValidGlobPattern("*://example.com/path with spaces")).toBe(false);
		expect(isValidGlobPattern(" *://example.com/*")).toBe(false);
	});
});
