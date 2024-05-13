/* eslint-disable @typescript-eslint/no-unused-vars */
import { Fragment, useEffect, useState } from "react";
import AutoCompleteText from "./AutoCompleteText";
import { SemesterState, changeCourses, changeSemester, clearAll, getCurriculum, getFaculties } from "../redux/semetser/semesterSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";


export const CourseOffer = function () {
    const { faculty, curriculum, semester, courses } = useSelector((state: RootState) => state.semester);
    const [inputActive, setInputActive] = useState(true);
    const [selectedText, setSelectedText] = useState({});
    const [editing, setEditing] = useState<string>('');

    const dispatch = useDispatch<AppDispatch>();

    function handleClick() {
        dispatch(changeSemester());
    }
    function handleClickmenu() {
        dispatch(changeSemester());
    }

    //   const handleSelectText = (courseId, text) => {
    //     setSelectedText(prev => ({ ...prev, [courseId]: text }));
    //     setInputActive(false);  // Hide the input after selection
    // };

    useEffect(() => {
        dispatch(getCurriculum());
        dispatch(getFaculties());
    }, []);

    const sems = [
        { sno: 1, name: "1st" },
        { sno: 2, name: "2nd" },
        { sno: 3, name: "3rd" },
        { sno: 4, name: "4th" },
        { sno: 5, name: "5th" },
        { sno: 6, name: "6th" },
        { sno: 7, name: "7th" },
        { sno: 8, name: "8th" },
    ];
    const secs = [7, 7, 6, 6].map((s) => [...Array(s).keys()].map((i) => String.fromCharCode(i + 1 + 64)));

    return (
        <div>
            <table>
                <tbody>
                    <tr>
                        <th colSpan={9} style={{ fontWeight: "bold", fontSize: "16pt" }}>
                            <button
                                onClick={handleClick}
                                style={{ cursor: 'pointer', textDecoration: "none", border: 0, color: "blue", fontSize: "20pt", backgroundColor: "transparent" }}
                            >
                                {semester}
                            </button>
                        </th>
                    </tr>
                    <tr>
                        <th style={{ width: "50px" }}>SNo.</th>
                        <th style={{ width: "450px" }}>Title</th>
                        <td colSpan={7} style={{ width: "25px", textAlign: "right" }}>
                            <a href="#" style={{ textDecoration: "none", color: "blue" }} onClick={() => dispatch(clearAll())}>
                                Clear All
                            </a>

                        </td>

                    </tr>
                    {sems.filter(s => semester === 'Fall' ? s.sno % 2 !== 0 : s.sno % 2 === 0)
                        .map((s, scnt) => (
                            <Fragment key={s.sno}>
                                <tr style={{ fontWeight: "bold" }}>
                                    <th colSpan={2}>{s.name} Semester</th>
                                    {Array(7).fill(0).map((_, j) => (
                                        s.sno > 4 && j === 6 ? <td></td> : <th>{String.fromCharCode('A'.charCodeAt(0) + j)}</th>
                                    )
                                    )}
                                </tr>
                                {curriculum.filter(c => c.semno === s.sno)
                                    .map((c, i) => {
                                        const courseFaculty = faculty.filter(d => d.areas.find(e => e.cid === c.cid))

                                        return (
                                            <tr key={c.cid} style={{ height: "25px" }}>
                                                <td style={{ textAlign: "center" }}>{i + 1}</td>
                                                <td>{c.title}</td>
                                                {Array(7).fill(0).map((_, j) => (
                                                    <td onClick={() => setEditing(semester + scnt + i + j)}>
                                                        {
                                                            (s.sno < 5 || j !== 6) && (courses[semester][scnt][i][j] === "" ?
                                                                <AutoCompleteText items={courseFaculty} onChange={(x: string) => { dispatch(changeCourses([scnt, i, j, x])) }} editing={editing === (semester + scnt + i + j)} />
                                                                : courses[semester][scnt][i][j])}
                                                    </td>
                                                )
                                                )}

                                            </tr>
                                        )
                                    })}
                            </Fragment>
                        ))}
                </tbody>
            </table>
        </div>
    );

};
