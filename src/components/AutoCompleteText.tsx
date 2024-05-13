/* eslint-disable @typescript-eslint/no-unused-vars */
import { ChangeEvent, KeyboardEvent, useEffect, useState } from "react";
import "./AutoCompleteText.css";
import { Faculty, Props, State } from "./types";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { facultyCount } from "../redux/semetser/semesterSlice";

export default function AutoCompleteText(props: Props) {

	const dispatch = useDispatch<AppDispatch>();
	const semester = useSelector((state: RootState) => state.semester.semester);
	const [state, setState] = useState<State>({
		suggesions: [],
		text: "",
		SelectedIndex: 0,
	});

	useEffect(() => {
		if (!props.editing) {
			setState({ ...state, text: "", suggesions: [] });
		}
	}, [props.editing]);

	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		//console.log(e.key);
		if (e.key === "ArrowDown" && state.SelectedIndex !== state.suggesions.length - 1) {
			// down key
			setState({ ...state, SelectedIndex: state.SelectedIndex + 1 });
		} else if (e.key === "ArrowUp" && state.SelectedIndex !== 0) {
			// up key
			setState({ ...state, SelectedIndex: state.SelectedIndex - 1 });
		} else if (e.key === "Escape") {
			// escape key
			setState({ ...state, suggesions: [], text: "", SelectedIndex: 0 });
		} else if (e.key === "Enter") {
			// enter key
			if (e.currentTarget.value !== "") {
				suggestionSelected(state.suggesions[state.SelectedIndex]);
			}
		}
	};

	const onTextChanged = (e: ChangeEvent<HTMLInputElement>) => {
		const { items } = props;
		const value = e.currentTarget.value;

		let suggesions: Faculty[] = [];
		if (value.length > 0) {
			const regex = new RegExp(`${value}`, "i");
			suggesions = items.filter((i) => regex.test(i.TeacherName) && i.counts[semester] < (i.fulltime ? 4 : 2));
		}

		setState({ ...state, suggesions, text: value, SelectedIndex: 0 });
	};

	const suggestionSelected = (value: Faculty) => {
		console.log("Suggestion Selected: ", value);
		setState({ ...state, text: "", suggesions: [] });
		dispatch(facultyCount(value.fid));
		props.onChange(value.TeacherName);
	};

	const renderSuggestion = () => {
		if (state.suggesions.length === 0) {
			return null;
		}

		return (
			<ul>
				{state.suggesions.sort((a, b) => +b.fulltime - +a.fulltime).map((item, i) => (
					<li key={i} onClick={() => suggestionSelected(item)} className={(i === state.SelectedIndex ? "selected " : "") + (item.fulltime ? 'permanent' : '')} >
						{item.TeacherName}
					</li>
				))}
			</ul>
		);
	};

	return (
		<div className="AutoCompleteText">
			<input value={state.text} onChange={onTextChanged} onKeyDown={handleKeyDown} type="text" style={{ width: "185px", ...!props.editing && { border: 'none' } }} />
			{renderSuggestion()}
		</div>
	);
}

