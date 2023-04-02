import { React, useState, useEffect } from 'react';
import ProfileImage from "./Images/student-profile.jpg";
import "./css/updatemarks.css";

export default function UpdateMarks(props) {
  const [editView, setEditView] = useState(false)
  const [StudentList, setStudentList] = useState([])
  const [editId, setEditID] = useState()

  const [ideaMarks, setIdeaMarks] = useState(0)
  const [executionMarks, setExecutionMarks] = useState(0)
  const [vivaMarks, setVivaMarks] = useState(0)

  const getAddedStudents = async () => {
    const res = await fetch(`https://mentorappbackend.azurewebsites.net/get_my_students?MentorID=${props.MentorID}`).then((res) => res.json())
    setStudentList(res.Data)
    console.log(res)
  }

  useEffect(() => {
    getAddedStudents()
  }, [])
  const handleEditView = (student) => {
    setEditView(true)
    setEditID(student.Uid)
    console.log(student.Uid)
  }

  const checkMarks = () => {
    console.log(ideaMarks)
    if ((ideaMarks < 0 || ideaMarks > 10) ||
      (executionMarks < 0 || executionMarks > 10) ||
      (vivaMarks < 0 || vivaMarks > 10)
    ) {
      alert("Please enter marks in range of 0-10")
      console.log("false")
      return false
    }
    else {
      console.log("true")
      return true
    }
  }
  const saveMarks = async () => {
    if (checkMarks()) {
      await fetch('https://mentorappbackend.azurewebsites.net/save_marks', {
        method: 'POST',
        body: JSON.stringify({
          "Uid": editId,
          "Marks": {
            "Idea": ideaMarks,
            "Execution": executionMarks,
            "Viva": vivaMarks,
            "Total": parseInt(ideaMarks) + parseInt(vivaMarks) + parseInt(executionMarks),
          }
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          alert("Students Marks Saved")
        })
        .catch((err) => {
          console.log(err.message);
        });

      getAddedStudents()
      setEditView(false)
    }
  }

  const submitMarks = async () => {
    if (checkMarks()) {
      const confirm = window.confirm("Do you really want to submit? Marks will be locked and you cannot edit it.")
      if (confirm) {
        await fetch('https://mentorappbackend.azurewebsites.net/submit_marks', {
          method: 'POST',
          body: JSON.stringify({
            "Uid": editId,
            "Marks": {
              "Idea": ideaMarks,
              "Execution": executionMarks,
              "Viva": vivaMarks,
              "Total": parseInt(ideaMarks) + parseInt(vivaMarks) + parseInt(executionMarks),
            }
          }),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            alert("Students Marks Submited")
          })
          .catch((err) => {
            console.log(err.message);
          });

        getAddedStudents()
        setEditView(false)
      }
    }
  }
  return (
    <>
      <h2>My Students</h2>
      <div className="students-list-marks">
        {(StudentList.length == 0) ? (
          <h4> No students added. Please add some students</h4>
        ) : (
          <>
            {StudentList.map(student => (
              <div className="student-profile-marks" key={student.Uid}>
                <div className="student-profile-marks-left">
                  <img src={ProfileImage} alt="" className="student-profile-img" />
                  <div className="student-profile-marks-text">{student.Name}</div>
                  <div className="student-profile-marks-text">{student.Uid}</div>
                  {
                    (student.MarksLocked) ? (<h3>Marks Locked</h3>) :
                      (<button className='update-btn' onClick={event => handleEditView(student)} >Edit</button>)
                  }
                </div>
                <div className="student-profile-marks-right">
                  {(editView && editId === student.Uid) ? (
                    <>
                      <h3>Marks:</h3>
                      <div className="student-profile-marks-text">Idea: <input className='marks-input' type="number" placeholder='0' onChange={e => setIdeaMarks(e.target.value)} /></div>
                      <div className="student-profile-marks-text">Execution: <input className='marks-input' type="number" placeholder='0' onChange={e => setExecutionMarks(e.target.value)} /></div>
                      <div className="student-profile-marks-text">Viva: <input className='marks-input' type="number" placeholder='0' onChange={e => setVivaMarks(e.target.value)} /></div>
                      <br />
                      <br />
                      <button className='update-btn' onClick={() => saveMarks()} >Save</button>
                      <button className='update-btn' onClick={() => submitMarks()} >Submit</button>
                    </>

                  ) : (
                    <>
                      <h3>Marks: {(!student.MarksAssigned) ? (<>Not assigned yet</>) : null}</h3>
                      <div className="student-profile-marks-text">Idea: {student.Marks.Idea}/10</div>
                      <div className="student-profile-marks-text">Execution: {student.Marks.Execution}/10</div>
                      <div className="student-profile-marks-text">Viva: {student.Marks.Viva}/10</div>
                      <div className="student-profile-marks-text">Total: {student.Marks.Total}/30</div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </>
  )
}
