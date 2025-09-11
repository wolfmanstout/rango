import { useRef } from "react";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./ExcludeKeysSetting.css";

type ExcludedSitesSettingProps = {
	readonly value: string[];
	onChange(value: string[]): void;
};

export function ExcludedSitesSetting({
	value,
	onChange,
}: ExcludedSitesSettingProps) {
	const addSiteButtonRef = useRef<HTMLButtonElement>(null);

	function handleChange(
		event: React.ChangeEvent<HTMLInputElement>,
		index: number
	) {
		const result = value.map((pattern, i) => {
			if (i === index) {
				return event.target.value;
			}

			return pattern;
		});

		onChange(result);
	}

	function handleNewItem() {
		onChange([...value, ""]);
	}

	function handleDeletion(index: number) {
		onChange(value.filter((_, i) => i !== index));
		addSiteButtonRef.current?.focus();
	}

	return (
		<div className="ExcludeKeysSetting">
			<p>Excluded sites</p>

			<p className="explanation">
				Exclude sites from Rango functionality using glob patterns. Examples:{" "}
				<code>*://meet.google.com/*</code>, <code>*://zoom.us/*</code>,
				<code>*://teams.microsoft.com/*</code>. Use * to match any sequence, ?
				for single characters.
			</p>

			{value.length > 0 && (
				<div className="row header">
					<p>Site pattern</p>
				</div>
			)}

			{value.map((pattern, index) => (
				// eslint-disable-next-line react/no-array-index-key
				<div key={index} className="row">
					<input
						autoFocus={index === value.length - 1 && !pattern}
						type="text"
						name="pattern"
						aria-label="site pattern"
						placeholder="e.g., *://meet.google.com/*"
						value={pattern}
						onChange={(event) => {
							handleChange(event, index);
						}}
					/>
					<button
						type="button"
						aria-label={
							pattern === ""
								? "Delete blank pattern on row " +
									(index + 1) +
									" of " +
									value.length
								: "Delete pattern '" +
									pattern +
									"' on row " +
									(index + 1) +
									" of " +
									value.length
						}
						onClick={() => {
							handleDeletion(index);
						}}
					>
						<FontAwesomeIcon
							icon={faTrash}
							size="lg"
							style={{ color: "var(--red-500)" }}
						/>
					</button>
				</div>
			))}
			<button
				ref={addSiteButtonRef}
				className="button-add"
				type="button"
				onClick={() => {
					handleNewItem();
				}}
			>
				<FontAwesomeIcon
					icon={faPlus}
					size="lg"
					style={{ color: "var(--green-500)", marginRight: "0.25em" }}
				/>
				Add site to exclude
			</button>
		</div>
	);
}
