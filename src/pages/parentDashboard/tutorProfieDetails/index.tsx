import React, { useEffect, useState } from "react";
import { ParentLayout } from "../../../layout/parentLayout";
import { Detailpage } from "../../../components/Detailpage";
import TutorListing from "../../../components/TutorListing";
import { TutorApi, useGetTutorByIdQuery } from "../../../service/tutorApi";
import { useParams } from "react-router-dom";

import Loader from "../../../constants/Loader";

export const TutorProfieDetails = () => {
  const { id } = useParams();
const {data,isLoading}=useGetTutorByIdQuery({id:id});

  return (
    <>
      <ParentLayout className="role-layout">
        <Loader isLoad={isLoading} />
        <main className="content">
          <section className="uh_spc  home_wrp bkng_dtlss">
            <div className="conta_iner v2">
              <div className="tutor_profile gap_m">
                <div className="role_body rt_v2">
                  <Detailpage data={data?.data?.[0] } />
                </div>
                <div className="sidebar_rt">
                  <TutorListing tutor={true} />
                </div>
              </div>
            </div>
          </section>
        </main>
      </ParentLayout>
    </>
  );
};
