/**
 * @jest-environment jsdom
 */

import { hasVisibleText } from "./hasVisibleText";

describe("hasVisibleText", () => {
	beforeEach(() => {
		document.body.innerHTML = "";
	});

	describe("Icon and Image Detection", () => {
		test("should return false for img elements (should be hinted)", () => {
			document.body.insertAdjacentHTML(
				"beforeend",
				'<img src="test.jpg" alt="Test Image">'
			);
			const img = document.body.lastElementChild!;

			expect(hasVisibleText(img)).toBe(false);
		});

		test("should return false for svg elements (should be hinted)", () => {
			document.body.insertAdjacentHTML(
				"beforeend",
				'<svg><circle cx="50" cy="50" r="40" /></svg>'
			);
			const svg = document.body.lastElementChild!;

			expect(hasVisibleText(svg)).toBe(false);
		});

		test("should return false for canvas elements (should be hinted)", () => {
			document.body.insertAdjacentHTML("beforeend", "<canvas></canvas>");
			const canvas = document.body.lastElementChild!;

			expect(hasVisibleText(canvas)).toBe(false);
		});

		test("should return false for video elements (should be hinted)", () => {
			document.body.insertAdjacentHTML(
				"beforeend",
				'<video src="test.mp4"></video>'
			);
			const video = document.body.lastElementChild!;

			expect(hasVisibleText(video)).toBe(false);
		});

		test("should return false for audio elements (should be hinted)", () => {
			document.body.insertAdjacentHTML(
				"beforeend",
				'<audio src="test.mp3"></audio>'
			);
			const audio = document.body.lastElementChild!;

			expect(hasVisibleText(audio)).toBe(false);
		});

		test("should return false for elements with role='img' (should be hinted)", () => {
			document.body.insertAdjacentHTML(
				"beforeend",
				'<div role="img">Icon</div>'
			);
			const div = document.body.lastElementChild!;

			expect(hasVisibleText(div)).toBe(false);
		});

		test("should return false for Font Awesome icons", () => {
			document.body.insertAdjacentHTML(
				"beforeend",
				'<i class="fa-solid fa-home"></i>'
			);
			const icon = document.body.lastElementChild!;

			expect(hasVisibleText(icon)).toBe(false);
		});

		test("should return false for generic icon elements", () => {
			document.body.insertAdjacentHTML(
				"beforeend",
				'<i class="icon-search"></i>'
			);
			const icon = document.body.lastElementChild!;

			expect(hasVisibleText(icon)).toBe(false);
		});

		test("should return false for Material Icons", () => {
			document.body.insertAdjacentHTML(
				"beforeend",
				'<i class="material-icons">search</i>'
			);
			const icon = document.body.lastElementChild!;

			expect(hasVisibleText(icon)).toBe(false);
		});
	});

	describe("Regular Elements with Text", () => {
		test("should return true for elements with meaningful text", () => {
			document.body.insertAdjacentHTML(
				"beforeend",
				"<button>Click Me</button>"
			);
			const button = document.body.lastElementChild!;

			expect(hasVisibleText(button)).toBe(true);
		});

		test("should return false for elements with only whitespace", () => {
			document.body.insertAdjacentHTML("beforeend", "<div>   \n  \t  </div>");
			const div = document.body.lastElementChild!;

			expect(hasVisibleText(div)).toBe(false);
		});

		test("should return false for elements with single letter", () => {
			document.body.insertAdjacentHTML("beforeend", "<button>x</button>");
			const button = document.body.lastElementChild!;

			expect(hasVisibleText(button)).toBe(false);
		});

		test("should return true for elements with single digit", () => {
			document.body.insertAdjacentHTML("beforeend", "<button>5</button>");
			const button = document.body.lastElementChild!;

			expect(hasVisibleText(button)).toBe(true);
		});

		test("should return false for elements with only symbols", () => {
			document.body.insertAdjacentHTML("beforeend", "<button>×</button>");
			const button = document.body.lastElementChild!;

			expect(hasVisibleText(button)).toBe(false);
		});

		test("should return true for elements with multi-character text", () => {
			document.body.insertAdjacentHTML(
				"beforeend",
				"<span>Save Document</span>"
			);
			const span = document.body.lastElementChild!;

			expect(hasVisibleText(span)).toBe(true);
		});

		test("should return false for empty elements", () => {
			document.body.insertAdjacentHTML("beforeend", "<div></div>");
			const div = document.body.lastElementChild!;

			expect(hasVisibleText(div)).toBe(false);
		});
	});

	describe("Input Elements", () => {
		test("should return true for input with value", () => {
			document.body.insertAdjacentHTML("beforeend", '<input type="text">');
			const input = document.body.lastElementChild! as HTMLInputElement;
			input.value = "User input text";

			expect(hasVisibleText(input)).toBe(true);
		});

		test("should return true for input with placeholder", () => {
			document.body.insertAdjacentHTML(
				"beforeend",
				'<input type="text" placeholder="Enter your name">'
			);
			const input = document.body.lastElementChild!;

			expect(hasVisibleText(input)).toBe(true);
		});

		test("should return false for input with single letter value", () => {
			document.body.insertAdjacentHTML("beforeend", '<input type="text">');
			const input = document.body.lastElementChild! as HTMLInputElement;
			input.value = "x";

			expect(hasVisibleText(input)).toBe(false);
		});

		test("should return true for input with single digit value", () => {
			document.body.insertAdjacentHTML("beforeend", '<input type="text">');
			const input = document.body.lastElementChild! as HTMLInputElement;
			input.value = "7";

			expect(hasVisibleText(input)).toBe(true);
		});

		test("should return false for input with empty value and no placeholder", () => {
			document.body.insertAdjacentHTML("beforeend", '<input type="text">');
			const input = document.body.lastElementChild!;

			expect(hasVisibleText(input)).toBe(false);
		});

		test("should return true for textarea with value", () => {
			document.body.insertAdjacentHTML("beforeend", "<textarea></textarea>");
			const textarea = document.body.lastElementChild! as HTMLTextAreaElement;
			textarea.value = "Long text content";

			expect(hasVisibleText(textarea)).toBe(true);
		});

		test("should return true for textarea with placeholder", () => {
			document.body.insertAdjacentHTML(
				"beforeend",
				'<textarea placeholder="Write your message here"></textarea>'
			);
			const textarea = document.body.lastElementChild!;

			expect(hasVisibleText(textarea)).toBe(true);
		});

		test("should prioritize input value over placeholder", () => {
			document.body.insertAdjacentHTML(
				"beforeend",
				'<input type="text" placeholder="x">'
			);
			const input = document.body.lastElementChild! as HTMLInputElement;
			input.value = "ab";

			expect(hasVisibleText(input)).toBe(true);
		});
	});

	describe("Select Elements", () => {
		test("should return true for select with meaningful options", () => {
			document.body.insertAdjacentHTML(
				"beforeend",
				`
				<select>
					<option value="1">Option One</option>
					<option value="2">Option Two</option>
				</select>
			`
			);
			const select = document.body.lastElementChild!;

			expect(hasVisibleText(select)).toBe(true);
		});

		test("should return false for select with only single letter options", () => {
			document.body.insertAdjacentHTML(
				"beforeend",
				`
				<select>
					<option value="a">A</option>
					<option value="b">B</option>
				</select>
			`
			);
			const select = document.body.lastElementChild!;

			expect(hasVisibleText(select)).toBe(false);
		});

		test("should return true for select with single digit options", () => {
			document.body.insertAdjacentHTML(
				"beforeend",
				`
				<select>
					<option value="1">1</option>
					<option value="2">2</option>
				</select>
			`
			);
			const select = document.body.lastElementChild!;

			expect(hasVisibleText(select)).toBe(true);
		});

		test("should return false for select with empty options", () => {
			document.body.insertAdjacentHTML(
				"beforeend",
				`
				<select>
					<option value="1"></option>
					<option value="2">  </option>
				</select>
			`
			);
			const select = document.body.lastElementChild!;

			expect(hasVisibleText(select)).toBe(false);
		});

		test("should return true for select with mix of letters and meaningful options", () => {
			document.body.insertAdjacentHTML(
				"beforeend",
				`
				<select>
					<option value="a">A</option>
					<option value="full">Full Option Name</option>
				</select>
			`
			);
			const select = document.body.lastElementChild!;

			expect(hasVisibleText(select)).toBe(true);
		});

		test("should return true for select with mix of digits and letters", () => {
			document.body.insertAdjacentHTML(
				"beforeend",
				`
				<select>
					<option value="1">1</option>
					<option value="a">A</option>
				</select>
			`
			);
			const select = document.body.lastElementChild!;

			expect(hasVisibleText(select)).toBe(true);
		});

		test("should return false for empty select", () => {
			document.body.insertAdjacentHTML("beforeend", "<select></select>");
			const select = document.body.lastElementChild!;

			expect(hasVisibleText(select)).toBe(false);
		});
	});

	describe("Form Labels", () => {
		test("should return true for input with associated label (for attribute)", () => {
			document.body.insertAdjacentHTML(
				"beforeend",
				`
				<label for="test-input">Username</label>
				<input type="text" id="test-input">
			`
			);
			const input = document.body.querySelector("input")!;

			expect(hasVisibleText(input)).toBe(true);
		});

		test("should return true for input wrapped in label", () => {
			document.body.insertAdjacentHTML(
				"beforeend",
				`
				<label>
					Email Address
					<input type="email">
				</label>
			`
			);
			const input = document.body.querySelector("input")!;

			expect(hasVisibleText(input)).toBe(true);
		});

		test("should return false for input with single letter label", () => {
			document.body.insertAdjacentHTML(
				"beforeend",
				`
				<label for="test-input">A</label>
				<input type="text" id="test-input">
			`
			);
			const input = document.body.querySelector("input")!;

			expect(hasVisibleText(input)).toBe(false);
		});

		test("should return true for input with single digit label", () => {
			document.body.insertAdjacentHTML(
				"beforeend",
				`
				<label for="test-input">3</label>
				<input type="text" id="test-input">
			`
			);
			const input = document.body.querySelector("input")!;

			expect(hasVisibleText(input)).toBe(true);
		});

		test("should return true for textarea with associated label", () => {
			document.body.insertAdjacentHTML(
				"beforeend",
				`
				<label for="comment">Your Comment</label>
				<textarea id="comment"></textarea>
			`
			);
			const textarea = document.body.querySelector("textarea")!;

			expect(hasVisibleText(textarea)).toBe(true);
		});

		test("should return true for select with associated label", () => {
			document.body.insertAdjacentHTML(
				"beforeend",
				`
				<label for="country">Select Country</label>
				<select id="country"></select>
			`
			);
			const select = document.body.querySelector("select")!;

			expect(hasVisibleText(select)).toBe(true);
		});

		test("should prioritize element text over label text", () => {
			document.body.insertAdjacentHTML(
				"beforeend",
				`
				<label for="test-input">Short Label</label>
				<input type="text" id="test-input">
			`
			);
			const input = document.body.querySelector("input")!;
			input.value = "User entered text";

			expect(hasVisibleText(input)).toBe(true);
		});

		test("should handle input without id but with wrapping label", () => {
			document.body.insertAdjacentHTML(
				"beforeend",
				`
				<label>
					Password
					<input type="password">
				</label>
			`
			);
			const input = document.body.querySelector("input")!;

			expect(hasVisibleText(input)).toBe(true);
		});
	});

	describe("Edge Cases", () => {
		test("should handle null textContent gracefully", () => {
			document.body.insertAdjacentHTML("beforeend", "<div></div>");
			const div = document.body.lastElementChild!;
			Object.defineProperty(div, "textContent", {
				value: null,
				writable: true,
			});

			expect(hasVisibleText(div)).toBe(false);
		});

		test("should handle elements with single digit", () => {
			document.body.insertAdjacentHTML("beforeend", "<span>0</span>");
			const span = document.body.lastElementChild!;

			expect(hasVisibleText(span)).toBe(true);
		});

		test("should handle elements with multiple digits", () => {
			document.body.insertAdjacentHTML("beforeend", "<span>42</span>");
			const span = document.body.lastElementChild!;

			expect(hasVisibleText(span)).toBe(true);
		});

		test("should handle elements with mixed text and numbers", () => {
			document.body.insertAdjacentHTML("beforeend", "<div>Page 1 of 10</div>");
			const div = document.body.lastElementChild!;

			expect(hasVisibleText(div)).toBe(true);
		});

		test("should handle elements with special characters mixed with text", () => {
			document.body.insertAdjacentHTML(
				"beforeend",
				"<button>Save & Exit</button>"
			);
			const button = document.body.lastElementChild!;

			expect(hasVisibleText(button)).toBe(true);
		});

		test("should return false for elements with only punctuation", () => {
			document.body.insertAdjacentHTML("beforeend", "<span>...</span>");
			const span = document.body.lastElementChild!;

			expect(hasVisibleText(span)).toBe(false);
		});

		test("should handle input elements that are not form controls", () => {
			document.body.insertAdjacentHTML(
				"beforeend",
				"<div>Regular div content</div>"
			);
			const div = document.body.lastElementChild!;

			expect(hasVisibleText(div)).toBe(true);
		});

		test("should handle complex icon class combinations", () => {
			document.body.insertAdjacentHTML(
				"beforeend",
				'<i class="fas fa-solid fa-home icon-large"></i>'
			);
			const icon = document.body.lastElementChild!;

			expect(hasVisibleText(icon)).toBe(false);
		});

		test("should handle icons with nested content", () => {
			document.body.insertAdjacentHTML(
				"beforeend",
				'<i class="icon-search"><span>nested content</span></i>'
			);
			const icon = document.body.lastElementChild!;

			expect(hasVisibleText(icon)).toBe(false);
		});
	});

	describe("Complex Scenarios", () => {
		test("should handle label with nested elements", () => {
			document.body.insertAdjacentHTML(
				"beforeend",
				`
				<label for="test-input">Required <span class="required">*</span> Email</label>
				<input type="email" id="test-input">
			`
			);
			const input = document.body.querySelector("input")!;

			expect(hasVisibleText(input)).toBe(true);
		});

		test("should handle inputs with text content (unusual but possible)", () => {
			document.body.insertAdjacentHTML("beforeend", '<input type="text">');
			const input = document.body.lastElementChild!;
			input.textContent = "Button-like input";

			expect(hasVisibleText(input)).toBe(true);
		});

		test("should handle multiple labels for same input (should use first found)", () => {
			document.body.insertAdjacentHTML(
				"beforeend",
				`
				<label for="multi-label">First Label</label>
				<label for="multi-label">x</label>
				<input type="text" id="multi-label">
			`
			);
			const input = document.body.querySelector("input")!;

			expect(hasVisibleText(input)).toBe(true);
		});

		test("should handle input with both associated and wrapping label", () => {
			document.body.insertAdjacentHTML(
				"beforeend",
				`
				<label for="dual-label">Associated Label</label>
				<label>
					Wrapping Label
					<input type="text" id="dual-label">
				</label>
			`
			);
			const input = document.body.querySelector("input")!;

			expect(hasVisibleText(input)).toBe(true);
		});
	});
});
