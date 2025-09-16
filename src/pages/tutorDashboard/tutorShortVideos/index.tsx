import React from "react";
import { TutorLayout } from "../../../layout/tutorLayout";
import Loader from "../../../constants/Loader";
import NewSideBarTutor from "../../../components/NewSideBarTutor";
import TeaserVideos from "../../../components/TeaserVideos";
import AddVideoRgt from "../../../components/AddVideoRgt";
import AddShortVideo from "../../../components/AddShortVideo";
import { useLocation } from "react-router-dom";

interface TutorTeaserVideosProps { }



const TutorShortVideos: React.FC<TutorTeaserVideosProps> = () => {
    const location = useLocation();
    const { state } = location;



    return (
        <>
            <TutorLayout className="role-layout">
                <Loader />
                <main className="content">
                    <section className="uh_spc  home_wrp">
                        <div className="conta_iner v2">
                            <div className="mn_fdx">
                                <NewSideBarTutor />

                                <div className="mdl_cntnt">
                                    <TeaserVideos shortVideo={true} />
                                </div>
                                <div className="sidebar_rt">
                                    <AddShortVideo edit={state ? true : false} data={state?.edit ? state?.data : null} />
                                    <section className="side_menu_wrap  page_link">
                                        <ul>
                                            <li>
                                                <a>About Us</a>
                                            </li>
                                            <li>
                                                <a>Contact Us</a>
                                            </li>
                                            <li>
                                                <a>Help Center</a>
                                            </li>
                                            <li>
                                                <a>Terms & conditions</a>
                                            </li>
                                            <li>
                                                <a>Privacy Policy</a>
                                            </li>
                                            <li>
                                                <a>FAQ’s</a>
                                            </li>
                                        </ul>
                                    </section>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </TutorLayout>
        </>
    );
};

export default TutorShortVideos;
