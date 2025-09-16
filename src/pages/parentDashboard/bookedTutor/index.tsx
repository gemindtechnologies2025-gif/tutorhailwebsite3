/* eslint-disable jsx-a11y/img-redundant-alt */
import { ParentLayout } from "../../../layout/parentLayout";
import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import FilterSidebar from "../common/filterSidebar";
import StarIcon from "@mui/icons-material/Star";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

export default function ParentBookedTutor() {
  const navigate = useNavigate();

  return (
    <>
      <ParentLayout className="role-layout">
        <main className="content">
          <section className="uh_spc pBookedTutor_sc">
            <div className="conta_iner v2">
              <div className="location_bar">
                <button
                  className="back_arrow"
                  onClick={() => navigate("/parent/search-result")}
                >
                  <img src={`/static/images/back.png`} alt="Back" />
                </button>
                <figure>
                  <img src={`/static/images/address_icon.svg`} alt="Icon" />
                </figure>
                <h1>New York, United States</h1>
                <Box component="a">Change</Box>
              </div>
              <div className="parent_dash">
                <div className="gap_m">
                  {/* <FilterSidebar /> */}
                  <div className="rt_s">
                    <div className="dash_title">
                      <h2>Tutors You Booked Previously</h2>
                    </div>
                    <div className="tutor_list gap_m">
                      <div className="tutor_item">
                        <figure>
                          <img src={`/static/images/userNew.png`} alt="Image" />
                          <span className="t_rating">
                            <StarIcon /> 4.5
                          </span>
                          <span className="t_fav">
                            <FavoriteBorderIcon />
                          </span>
                        </figure>
                        <div
                          className="tutor_info"
                          onClick={() => navigate("/parent/tutor-detail")}
                        >
                          <h2>
                            <span>Catherine Bell</span> <ArrowForwardIosIcon />
                          </h2>
                          <p>220+ Classes</p>
                          <p>Maths, Physics, Discrete...</p>
                          <ins>$20/hour</ins>
                          <Button>Book a Class</Button>
                        </div>
                      </div>
                      <div className="tutor_item">
                        <figure>
                          <img src={`/static/images/card2.png`} alt="Image" />
                          <span className="t_rating">
                            <StarIcon /> 4.5
                          </span>
                          <span className="t_fav">
                            <FavoriteBorderIcon />
                          </span>
                        </figure>
                        <div
                          className="tutor_info"
                          onClick={() => navigate("/parent/tutor-detail")}
                        >
                          <h2>
                            <span>Catherine Bell</span> <ArrowForwardIosIcon />
                          </h2>
                          <p>220+ Classes</p>
                          <p>Maths, Physics, Discrete...</p>
                          <ins>$20/hour</ins>
                          <Button>Book a Class</Button>
                        </div>
                      </div>
                      <div className="tutor_item">
                        <figure>
                          <img src={`/static/images/userNew.png`} alt="Image" />
                          <span className="t_rating">
                            <StarIcon /> 4.5
                          </span>
                          <span className="t_fav">
                            <FavoriteBorderIcon />
                          </span>
                        </figure>
                        <div
                          className="tutor_info"
                          onClick={() => navigate("/parent/tutor-detail")}
                        >
                          <h2>
                            <span>Catherine Bell</span> <ArrowForwardIosIcon />
                          </h2>
                          <p>220+ Classes</p>
                          <p>Maths, Physics, Discrete...</p>
                          <ins>$20/hour</ins>
                          <Button>Book a Class</Button>
                        </div>
                      </div>
                      <div className="tutor_item">
                        <figure>
                          <img src={`/static/images/card4.png`} alt="Image" />
                          <span className="t_rating">
                            <StarIcon /> 4.5
                          </span>
                          <span className="t_fav">
                            <FavoriteBorderIcon />
                          </span>
                        </figure>
                        <div
                          className="tutor_info"
                          onClick={() => navigate("/parent/tutor-detail")}
                        >
                          <h2>
                            <span>Catherine Bell</span> <ArrowForwardIosIcon />
                          </h2>
                          <p>220+ Classes</p>
                          <p>Maths, Physics, Discrete...</p>
                          <ins>$20/hour</ins>
                          <Button>Book a Class</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </ParentLayout>
    </>
  );
}
