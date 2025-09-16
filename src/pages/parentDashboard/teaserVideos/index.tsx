import React from "react";
import { TutorLayout } from "../../../layout/tutorLayout";
import Loader from "../../../constants/Loader";
import NewSideBarTutor from "../../../components/NewSideBarTutor";
import TeaserVideos from "../../../components/TeaserVideos";
import AddVideoRgt from "../../../components/AddVideoRgt";
import { ParentLayout } from "../../../layout/parentLayout";
import NewSideBarParent from "../../../components/NewSideBarParent";
import TutorListing from "../../../components/TutorListing";

interface TutorTeaserVideosProps { }



const ParentTeaserVideos: React.FC<TutorTeaserVideosProps> = () => {
  
  return (
    <>
      <ParentLayout className="role-layout">
        <Loader />
        <main className="content">
          <section className="uh_spc  home_wrp">
            <div className="conta_iner v2">
              <div className="mn_fdx">
                <NewSideBarParent />

                <div className="mdl_cntnt">
                  <TeaserVideos />
                </div>
                <div className="sidebar_rt">
                 
                  <TutorListing />



                </div>
              </div>
            </div>
          </section>
        </main>
      </ParentLayout>
    </>
  );
};

export default ParentTeaserVideos;
