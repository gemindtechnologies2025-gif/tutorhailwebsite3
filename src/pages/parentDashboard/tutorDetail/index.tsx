/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState } from "react";
import { ParentLayout } from "../../../layout/parentLayout";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import StarIcon from "@mui/icons-material/Star";
import { Avatar, Box, Button, Grid, Rating, Skeleton } from "@mui/material";
import { TutorApi } from "../../../service/tutorApi";
import { TutorDetailsById } from "../../../types/General";
import clsx from "clsx";
import moment from "moment";
import { getFromStorage } from "../../../constants/storage";
import { STORAGE_KEYS } from "../../../constants/storageKeys";

export default function ParentTutorDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const { id } = useParams(); // fetching tutor id from the params
  let timeout: NodeJS.Timeout;
  const token = getFromStorage(STORAGE_KEYS.token)
  // states
  const [loading, setLoading] = useState<boolean>(false); // loading state
  const [data, setData] = useState<TutorDetailsById>(); // state to store the details of the tutor
  const [classTaughtArr, setClassTaughtArr] = useState([
    {
      label: "Pre primary(Kg/Foundation ) ",
      value: "Pre primary(Kg/Foundation ) ",
      id: 0,
    },
    { label: "Primary", value: "Primary", id: 1 },
    {
      label: "Middle school (O-level)",
      value: "Middle school (O-level)",
      id: 2,
    },
    { label: "High school(A-level)", value: "High school(A-level)", id: 3 },
    { label: "College", value: "College", id: 4 },
    { label: "Other", value: "Other", id: 5 },
  ]); // state to check for the tutor subjects

  // API Hooks
  const [getById] = TutorApi.useLazyGetTutorByIdQuery();

  // method check the type of subject tutor teach
  const classTaughtLookup = classTaughtArr?.reduce((acc: any, item) => {
    acc[item?.id] = item?.label;
    return acc;
  }, {});

  // Method to make api call
  const fetchById = async (id: string) => {
    try {
      const res = await getById({ id }).unwrap();
      if (res?.statusCode === 200) {
        setData(res?.data[0]);
        setLoading(false);
      }
    } catch (error) {
      //      console.log(error);
      setLoading(false);
    }
  };

  // useEffect to fetch the tutor details whenever component mounts
  useEffect(() => {
    if (id) {
      setLoading(true);
      timeout = setTimeout(() => {
        fetchById(id);
      }, 1000);
    }
    return () => clearTimeout(timeout);
  }, [id]);

  return (
    <>
      <ParentLayout className="role-layout">
        <main className="content">
          <section className="uhb_spc pTutorProfile_sc">
            <div className="conta_iner v2">
              <div className="role_head">
                <button
                  className="back_arrow"
                  onClick={() => token && state !== "wishlist" ? navigate("/parent/search-result") : token && state == "wishlist" ? navigate("/parent/wishlist") : navigate("/parent/popular-tutor")} >
                  <img src={`/static/images/back.png`} alt="Back" />
                </button>
                <h1 className="hd_3">Tutor Profile Detail</h1>
              </div>
              <div className="role_body">
                <div className="tutorDetail_box">
                  {loading ? (
                    <Skeleton
                      animation="wave"
                      width={340}
                      height={240}
                      variant="rounded"
                    />
                  ) : (
                    <figure className="lt_s">
                      <img
                        src={data?.image || `/static/images/userNew.png`}
                        alt="Image"
                      />
                      {
                        data?.avgRating &&
                        <span>
                          {data?.avgRating && <StarIcon />}
                          {data?.avgRating?.toFixed(1) || ""}{" "}
                          {`(${data?.ratingCount || ""})`}
                        </span>
                      }
                      {data?.documentVerification &&
                        <span className="t_verify">
                          <img
                            src="/static/images/verified.png" alt="img"
                          />
                        </span>}
                    </figure>
                  )}
                  <div className="rt_s">
                    {loading ? null : (
                      <span className="highlight">
                        <img
                          src={`/static/images/star_badge_icon.svg`}
                          alt="Image"
                        />{" "}
                        {data?.teachingdetails?.totalTeachingExperience}+ year
                        Experience
                      </span>
                    )}
                    <h2>
                      {loading ? (
                        <Skeleton variant="text" width={150} height={50} />
                      ) : (
                        data?.name || ""
                      )}
                    </h2>
                    {loading ? (
                      <Skeleton variant="text" width={100} height={30} />
                    ) : (
                      <>
                        <p> Total classes taken :{data?.classCount || "0"}</p>
                        <p>
                          <figure>
                            <img
                              src={`/static/images/address_icon.svg`}
                              alt="Icon"
                            />
                          </figure>{" "}
                          {data?.address || ""}
                        </p>
                      </>
                    )}
                    {/* <p>
                      {loading ? (
                        <Skeleton variant="text" width={100} height={30} />
                      ) : (
                        <>
                          <figure>
                            <img
                              src={`/static/images/address_icon.svg`}
                              alt="Icon"
                            />
                          </figure>{" "}
                          {data?.address || ""}
                        </>
                      )}
                    </p> */}
                    <span
                      className={clsx({
                        cancelled: !data?.isActive && !loading,
                        tag: data?.isActive && !loading,
                      })}
                    >
                      {loading ? (
                        <Skeleton variant="text" width={150} height={60} />
                      ) : data?.isActive ? (
                        "Available"
                      ) : (
                        "Unavailable"
                      )}
                    </span>
                    <hr />
                    <div className="flex">
                      <p>
                        <span>Price</span>
                        {loading ? (
                          <Skeleton variant="text" width={150} height={60} />
                        ) : (
                          <strong>
                            ${data?.teachingdetails?.price || ""}/Hour
                          </strong>
                        )}
                      </p>
                      {loading ? (
                        <Skeleton variant="rounded" width={212} height={50} />
                      ) : (
                        <Button
                          onClick={() =>
                            navigate("/parent/schedule-booking/" + data?._id)
                          }
                        >
                          Schedule Appointment
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                <div className="card_box">
                  <div className="cardBox_head">
                    <h2>General Details</h2>
                  </div>
                  <div className="cardBox_body">
                    <ul className="detail_list">
                      {/* <li>
                        <span>Field of study</span>
                        <strong>{data?.teachingdetails?.}</strong>
                      </li> */}
                      <li>
                        <span>Teaching Language</span>
                        {loading ? (
                          <Skeleton variant="text" width={150} height={40} />
                        ) : (
                          <strong>
                            {data?.teachingdetails?.teachingLanguage === 1
                              ? "English"
                              : data?.teachingdetails?.teachingLanguage === 2
                                ? "Arabic"
                                : "English and Arabic"}
                          </strong>
                        )}
                      </li>

                      <li>
                        <span>Subject</span>
                        {loading ? (
                          <Skeleton variant="text" width={150} height={40} />
                        ) : (
                          <strong>
                            {data?.subjects
                              ?.map((item) => item?.name)
                              .join(" , ") || ""}
                          </strong>
                        )}
                      </li>
                      <li>
                        <span>Grade</span>
                        {loading ? (
                          <Skeleton variant="text" width={150} height={40} />
                        ) : (
                          <strong>
                            {" "}
                            {data?.classes?.length
                              ? [...data.classes]
                                .sort(
                                  (a, b) =>
                                    parseInt(a?.name) - parseInt(b?.name)
                                )
                                .map((item) => classTaughtLookup[item?.name])
                                .join(", ")
                              : null}
                          </strong>
                        )}
                      </li>
                      <li>
                        <span>Gender</span>
                        {loading ? (
                          <Skeleton variant="text" width={150} height={40} />
                        ) : (
                          <strong>{data?.gender || ""}</strong>
                        )}
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="card_box">
                  <div className="cardBox_head">
                    <h2>About</h2>
                  </div>
                  <div className="cardBox_body">
                    {loading ? (
                      <>
                        <Skeleton variant="text" width={"100%"} height={60} />
                        <Skeleton variant="text" width={"100%"} height={60} />
                        <Skeleton variant="text" width={"100%"} height={60} />
                      </>
                    ) : (
                      <ul className="certificate_list">
                        <li>
                          <p>{data?.shortBio || ""}</p>
                        </li>
                      </ul>
                    )}
                  </div>
                </div>
                <div className="card_box">
                  <div className="cardBox_head">
                    <h2>Education</h2>
                  </div>
                  <div className="cardBox_body">
                    {loading ? (
                      <>
                        <Skeleton variant="text" width={"40%"} height={60} />
                        <Skeleton variant="text" width={"40%"} height={60} />
                        <Skeleton variant="text" width={"40%"} height={60} />
                        <Skeleton variant="text" width={"40%"} height={60} />
                        <Skeleton variant="text" width={"40%"} height={60} />
                        <Skeleton variant="text" width={"40%"} height={60} />
                      </>
                    ) : (
                      <ul className="certificate_list">
                        {data?.certificates?.length ? (
                          data?.certificates?.map((item, index) => (
                            <li key={index}>
                              <figure>
                                <img
                                  src={`/static/images/certificate_icon.svg`}
                                  alt="icon"
                                />
                              </figure>
                              <p>
                                <strong>
                                  {item?.institutionName || ""}{" "}

                                </strong>
                                <small>
                                  {item?.description || ""}{" "} {item?.fieldOfStudy ? ("(" + item?.fieldOfStudy + ")") : ("")}
                                  {item?.startDate && item?.endDate ? (
                                    "(" + moment(item?.startDate).format('MMM YYYY') + "-" + moment(item?.endDate).format('MMM YYYY') + ")"
                                  ) : ("")
                                  }


                                </small>
                                {/* {item?.fieldOfStudy ? <span>Field of study : {item?.fieldOfStudy || ""}</span> : ""} */}

                                {/*<small>{moment(item?.startDate).format('DD/MM/YYYY')} - {moment(item?.endDate).format('DD/MM/YYYY')}</small> */}
                              </p>
                            </li>
                          ))
                        ) : (
                          <span>No education details found</span>
                        )}
                      </ul>
                    )}
                  </div>
                </div>
                <div className="card_box">
                  <div className="cardBox_head">
                    <h2>Experience</h2>
                  </div>
                  <div className="cardBox_body">
                    {loading ? (
                      <>
                        <Skeleton variant="text" width={"40%"} height={60} />
                        <Skeleton variant="text" width={"40%"} height={60} />
                        <Skeleton variant="text" width={"40%"} height={60} />
                        <Skeleton variant="text" width={"40%"} height={60} />
                        <Skeleton variant="text" width={"40%"} height={60} />
                        <Skeleton variant="text" width={"40%"} height={60} />
                      </>
                    ) : (
                      <ul className="certificate_list">
                        {data?.achievements?.length ? (
                          data?.achievements?.map((item, index) => (
                            <li key={index}>
                              <figure>
                                <img
                                  src={`/static/images/certificate_icon.svg`}
                                  alt="icon"
                                />
                              </figure>
                              <p>
                                <strong>{item?.description || ""}</strong>
                                <small>{moment(item?.startDate).format('MMMM-YYYY')} - {item?.endDate ? moment(item?.endDate).format('MMMM-YYYY') : "Ongoing"}</small>
                              </p>
                            </li>
                          ))
                        ) : (
                          <span>No Experience details found</span>
                        )}
                      </ul>
                    )}
                  </div>
                </div>

                <div className="card_box">
                  <div className="cardBox_head">
                    <h2>Review & Ratings</h2>
                  </div>
                  <div className="cardBox_body">
                    {loading ? (
                      <Box sx={{ padding: 2 }}>
                        {[1, 2, 3].map((_, index) => (
                          <Grid
                            container
                            spacing={2}
                            key={index}
                            sx={{ marginBottom: 3 }}
                          >
                            <Grid item>
                              <Skeleton variant="circular">
                                <Avatar />
                              </Skeleton>
                            </Grid>
                            <Grid item xs>
                              <Skeleton
                                variant="text"
                                width="50%"
                                height={32}
                              />
                              <Skeleton
                                variant="text"
                                width="30%"
                                height={20}
                              />
                              <Skeleton
                                variant="text"
                                width="10%"
                                height={20}
                              />
                            </Grid>
                          </Grid>
                        ))}
                      </Box>
                    ) : (
                      <ul className="review_list">
                        {data?.ratings?.length ? (
                          data?.ratings?.map((item, index) => (
                            <li key={index}>
                              <figure>
                                <img
                                  src={
                                    item?.parents?.image ||
                                    `/static/images/review3.png`
                                  }
                                  alt="icon"
                                />
                              </figure>
                              <h3>
                                {item?.parents?.name}
                                {/* <span>1mo</span> */}
                              </h3>
                              <Rating
                                name="read-only"
                                value={item?.rating}
                                readOnly
                                emptyIcon={<StarIcon />}
                              />
                              <p>{item?.review || ""}</p>
                            </li>
                          ))
                        ) : (
                          <span>No Review and ratings found</span>
                        )}
                      </ul>
                    )}
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
