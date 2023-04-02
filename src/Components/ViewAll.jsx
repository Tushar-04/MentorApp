import { React, useState, useEffect } from 'react'
import ProfileImage from "./Images/student-profile.jpg";
import "./css/updatemarks.css";

export default function ViewAll() {
    const [allStudentList, setAllStudentList] = useState([])
    const [StudentList, setStudentList] = useState([])
    const getAllStudents = async () => {
        const res = await fetch(`https://mentorappbackend.azurewebsites.net/get_all_students`).then((res) => res.json())
        setAllStudentList(res.Data)
        setStudentList(res.Data)
        console.log(res)
    }
    useEffect(() => {
        getAllStudents()
    }, [])
    const handleFilter = (e) => {
        console.log(e.target.value)
        if (e.target.value == "all") {

            setStudentList(allStudentList)
        }
        else if (e.target.value == "assigned") {
            const temp = allStudentList

            setStudentList(temp.filter(s => s.MarksAssigned == true))
        }
        else {
            const temp = allStudentList
            setStudentList(temp.filter(s => s.MarksAssigned == false))
        }
    }
    return (
        <div>
            <h3>All Students</h3>
            <h3>Filter: </h3>
            <select onChange={handleFilter}>
                <option value="all" >All</option>
                <option value="assigned" >Marks assigned</option>
                <option value="notAssigned" >Marks not assigned</option>

            </select>
            <div className="students-list-marks">
                {StudentList.map(student => (
                    <div className="student-profile-marks" key={student.Uid}>
                        <div className="student-profile-marks-left">
                            <img src={ProfileImage} alt="" className="student-profile-img" />
                            <div className="student-profile-marks-text">{student.Name}</div>
                            <div className="student-profile-marks-text">{student.Uid}</div>
                        </div>
                        <div className="student-profile-marks-right">
                            <h3>Marks: {(!student.MarksAssigned) ? (<>Not assigned yet</>) : null}</h3>
                            <div className="student-profile-marks-text">Idea: {student.Marks.Idea}/10</div>
                            <div className="student-profile-marks-text">Execution: {student.Marks.Execution}/10</div>
                            <div className="student-profile-marks-text">Viva: {student.Marks.Viva}/10</div>
                            <div className="student-profile-marks-text">Total: {student.Marks.Total}/30</div>
                        </div>
                    </div>)
                )
                }
            </div>
        </div>
    )
}