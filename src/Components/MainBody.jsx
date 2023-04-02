import React from 'react'
import "./css/mainbody.css";
import ProfileImage from "./Images/img_avatar.png";
import ManageStudent from './ManageStudent';
import UpdateMarks from './UpdateMarks';
import { useState } from 'react';
import ViewAll from './ViewAll';

const MentorID = "M101"
const MentorName = "Mentor 1"
export default function MainBody() {
    const [secManage, setSecManage] = useState(true)
    const [secMarks, setSecMarks] = useState(false)
    const [secView, setSecView] = useState(false)
    const changeSecManage = () => {
        setSecManage(true)
        setSecMarks(false)
        setSecView(false)
    }
    const changeSecMarks = () => {
        setSecManage(false)
        setSecMarks(true)
        setSecView(false)
    }
    const changeSecView = () => {
        setSecManage(false)
        setSecMarks(false)
        setSecView(true)
    }
    return (<>
        <div className='main-body'>
            <div className="left-nav">
                <div className="mentor-profile">
                    <img src={ProfileImage} alt="" className="mentor-profile-img" />
                    <div className="mentor-profile-name">{MentorName}</div>
                </div>
                <div className={`nav-item ${(secManage)?("nav-item-active"):null}`} onClick={changeSecManage}>Manage Students</div>
                <div className={`nav-item ${(secMarks)?("nav-item-active"):null}`} onClick={changeSecMarks}>Update Marks</div>
                <div className={`nav-item ${(secView)?("nav-item-active"):null}`} onClick={changeSecView}>View all Students</div>
            </div>
            <div className="right-main">
                {(secManage) ? (
                    <ManageStudent MentorID={MentorID} />
                ) :
                    (secMarks) ? (
                        <UpdateMarks MentorID={MentorID} />
                    ) : (secView) ? (
                        <ViewAll />
                    ) : null
                }
            </div>
        </div>
    </>
    )
}
