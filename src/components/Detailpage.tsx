import React, { useRef, useState } from "react";
import { ProfileCard } from "./ProfileCard";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { RecommendedClasses } from "./RecommendedClasses";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import moment from "moment";
import IosShareIcon from "@mui/icons-material/IosShare";
import ReportGmailerrorredIcon from "@mui/icons-material/ReportGmailerrorred";
import {
  CHAT_TYPE,
  CONTENT_TYPE,
  EDUCATION_ENUM_DISPLAY,
  ForumType,
  GRADE_TYPE_NAME,
  TUTOR_DETAILS_ENUMS,
} from "../constants/enums";
import { useFollowTutorMutation, useGetContentQuery } from "../service/content";
import Upvote from "./Upvote";
import SelectDateModal from "../Modals/selectDate";
import { useNavigate, useParams } from "react-router-dom";
import { useGetClassesForParentQuery } from "../service/class";
import { AddInquriryModal } from "../Modals/AddInquiryModal";
import { showError, showWarning } from "../constants/toast";
import CloseIcon from "@mui/icons-material/Close";
import { RWebShare } from "react-web-share";
import { REDIRECTLINK } from "../constants/url";
import { useAppSelector } from "../hooks/store";
import { currencyMode, currencySymbol, selectCurrencyRates, selectCurrentCurrency } from "../reducers/currencySlice";
import { convertCurrency } from "../utils/currency";
import { getFromStorage } from "../constants/storage";
import { STORAGE_KEYS } from "../constants/storageKeys";
import LoginAlertModal from "../Modals/LoginAlertModal";
import { TruncatedList, TruncatedText } from "../utils/truncateText";
import { VideoCard } from "./VideoCard";
import ReportTutor from "../Modals/ReportTutor";

export const Detailpage = ({ data }: any) => {
  const [selected, setSelected] = useState<number>(TUTOR_DETAILS_ENUMS.POST);
  const [openReport, setOpenReport] = useState<boolean>(false);
  const currencyRates = useAppSelector(selectCurrencyRates);
  const currentCurrency = useAppSelector(selectCurrentCurrency);
  const currentCurrencyMode = useAppSelector(currencyMode);
  const currentCurrencySymbol = useAppSelector(currencySymbol);
  const token = getFromStorage(STORAGE_KEYS.token)
  const [open2, setOpen2] = React.useState<boolean>(false);
  const handleClose2 = () => {
    setOpen2(false);
  };

  const { data: classData } = useGetClassesForParentQuery(
    { tutorId: data?._id, page: 1, limit: 1 },
    { skip: !data?._id }
  );
  const [open1, setOpen1] = useState<boolean>(false);
  const toggleDropdown = () => {
    setOpen1((prev) => !prev);
  };

  const handleCloseReport = () => {
    setOpenReport(false);
  };

  const handleOptionClick = (option: string) => {
    console.log("Selected:", option);
    if (option == "Delete") {
      setOpenReport(true);
    }
    setOpen1(false);
  };
  const navigate = useNavigate();
  const { id } = useParams();
  const [open, setOpen] = useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleCloseEdit = () => setOpen(false);
  const [followTutor] = useFollowTutorMutation();

  const followTutorFunc = async () => {
    const body = {
      tutorId: data?._id || "",
    };
    try {
      const res = await followTutor(body).unwrap();
      if (res?.statusCode == 200) {
      }
    } catch (error: any) {
      showError(error?.data?.message || "Something went wrong");
    }
  };
  const { data: contentData, isLoading } = useGetContentQuery(
    {
      type: ForumType.OTHERS,
      contentType:
        selected == TUTOR_DETAILS_ENUMS.FORUM
          ? CONTENT_TYPE.FORUM
          : selected == TUTOR_DETAILS_ENUMS.VIDEO
            ? CONTENT_TYPE.TEASER_VIDEO
            : selected == TUTOR_DETAILS_ENUMS.POST
              ? CONTENT_TYPE.POST
              : CONTENT_TYPE.FORUM,
      page: 1,
      limit: 1,
      tutorId: data?._id,
    },
    { skip: !data?._id }
  );



  type Slider = any;
  const sliderRef = useRef<Slider | null>(null);
  const settings = {
    infinite: false,
    slidesToShow: 1.3,
    slidesToScroll: 1,
    arrows: false,
    dots: false,
  };



  return (
    <div className="tutor_profile_details mn_booking_dtls">
      <div className="card_inr">
        <figure>
          <img src={data?.bannerImg || `/static/images/profile_bg.png`} alt="" />
          <figcaption>
            <span className="dot"></span>
            {data?.isActive ? "Live" : "Offline"}
          </figcaption>
        </figure>
        <ProfileCard data={data} />
        <div className="schedule_fdx">
          <div className="lt">
            <button onClick={() => { token ? followTutorFunc() : setOpen2(true) }} className="btn primary">
              {data?.isFollowing ? "Following" : "Follow"}
            </button>
            <button onClick={() => {
              !token ? setOpen2(true) :
                data?.isFollowing ? navigate('/parent/chat', {
                  state: {
                    bookingId: '',
                    connectionId: '',
                    bookingStatus: '',
                    name: data?.name || '',
                    image: data?.image || '',
                    tutorId: data?._id,
                    type: CHAT_TYPE.NORMAL,
                    tutorVerified: data?.documentVerification,
                  }
                }) : showWarning("Please follow tutor to send a message")
            }} className="btn transparent">Message</button>
            <div style={{ position: "relative", display: "inline-block" }}>

              <button
                className="btn transparent"
                onClick={()=> token ?  toggleDropdown():setOpen2(true) }
                style={{ cursor: "pointer" }}
              >
                ...
              </button>

              {/* Dropdown Menu */}
              {open1 && (
                <div
                  className="share_drop"
                  style={{
                    position: "absolute",
                    top: "100%",
                    right: 0,
                    background: "#fff",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    minWidth: "150px",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
                    zIndex: 1000,
                  }}
                ><RWebShare
                  data={{
                    text: "Click on link to see the tutor details",
                    url: `${REDIRECTLINK}tutorProfieDetails/${data?._id}`,
                    title: data?.name || "",
                  }}
                >
                    <div
                      style={{ padding: "8px", cursor: "pointer" }}
                    >
                      <IosShareIcon /> Share Via

                    </div>
                  </RWebShare>
                  <div
                    style={{ padding: "8px", cursor: "pointer" }}
                    onClick={() => handleOptionClick("Delete")}
                  >
                    <ReportGmailerrorredIcon /> Report
                  </div>
                  <div
                    style={{ padding: "8px", cursor: "pointer" }}
                    onClick={() => { setOpen1(false); followTutorFunc() }}
                  >
                    <CloseIcon />  {data?.isFollowing ? "Unfollow" : "Follow"}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="rt flex">
            <img
              onClick={()=> token ? handleOpen():setOpen2(true) }
              width={30}
              src="/static/images/inquiry.png"
              alt=""
            />
            <button
              onClick={() => { token ? navigate(`/parent/ScheduleBookings/${id}`) : setOpen2(true) }}
              className="btn primary"
            >
              Schedule Appointment
            </button>
          </div>
        </div>
      </div>

      <section className="syllabus_card ">
        <ul className="rw_top">
          <TruncatedList
            items={data?.subjects}
            maxItems={4}
          />
          {/* {data?.subjects?.length
            ? data?.subjects?.map((item: any) => {
              return <li>{item?.name} </li>;
            })
            : null} */}
        </ul>
        <ul className="rw_md">
          <li>
            <span>
              <img src={`/static/images/clock.svg`} alt="" />
            </span>
            {moment(data?.teachingdetails?.startTime).format("hA")} -{" "}
            {moment(data?.teachingdetails?.endTime).format("hA")}
          </li>

          <li>
            {" "}
            <span>
              <img src={`/static/images/wallet.svg`} alt="" />{" "}
            </span>
            {`${currentCurrencySymbol} ${convertCurrency({
              price: data?.teachingdetails?.usdPrice
                ? data?.teachingdetails?.usdPrice : 0,
              rate: currencyRates[currentCurrency],
            }).toLocaleString(`${currentCurrencyMode}`)}`
            }
            /hour
          </li>
          <li>
            {" "}
            <span>
              {" "}
              <img src={`/static/images/profiless.svg`} alt="" />{" "}
            </span>
            Female
          </li>
          {data?.teachingdetails?.achievement ? (
            <li>
              {" "}
              <span>
                <img src={`/static/images/travel-bag.svg`} alt="" />{" "}
              </span>
              {data?.teachingdetails?.achievement || ""}
            </li>
          ) : null}

          <li>
            {" "}
            <span>
              {" "}
              <img src={`/static/images/Book.svg`} alt="" />{" "}
            </span>{" "}
            {data?.classes?.length
              ? [...data.classes]
                .map((item) => GRADE_TYPE_NAME[item?.name])
                .join(", ")
              : null}
          </li>
        </ul>
        <ul className=" rw_top rw_btm">
          <li> {data?.views || 0} Viewers</li>
          <li>{data?.bookCount || 0} Classes</li>
          <li>
            {
              EDUCATION_ENUM_DISPLAY[
              data?.teachingdetails?.higherEdu
                ? Number(data?.teachingdetails?.higherEdu)
                : 5
              ]
            }
          </li>
        </ul>
      </section>

      <section className="syllabus_card">
        <h2>Information</h2>
        <TruncatedText
          text={data?.shortBio || ""}
          maxWords={100}
        />
        {/* <p dangerouslySetInnerHTML={{ __html: data?.shortBio || "No information Provided" }} /> */}

      </section>

      <section className="syllabus_card">
        <h2>Activity</h2>
        <ul className="cstmm_tabs ">
          <li
            onClick={() => setSelected(TUTOR_DETAILS_ENUMS.POST)}
            className={
              selected == TUTOR_DETAILS_ENUMS.POST ? "green" : "simple"
            }
          >
            Posts
          </li>
          <li
            onClick={() => setSelected(TUTOR_DETAILS_ENUMS.VIDEO)}
            className={
              selected == TUTOR_DETAILS_ENUMS.VIDEO ? "green" : "simple"
            }
          >
            Videos{" "}
          </li>
          <li
            onClick={() => setSelected(TUTOR_DETAILS_ENUMS.CLASS)}
            className={
              selected == TUTOR_DETAILS_ENUMS.CLASS ? "green" : "simple"
            }
          >
            Classes{" "}
          </li>
          <li
            onClick={() => setSelected(TUTOR_DETAILS_ENUMS.DOCUMENT)}
            className={
              selected == TUTOR_DETAILS_ENUMS.DOCUMENT ? "green" : "simple"
            }
          >
            Documents{" "}
          </li>
          <li
            onClick={() => setSelected(TUTOR_DETAILS_ENUMS.FORUM)}
            className={
              selected == TUTOR_DETAILS_ENUMS.FORUM ? "green" : "simple"
            }
          >
            Forums{" "}
          </li>
        </ul>
        {selected == TUTOR_DETAILS_ENUMS.CLASS ? (
          <div
            // ref={sliderRef}
            // {...settings}
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
                // ref={sliderRef}
                // {...settings}
                className="venue_slider activity_wrp"
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
                  // ref={sliderRef}
                  // {...settings}
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
                    // ref={sliderRef}
                    // {...settings}
                    className="venue_slider" >
                    {contentData?.data?.data?.length
                      ? contentData?.data?.data?.map((item: any) => {
                        return <VideoCard key={item?._id} data={item} />;
                      })
                      : null}
                  </div>
                ) : (
                  <div
                    // ref={sliderRef}
                    // {...settings}
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
            if (selected == TUTOR_DETAILS_ENUMS.FORUM || selected == TUTOR_DETAILS_ENUMS.DOCUMENT) {
              navigate('/parent/formdiscussion', { state: { tutorId: data?._id } })
            } else if (selected == TUTOR_DETAILS_ENUMS.POST) {
              navigate('/parent/posts', { state: { tutorId: data?._id } })
            } else if (selected == TUTOR_DETAILS_ENUMS.VIDEO) {
              navigate('/parent/teaserVideos', { state: { tutorId: data?._id } })
            }
            else if (selected == TUTOR_DETAILS_ENUMS.CLASS) {
              navigate('/parent/classes')
            }
          }} className="see">
            <p>See All</p>
          </div>
        ) : null}
      </section>

      <section className="syllabus_card">
        <h2>Education</h2>
        {data?.certificates?.length ? (
          data?.certificates?.map((item: any, index: number) => {
            return (
              <>
                <p className="cl_span">
                  <span>
                    <img src={`/static/images/Graduate.svg`} alt="" />
                  </span>{" "}
                  {item?.institutionName || ""}{" "}
                </p>
                <TruncatedText
                  text={item?.description || ""}
                  maxWords={50}
                  className='education-text'
                />
                <small>

                  {item?.fieldOfStudy ? "(" + item?.fieldOfStudy + ")" : ""}
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
        {/* <p dangerouslySetInnerHTML={{ __html: item?.description || "" }} /> */}

        <h2>Experience</h2>
        {data?.achievements?.length ? (
          data?.achievements?.map((item: any, index: number) => (
            <p key={index}>
              <p className="cl_span">
                <span>
                  <img src={`/static/images/teacher.svg`} alt="" />
                </span>
                <TruncatedText
                  text={`${item?.description || ""} `}
                  maxWords={50}
                  className="education-text"
                />
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

      <section className="syllabus_card">
        <h2>Review & Ratings</h2>

        <ul>
          {data?.ratings?.length
            ? data?.ratings?.map((item: any, index: number) => {
              return (
                <li className="ig_fdx">
                  <figure>
                    <img
                      src={
                        item?.parents?.image || `/static/images/rating.png`
                      }
                      alt="rating"
                    />
                  </figure>
                  <div>
                    <h5> {item?.parents?.name}</h5>
                    <Stack spacing={1}>
                      <Rating
                        name="half-rating-read"
                        value={item?.rating}
                        precision={0.5}
                        readOnly
                      />
                    </Stack>
                  </div>
                  <p>{item?.review || ""}</p>
                </li>
              );
            })
            : "No reviews found"}
        </ul>
      </section>
      <AddInquriryModal
        handleClose={handleCloseEdit}
        handleOpen={handleOpen}
        open={open}
      />
      <LoginAlertModal
        open={open2}
        setOpen={setOpen2}
        onClose={handleClose2}
        msg="Please login"
      />
      <ReportTutor onClose={handleCloseReport} open={openReport} setOpen={setOpenReport} />
    </div>
  );
};
