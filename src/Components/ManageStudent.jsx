import React, { useState } from 'react';
import ProfileImage from "./Images/student-profile.jpg";
import "./css/managestudents.css";
import { useEffect } from 'react';


export default function ManageStudent(props) {
    const [addedStudents, setAddedStudents] = useState([]);
    const [availableStudents, setAvailableStudents] = useState([]);

    const handleAddStudent = (student) => {
        setAddedStudents([...addedStudents, student]);
        setAvailableStudents(availableStudents.filter(s => s.Uid !== student.Uid));
    }

    const handleRemoveStudent = (student) => {
        setAvailableStudents([...availableStudents, student]);
        setAddedStudents(addedStudents.filter(s => s.Uid !== student.Uid));
    }

    const handleSaveStudent = async () => {
        if (addedStudents.length < 3 || addedStudents.length > 4) {
            alert("Please select minimum 3 and maximum 4 students")
        }
        else {
            var arr = []
            addedStudents.map(student => {
                arr = [...arr, student.Uid]
            })
            console.log(arr)

            await fetch('https://mentorappbackend.azurewebsites.net/save_students', {
                method: 'POST',
                body: JSON.stringify({
                    "MentorId": props.MentorID,
                    "StudentList": arr
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);
                    alert("Students Saved")
                })
                .catch((err) => {
                    console.log(err.message);
                });
        }
    }

    const getAvailableStudents = async () => {
        const res = await fetch("https://mentorappbackend.azurewebsites.net/get_available_students").then((res) => res.json())
        setAvailableStudents(res.Data)
    }
    const getAddedStudents = async () => {
        const res = await fetch(`https://mentorappbackend.azurewebsites.net/get_my_students?MentorID=${props.MentorID}`).then((res) => res.json())
        setAddedStudents(res.Data)
        console.log(res)
    }
    useEffect(() => {
        getAvailableStudents()
        getAddedStudents()
    }, [props])
    return (
        <div>
            <div className='assigned-Students'>
                <h2> My Students</h2>
                <div className="students-list">
                    {(addedStudents.length === 0) ? (<h3> No students added</h3>) : addedStudents.map(student => (
                        <div className="student-profile" key={student.Uid}>
                            <img src={ProfileImage} alt="" className="student-profile-img" />
                            <div className="student-profile-text">{student.Name}</div>
                            <div className="student-profile-text">{student.Uid}</div>
                            <button className='add-remove-btn' onClick={() => handleRemoveStudent(student)}>Remove</button>
                        </div>
                    ))}
                </div>
                <button className='save-btn' onClick={handleSaveStudent}>Save</button>
            </div>
            <h2>Available Students:</h2>
            <div className="students-list">
                {availableStudents.map(student => (
                    <div className="student-profile" key={student.Uid}>
                        <img src={ProfileImage} alt="" className="student-profile-img" />
                        <div className="student-profile-text">{student.Name}</div>
                        <div className="student-profile-text">{student.Uid}</div>
                        <button className='add-remove-btn' onClick={() => handleAddStudent(student)}>Add</button>
                    </div>
                ))}
            </div>
        </div>
    );
}
