import React, { useState } from "react";
import { Button } from "@mui/material";
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import { useDebounce } from "../../../constants/useDebounce";
import { useGetSearchQueryQuery } from "../../../service/parentDashboard";
import { getFromStorage } from "../../../constants/storage";
import { STORAGE_KEYS } from "../../../constants/storageKeys";
import { useNavigate } from "react-router-dom";

const TopBanner = () => {

    const token = getFromStorage(STORAGE_KEYS.token)
    const navigate = useNavigate();

    return (
        <>
            <section className="hero_banner_sc">
                <div className="conta_iner">
                    <div className="gap_p">
                        <div className="lt_s">
                            <p className="sub_title">BETTER LEARNING FUTURE WITH US</p>
                            <h1>
                                Find the <mark className="high_light">Perfect Tutor</mark> Near
                                You  Anytime, Anywhere At
                                your <strong>preferred cost!</strong>
                            </h1>
                            <p>At TutorHail, we understand the challenges parents and guardians face when searching for the right tutor for their children.</p>
                            <div className="btn_flex">
                                <Button onClick={() =>  navigate("/parent/popular-tutor")} >
                                    Start Learning  <span className="cirle"><ArrowOutwardIcon /></span>
                                </Button>
                                <Button color="inherit" onClick={() => window.open("https://www.youtube.com/@TutorHailApp")}>
                                    <span className="cirle"><PlayArrowIcon /></span> See How it Works?
                                </Button>
                            </div>
                        </div>
                        <div className="rt_s">
                            <figure>
                                <img src={'/static/images/topBannerPic.png'} alt="img" />
                            </figure>
                        </div>
                    </div>
                </div>
            </section>

            <section className="home_counts_sc">
                <div className="conta_iner">
                    <ul>
                        <li>
                            <strong>5,200</strong>
                            <span>Success Stories</span>
                        </li>
                        <li>
                            <strong>8,202</strong>
                            <span>Expert Tutors</span>
                        </li>
                        <li>
                            <strong>45,923</strong>
                            <span>Hours Tutored</span>
                        </li>
                        <li>
                            <strong>70,024</strong>
                            <span>Active Users</span>
                        </li>
                    </ul>
                </div>
            </section>
        </>
    )
}

export default TopBanner;