/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';

const Footer = () => {
    const navigate = useNavigate();
    return (
        <footer id="footer" className="site_footer">
            <div className="conta_iner">
                <div className="inner">
                    <div className="single">
                        <a onClick={() => navigate("/")} className="site_logo">
                            <figure>
                                <img src={`/static/images/logoFooter.png`} alt="TutorHail" />
                            </figure>
                        </a>
                        <p>Our website simplifies the process of finding and booking a home tutor. With a user-friendly interface, you can easily search for qualified tutors in your area based on subject expertise, availability, and user reviews. Detailed tutor profiles and a secure booking system.</p>
                    </div>
                    <div className="single">
                        <ul className="footer_nav">
                            <li>
                                <a
                                    target="_blank"
                                    onClick={() => { navigate("/about-us"); window.scroll(0, 0) }}
                                >
                                    ABOUT US
                                </a>
                            </li>
                            <li>
                                <a
                                    target="_blank"
                                    onClick={() => { navigate("/contact-us"); window.scroll(0, 0) }}
                                >
                                    CONTACT US
                                </a>
                            </li>
                            <li>
                                <a
                                    target="_blank"
                                    onClick={() => { navigate("/faq"); window.scroll(0, 0) }}
                                >
                                    FAQ'S
                                </a>
                            </li>
                            <li>
                                <a
                                    target="_blank"
                                    onClick={() => { navigate("/eula"); window.scroll(0, 0) }}
                                >
                                    EULA
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="single flex">
                        <ul className="footer_nav">
                            <li>
                                <a
                                    target="_blank"
                                    onClick={() => { navigate("/terms-and-conditions"); window.scroll(0, 0) }}
                                >
                                    TERMS & CONDITIONS
                                </a>
                            </li>
                            <li>
                                <a
                                    target="_blank"
                                    onClick={() => { navigate("/privacy-policy"); window.scroll(0, 0) }}
                                >
                                    PRIVACY POLICY
                                </a>
                            </li>
                        </ul>

                        <div className="social_links">
                            <p>FOLLOW US</p>
                            <ul>
                                <li>
                                    <a onClick={() => window.open("https://www.facebook.com/profile.php?id=61559631136591")} >
                                        <figure>
                                            <img src={`/static/images/fb.png`} alt=" Logo" />
                                        </figure>
                                    </a>
                                </li>
                                <li>
                                    <a onClick={() => window.open("https://www.instagram.com/tutorhail?igsh=MWExZno1YjBjdGdvag==")} >
                                        <figure>
                                            <img src={`/static/images/insta.png`} alt=" Logo" />
                                        </figure>
                                    </a>
                                </li>
                                <li>
                                    <a onClick={() => window.open("https://x.com/TutorHailApp")} >
                                        <figure>
                                            <img src={`/static/images/twitter.png`} alt=" Logo" />
                                        </figure>
                                    </a>
                                </li>
                                <li>
                                    <a  onClick={() => window.open("https://www.linkedin.com/company/tutorhail/")} >
                                        <figure  style={{ marginTop: "4px" }}>
                                            <img  width={"6%"} src={`/static/images/linkdin1.png`} alt=" Logo" />
                                        </figure>
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <form className="form">
                            <div className="control_group">
                                <TextField hiddenLabel placeholder="Enter your Email"></TextField>
                                <Button>Subscribe</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </footer >
    )
}

export default Footer;