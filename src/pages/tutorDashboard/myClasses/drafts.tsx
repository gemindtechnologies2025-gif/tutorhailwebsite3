/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { TutorLayout } from "../../../layout/tutorLayout";
import Loader from "../../../constants/Loader";
import NewSideBarTutor from "../../../components/NewSideBarTutor";
import TeaserVideos from "../../../components/TeaserVideos";
import AddVideoRgt from "../../../components/AddVideoRgt";
import { RecommendedClasses } from "../../../components/RecommendedClasses";
import { CLASS_LIST_TYPE, CLASS_SETTING } from "../../../constants/enums";
import { useDeleteClassByIdMutation, useGetClassesForTutorQuery } from "../../../service/class";

interface TutorTeaserVideosProps { }

const TutorClassDrafts: React.FC<TutorTeaserVideosProps> = () => {
  const { data: classData } = useGetClassesForTutorQuery({ setting: CLASS_SETTING.DRAFT, page: 1, limit: 50 });



  return (
    <>
      <TutorLayout className="role-layout">
        <Loader />
        <main className="content">
          <section className="uh_spc home_wrp">
            <div className="conta_iner v2">
              <div className="mn_fdx">
                <NewSideBarTutor />

                <div className="mdl_cntnt">
                  <div className="gap_m ">
                    {classData?.data?.data?.length
                      ? classData?.data?.data?.map((item: any) => {
                        return <RecommendedClasses  data={item} />;
                      })
                      : <div className=" mdl_cntnt video_content no_data">
              <figure>
                <img src="/static/images/noData.png" alt="no data found" />
              </figure>
              <p>No Draft  found</p>
            </div>}
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

export default TutorClassDrafts;
