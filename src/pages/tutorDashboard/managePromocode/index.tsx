/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { TutorLayout } from "../../../layout/tutorLayout";
import { useNavigate } from "react-router-dom";
import { Rating } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { useLazyGetReviewsQuery } from "../../../service/tutorApi";
import { showError } from "../../../constants/toast";
import Loader from "../../../constants/Loader";
import moment from "moment";
import NewSideBarTutor from "../../../components/NewSideBarTutor";

import AddIcon from '@mui/icons-material/Add';
import { AddPromoCodeModal } from "../../../Modals/AddPromoModal";
import { useGetPromoDashboardQuery } from "../../../service/promoCode";





export default function TutorPromoCodes() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const navigate = useNavigate();
  const {data,isLoading}=useGetPromoDashboardQuery({});

  return (
    <>
      <TutorLayout className="role-layout">
        <Loader isLoad={isLoading} />
        <main className="content">
          <section className="uh_spc promo_code home_wrp">
            <div className="conta_iner v2">
              <div className="gap_m grid_2">
                <NewSideBarTutor />
                <div className=" rt_v2">
                  <div className="card_box">
                    <ul className="promo_box">
                      <li>
                        <h2>Create New Promotion</h2>
                        <p>Design time-limited promos that drive student bookings and increase your tutoring revenue.

                        </p>
                        <button className="btn primary" onClick={handleOpen}><AddIcon />New Promotion</button>
                      </li>
                      <li>
                        <a onClick={() => navigate('/tutor/promo-codes/active-promotions')}>
                          <h2>Active Promotions</h2>
                          <h3>{data?.data?.active||"0"}</h3>
                          <p>Click to view Details</p>
                        </a>
                      </li>
                      <li>
                        <a onClick={() => navigate('/tutor/promo-codes/drafts')}>
                          <h2>Drafts</h2>
                          <h3>{data?.data?.draft||"0"}</h3>
                          <p>Click to Manage Drafts</p>
                        </a>
                      </li>
                      <li>
                        <a href="">
                          <h2>Total Users</h2>
                          <h3>{data?.data?.uses||"0"}</h3>
                          <p>Click to view who applied Codes</p>
                        </a>
                      </li>
                      <li>
                        <a href="">
                          <h2>Revenue Boosts</h2>
                          <h3>{data?.data?.boostPercentage?.toFixed(2)||"0"}</h3>
                          <p>Click for Detailed Metrics</p>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </TutorLayout>
      <AddPromoCodeModal handleClose={handleClose} handleOpen={handleOpen} open={open} />

    </>
  );
}
