import React from "react";
import { TutorLayout } from "../../../layout/tutorLayout";
import Loader from "../../../constants/Loader";
import NewSideBarTutor from "../../../components/NewSideBarTutor";
import TeaserVideos from "../../../components/TeaserVideos";
import AddVideoRgt from "../../../components/AddVideoRgt";
import { useGetContentQuery } from "../../../service/content";
import { CONTENT_TYPE } from "../../../constants/enums";
import { useNavigate } from "react-router-dom";

interface TutorTeaserVideosProps { }

const TutorTeaserVideosDraft: React.FC<TutorTeaserVideosProps> = () => {
  const { data } = useGetContentQuery({
    setting: 2,
    contentType: CONTENT_TYPE.TEASER_VIDEO,
    page: 1,
    limit: 100,
  });
  const navigate = useNavigate();
  return (
    <>
      <TutorLayout className="role-layout">
        <Loader />
        <main className="content">
          <section className="uh_spc  home_wrp">
            <div className="conta_iner v2">
              <div className="mn_fdx">
                <NewSideBarTutor />

                <div className="mdl_cntnt tsr_v2">
                  <div className="tsr_wp">
                    <div className="gap_m">
                      {data?.data?.data?.length
                        ? data?.data?.data?.map((item: any, index: number) => {
                          return (
                            <div
                              style={{ cursor: 'pointer' }}
                              className="video-card"
                              onClick={() => navigate("/tutor/TutorTeaserVideos", { state: { edit: true, data: item } })}
                            >
                              <video
                                src={
                                  item?.images?.[0] ||
                                  "/static/videos/sample.mp4"
                                } // replace with actual video url
                                muted
                                preload="metadata"
                                playsInline
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                              />

                              <div className="play-button">
                                <span>
                                  <img
                                    src={`/static/images/play_icn.svg`}
                                    alt="Play"
                                  />
                                </span>
                              </div>

                              <div className="video-details">
                                <h4>{item?.title || ""}</h4>

                              </div>
                            </div>
                          );
                        })
                        : <div className=" mdl_cntnt video_content no_data">
                          <figure>
                            <img src="/static/images/noData.png" alt="no data found" />
                          </figure>
                          <p>No Draft found</p>
                        </div>
                      }
                    </div>
                  </div>
                </div>
                <div className="sidebar_rt">
                  <section className="side_menu_wrap unlock_bg ">
                    <div className="group">
                      <h4>Unlock Learning, Book Your Perfect Tutor Today!</h4>
                      <button>Book Now</button>
                    </div>
                    <figure>
                      <img
                        src={`/static/images/unlock_men.png`}
                        alt="unlock_men"
                      />
                    </figure>
                  </section>

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

export default TutorTeaserVideosDraft;
