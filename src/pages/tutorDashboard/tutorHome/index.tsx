import React, { useEffect, useRef, useState } from "react";
import { TutorLayout } from "../../../layout/tutorLayout";
import Loader from "../../../constants/Loader";
import NewSideBarTutor from "../../../components/NewSideBarTutor";
import { Detailpage } from "../../../components/Detailpage";
import { useLazyGetDocsQuery, useLazyGetTeachingDetailsQuery } from "../../../service/tutorProfileSetup";
import { ProfileCard } from "../../../components/ProfileCard";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import Slider from "react-slick";
import BorderColorIcon from '@mui/icons-material/BorderColor';

import {
  CLASS_SETTING,
  Class_Variables,
  CONTENT_TYPE,
  EDUCATION_ENUM_DISPLAY,
  ForumType,
  GRADE_TYPE_NAME,
  POST_TYPE,
  TUTOR_DETAILS_ENUMS,
} from "../../../constants/enums";
import { RecommendedClasses } from "../../../components/RecommendedClasses";
import { Box, Rating, Stack, TextField } from "@mui/material";
import { useGetContentQuery } from "../../../service/content";
import useAuth from "../../../hooks/useAuth";
import Upvote from "../../../components/Upvote";
import { useGetClassesForTutorQuery } from "../../../service/class";
import { AddFormAndDisscussion } from "../../../Modals/AddFormAndDisscussion";
import { AddPostModal } from "../../../Modals/AddPostModel";
import CURRENCY from "../../../constants/Currency";
import { TruncatedList, TruncatedText } from "../../../utils/truncateText";
import { VideoCard } from "../../../components/VideoCard";
import AddPollModal from "../../../Modals/addPollModal";
import { getFromStorage, setToStorage } from "../../../constants/storage";
import { STORAGE_KEYS } from "../../../constants/storageKeys";
import { useAppDispatch } from "../../../hooks/store";
import { setCredentials } from "../../../reducers/authSlice";
import { showError, showToast } from "../../../constants/toast";
import { useUpdateProfileMutation } from "../../../service/auth";
import { UploadMedia } from "../../../utils/mediaUpload";

export const TutorHomePage = () => {
  const [getDetails] = useLazyGetTeachingDetailsQuery();
  const [selected, setSelected] = useState<number>(TUTOR_DETAILS_ENUMS.POST);
  const userDetails = useAuth();

  const [updateStatus] = useUpdateProfileMutation();
  const [image, setImage] = useState<string>('');
  const [getDocs] = useLazyGetDocsQuery();
  const [education, setEducation] = useState<any>();
  const [experience, setExperience] = useState<any>();
  const [type, setType] = useState<number>(POST_TYPE.IMAGE);
  const { data: classData } = useGetClassesForTutorQuery({
    setting: CLASS_SETTING.PUBLISH,
    limit: 1,
    page: 1,
  });

  const sliderRef = useRef<any | null>(null);
  const settings = {
    infinite: false,
    slidesToShow: 1.4,
    slidesToScroll: 1,
    arrows: false,
    dots: false,
  };
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [details, setDetails] = useState<any>();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const token = getFromStorage(STORAGE_KEYS.token) || null;
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const changeBanner = async (image: string) => {
    const body = {
      bannerImg: image,
    };

    try {
      const res = await updateStatus(body).unwrap();
      if (res?.statusCode == 200) {
        setToStorage(STORAGE_KEYS.user, res?.data || null);

        dispatch(
          setCredentials({
            user: res?.data || null,
            token: token || null,
          })
        );
        showToast("Banner updated successfully");
      }
    } catch (error: any) {
      showError(error?.data?.message);
    }
  };

  const fetchDocs = async () => {
    try {
      const res = await getDocs({ documentType: 3 }).unwrap();
      if (res?.statusCode === 200) {
        setEducation(res?.data?.document);
      }
    } catch (error: any) {
      // showError(error?.data?.message);
      //      console.log(error, "error in fetchdocs");
    }
  };
  const fetchDocsExp = async () => {
    try {
      const res = await getDocs({ documentType: 2 }).unwrap();
      if (res?.statusCode === 200) {
        setExperience(res?.data?.document);
      }
    } catch (error: any) {
      // showError(error?.data?.message);
      //      console.log(error, "error in fetchdocs");
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target;
    const file = files?.files?.length ? files?.files[0] : "";
    if (file) {
      if (file.type.startsWith("image/")) {
        const res = await UploadMedia(file);
        if (res?.statusCode === 200) {
          //  setImage(URL.createObjectURL(file));
          setImage(res?.data?.url);
          changeBanner(res?.data?.image)
        } else {
          setImage('')
          showError(res?.message);
        }
      } else {
        showError("Failed to upload image");
      }
    }
  };


  const { data: contentData, isLoading } = useGetContentQuery({
    type: ForumType.SELF,
    contentType:
      selected == TUTOR_DETAILS_ENUMS.FORUM
        ? CONTENT_TYPE.FORUM
        : selected == TUTOR_DETAILS_ENUMS.VIDEO
          ? CONTENT_TYPE.TEASER_VIDEO
          : selected == TUTOR_DETAILS_ENUMS.POST
            ? CONTENT_TYPE.POST : selected == TUTOR_DETAILS_ENUMS.DOCUMENT
              ? CONTENT_TYPE.POST
              : CONTENT_TYPE.FORUM,
    page: 1,
    limit: 1,
  });

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const res = await getDetails({}).unwrap();
      if (res?.statusCode === 200) {
        setDetails(res?.data?.[0]);
      }
      setLoading(false);
    } catch (error: any) {
      console.log(error?.data);
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchDetails();
    fetchDocs();
    fetchDocsExp();
  }, []);

  return (
    <>
      <TutorLayout className="role-layout">
        <Loader isLoad={loading} />
        <main className="content">
          <section className="uh_spc home_wrp tutor_home_sc">
            <div className="conta_iner v2">
              <div className="mn_fdx ">
                <NewSideBarTutor />
                <div className="mdl_cntnt tutor_home_rt">
                  <div className="thoughts">
                    <div className="th_row">
                      <figure>
                        <img src={userDetails?.image || `/static/images/user.png`} alt="amelia" />
                      </figure>
                      <div className="input_group">
                        <TextField
                          hiddenLabel
                          variant="filled"
                          inputProps={{ readOnly: true }}
                          onClick={handleOpen}
                          value={"Start a Post"}
                        />
                        <div className="th_btm_row">
                          <ul>
                            <li onClick={() => {
                              setType(POST_TYPE.IMAGE);
                              handleOpen();
                            }}>
                              <img src="/static/images/gallery.svg" alt="" />
                              <p>Image</p>
                            </li>
                            <li onClick={() => {
                              setType(POST_TYPE.VIDEO);
                              handleOpen();
                            }}>
                              <img src="/static/images/video.svg" alt="" />
                              <p>Video</p>
                            </li>
                            <li onClick={() => {
                              setType(POST_TYPE.DOCUMENT);
                              handleOpen();
                            }}>
                              <img src="/static/images/document.svg" alt="" />
                              <p>Document</p>
                            </li>
                            <li onClick={() => {
                              setOpen1(true)
                            }}>
                              <img src="/static/images/poll.svg" alt="" />
                              <p>Poll</p>
                            </li>
                          </ul>

                        </div>
                      </div>
                      <AddPostModal
                        handleClose={handleClose}
                        handleOpen={handleOpen}
                        open={open}
                        type={type}
                      />
                    </div>
                  </div>


                  <div className="tutor_profile_details mn_booking_dtls">
                    <div className="card_inr">
                      <figure>
                        <img src={userDetails?.bannerImg || `/static/images/profile_bg.png`} alt="" />
                        <figcaption>
                          <span className="dot"></span>
                          {userDetails?.isActive ? "Live" : "Offline"}


                        </figcaption>
                        <span>
                          <BorderColorIcon />
                          <input accept="image/*" onChange={handleImageUpload} type="file" />
                        </span>
                      </figure>
                      <Box sx={{ width: "100%" }}>
                        <div className="card_mn profile_card">
                          <div className="profile_lt">
                            <figure>
                              <img
                                src={
                                  userDetails?.image || `/static/images/Emma2.png`
                                }
                                alt=""
                              />
                            </figure>
                            <div>
                              <h2>{userDetails?.name || "-"}</h2>
                              <p>
                                {userDetails?.userName || "-"}{" "}
                                <span>
                                  <button className="btn primary">
                                    {userDetails?.followers || 0} Followers
                                  </button>
                                </span>
                              </p>
                              <p className="exp">
                                Exp:{" "}
                                {details?.totalTeachingExperience
                                  ? details?.totalTeachingExperience + " Years"
                                  : ""}
                              </p>
                            </div>
                          </div>
                          <div className="profile_rt">
                            <p>
                              Price
                              <span>{CURRENCY?.find((item) => item.currency == details?.country)?.symbol || '$'}{details?.price || "0"}/hour</span>
                            </p>
                          </div>
                        </div>
                      </Box>
                    </div>

                    <section className="syllabus_card ">
                      <ul className="rw_top">
                        <TruncatedList
                          items={details?.subjectIds}
                          maxItems={4}
                        />
                        {/* {details?.subjectIds?.length
                          ? details?.subjectIds?.map((item: any) => {
                            return <li>{item?.name} </li>;
                          })
                          : null} */}
                      </ul>
                      <ul className="rw_md">
                        <li>
                          <span>
                            <img src={`/static/images/clock.svg`} alt="" />
                          </span>
                          {moment(details?.startTime).format("LT")} -{" "}
                          {moment(details?.endTime).format("LT")}
                        </li>

                        <li>
                          {" "}
                          <span>
                            <img src={`/static/images/wallet.svg`} alt="" />{" "}
                          </span>
                          {CURRENCY?.find((item) => item.currency == details?.country)?.symbol || '$'}{details?.price || "0"}/hour

                        </li>
                        <li>
                          {" "}
                          <span>
                            {" "}
                            <img
                              src={`/static/images/profiless.svg`}
                              alt=""
                            />{" "}
                          </span>
                          {userDetails?.gender || ""}
                        </li>
                        {details?.achievement ? (
                          <li>
                            {" "}
                            <span>
                              <img src={`/static/images/travel-bag.svg`} alt="" />{" "}
                            </span>
                            {details?.achievement || ""}
                          </li>
                        ) : null}

                        <li>
                          {" "}
                          <span>
                            {" "}
                            <img src={`/static/images/Book.svg`} alt="" />{" "}
                          </span>{" "}
                          {details?.classes?.length
                            ? details?.classes
                              ?.map((item: any) => GRADE_TYPE_NAME[item])
                              .join(", ")
                            : null}
                        </li>
                      </ul>
                      <ul className=" rw_top rw_btm">
                        <li> {userDetails?.views || 0} Viewers</li>
                        <li>{userDetails?.bookCount || 0} {" "}Classes</li>
                        <li>
                          {
                            EDUCATION_ENUM_DISPLAY[
                            details?.higherEdu ? Number(details?.higherEdu) : 5
                            ]
                          }
                        </li>
                      </ul>
                    </section>

                    <section className="syllabus_card">
                      <h2>Information</h2>
                      <TruncatedText
                        text={userDetails?.shortBio || ""}
                        maxWords={100}
                      />
                      {/* <p dangerouslySetInnerHTML={{ __html: userDetails?.shortBio || "" }} /> */}
                    </section>

                    <section className="syllabus_card">
                      <h2>Activity</h2>
                      <ul className="cstmm_tabs ">
                        <li
                          onClick={() => setSelected(TUTOR_DETAILS_ENUMS.POST)}
                          className={
                            selected == TUTOR_DETAILS_ENUMS.POST
                              ? "green"
                              : "simple"
                          }
                        >
                          Posts
                        </li>
                        <li
                          onClick={() => setSelected(TUTOR_DETAILS_ENUMS.VIDEO)}
                          className={
                            selected == TUTOR_DETAILS_ENUMS.VIDEO
                              ? "green"
                              : "simple"
                          }
                        >
                          Videos{" "}
                        </li>
                        <li
                          onClick={() => setSelected(TUTOR_DETAILS_ENUMS.CLASS)}
                          className={
                            selected == TUTOR_DETAILS_ENUMS.CLASS
                              ? "green"
                              : "simple"
                          }
                        >
                          Classes{" "}
                        </li>

                        <li
                          onClick={() =>
                            setSelected(TUTOR_DETAILS_ENUMS.DOCUMENT)
                          }
                          className={
                            selected == TUTOR_DETAILS_ENUMS.DOCUMENT
                              ? "green"
                              : "simple"
                          }
                        >
                          Documents{" "}
                        </li>
                        <li
                          onClick={() => setSelected(TUTOR_DETAILS_ENUMS.FORUM)}
                          className={
                            selected == TUTOR_DETAILS_ENUMS.FORUM
                              ? "green"
                              : "simple"
                          }
                        >
                          Forums{" "}
                        </li>
                      </ul>
                      {selected == TUTOR_DETAILS_ENUMS.CLASS ? (
                        <div
                          ref={sliderRef}
                          {...settings}
                          className="venue_slider"
                        >
                          {classData?.data?.data?.length
                            ? classData?.data?.data?.map((item: any) => {
                              return <RecommendedClasses data={item} />;
                            })
                            : null}
                        </div>
                      ) :
                        selected == TUTOR_DETAILS_ENUMS.POST ?
                          (
                            <div
                              ref={sliderRef}
                              {...settings}
                              className="venue_slider"
                            >
                              {contentData?.data?.data?.length
                                ? contentData?.data?.data?.filter((item: any) => !item?.images?.[0]?.endsWith('pdf'))?.map((item: any) => {
                                  return <Upvote data={item} />;
                                })
                                : null}
                            </div>
                          ) :
                          selected == TUTOR_DETAILS_ENUMS.DOCUMENT ?
                            (
                              <div
                                ref={sliderRef}
                                {...settings}
                                className="venue_slider"
                              >
                                {contentData?.data?.data?.length
                                  ? contentData?.data?.data?.filter((item: any) => item?.images?.length == 1 && item?.images?.[0]?.endsWith('pdf'))?.map((item: any) => {
                                    return <Upvote data={item} />;
                                  })
                                  : null}
                              </div>
                            ) :
                            selected == TUTOR_DETAILS_ENUMS.VIDEO ?
                              (
                                <div
                                  ref={sliderRef}
                                  {...settings}
                                  className="venue_slider"
                                >
                                  {contentData?.data?.data?.length
                                    ? contentData?.data?.data?.map((item: any) => {
                                      return <VideoCard key={item?._id} data={item} />;
                                    })
                                    : null}
                                </div>
                              ) : (
                                <div
                                  ref={sliderRef}
                                  {...settings}
                                  className="venue_slider"
                                >
                                  {contentData?.data?.data?.length
                                    ? contentData?.data?.data?.map((item: any) => {
                                      return <Upvote data={item} />;
                                    })
                                    : null}
                                </div>
                              )}
                      {(selected == TUTOR_DETAILS_ENUMS.CLASS && classData?.data?.data?.length > 0) || (selected !== TUTOR_DETAILS_ENUMS.CLASS && contentData?.data?.data?.length > 0) ? (

                        <div onClick={() => {
                          if (selected == TUTOR_DETAILS_ENUMS.FORUM ) {
                            navigate('/tutor/formdiscussion')
                          } else if (selected == TUTOR_DETAILS_ENUMS.POST || selected == TUTOR_DETAILS_ENUMS.DOCUMENT) {
                            navigate('/tutor/posts')
                          } else if (selected == TUTOR_DETAILS_ENUMS.VIDEO) {
                            navigate('/tutor/TutorTeaserVideos')
                          } else if (selected == TUTOR_DETAILS_ENUMS.CLASS) {
                            navigate('/tutor/classes')
                          }
                        }} className="see">
                          <p>See All</p>
                        </div>) : null}


                    </section>

                    <section className="syllabus_card">
                      <h2>Education</h2>
                      {education?.length ? (
                        education?.map((item: any, index: number) => {
                          return (
                            <>
                              <p className="cl_span
                              ">
                                <span>
                                  <img
                                    src={`/static/images/Graduate.svg`}
                                    alt=""
                                  />
                                </span>{" "}
                                {item?.institutionName || ""}{" "}
                              </p>
                              <TruncatedText
                                text={`${item?.description || ""} `}
                                maxWords={50}
                                className="education-text"
                              />
                              <small>

                                {item?.fieldOfStudy
                                  ? "(" + item?.fieldOfStudy + ")"
                                  : ""}
                                {item?.startDate && item?.endDate
                                  ? "(" +
                                  moment(item?.startDate).format("MMM YYYY") +
                                  "-" +
                                  moment(item?.endDate).format("MMM YYYY") +
                                  ")"
                                  : ""}
                              </small>
                            </>
                          );
                        })
                      ) : (
                        <p>No Information Provided</p>
                      )}
                    </section>

                    <section className="syllabus_card">
                      <h2>Experience</h2>
                      {experience?.length ? (
                        experience?.map((item: any, index: number) => (
                          <p key={index}>
                            <p className="cl_span">
                              <span>
                                <img src={`/static/images/teacher.svg`} alt="" />
                              </span>
                              <TruncatedText
                                text={item?.description || ""}
                                maxWords={50}
                              />
                              {/* <p dangerouslySetInnerHTML={{ __html: item?.description || "" }} /> */}
                            </p>
                            <p>
                              <small>
                                {moment(item?.startDate).format("MMMM-YYYY")} -{" "}
                                {item?.endDate
                                  ? moment(item?.endDate).format("MMMM-YYYY")
                                  : "Ongoing"}
                              </small>
                            </p>
                          </p>
                        ))
                      ) : (
                        <span>No Experience details found</span>
                      )}
                    </section>


                  </div>
                </div>
              </div>
            </div>
          </section>
          <AddPollModal
            open={open1}
            setOpen={setOpen1}
            onClose={() => setOpen1(false)}
          />
        </main>
      </TutorLayout>
    </>
  );
};
