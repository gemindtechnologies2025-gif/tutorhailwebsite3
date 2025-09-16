import Loader from "../../../constants/Loader";
import { TutorLayout } from "../../../layout/tutorLayout";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LanguageIcon from "@mui/icons-material/Language";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import ShareIcon from "@mui/icons-material/Share";
import { useEffect, useState } from "react";
import Enrollment from "../../../Modals/Enrollment";
import { useGetClassesByIdQuery } from "../../../service/class";
import { useParams } from "react-router-dom";
import SportsScoreIcon from "@mui/icons-material/SportsScore";
import FlagCircleIcon from "@mui/icons-material/FlagCircle";
import {
  ClASS_MODE_NAME,
  ClassMode,
  GRADE_TYPE_NAME,
  TeachingLanguage,
} from "../../../constants/enums";
import { convertToInternationalCurrencySystem } from "../../../utils/validations";
import moment from "moment";
import { RWebShare } from "react-web-share";
import { REDIRECTLINK } from "../../../constants/url";

function ClassDetail() {
  const [open, setOpen] = useState<boolean>(false);
  const { id } = useParams();
  const { data, isSuccess, isLoading } = useGetClassesByIdQuery({ id });
  const [showSlots, setShowSlots] = useState<any[]>([]);

  console.log(data?.data, "showSlots");

  const onClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (isSuccess) {
      const slot = data?.data?.classslots || [];

      const futureSlots = slot
        .filter((item: any) => moment(item.startTime).isAfter(moment()))
        .sort(
          (a: any, b: any) =>
            moment(a.startTime).valueOf() - moment(b.startTime).valueOf()
        );

      setShowSlots(futureSlots);
    }
  }, [isSuccess, data]);

  return (
    <>
      <TutorLayout className="role-layout ">
        <Loader isLoad={isLoading} />
        <main className="content class_detail">
          <section className="uh_spc home_wrp">
            <div className="conta_iner v2 ">
              <div className="gap_m tutor_profile ub_spc">
                <div className="role_body">
                  <figure className="main_video">
                    <video
                      src={data?.data?.teaser || "/static/videos/sample.mp4"}
                      controls
                      // poster="/static/images/video_img.png"
                      width="100%"
                      style={{ borderRadius: "8px" }}
                    >
                      Your browser does not support the video tag.
                    </video>
                    <RWebShare
                      data={{
                        text: "Click on link to see the teaser video details",
                        url: `${REDIRECTLINK}ClassDetail/${id}`,
                        title: data?.data?.topic || "",
                      }}
                    >
                      <figcaption>
                        {" "}
                        <ShareIcon />
                      </figcaption>
                    </RWebShare>
                  </figure>
                  {data?.data?.subjects?.name ? (
                    <p className="prop">{data?.data?.subjects?.name || ""}</p>
                  ) : null}

                  <div className="card_box">
                    <h3>{data?.data?.topic || ""}</h3>
                    <p
                      dangerouslySetInnerHTML={{
                        __html: data?.data?.notes || "",
                      }}
                    />
                  </div>
                  <ul>
                    <li>
                      <CalendarTodayIcon />
                      <p>Next Session</p>
                      <h3>
                        {showSlots?.filter((slot) => slot?.status === true)?.[0]
                          ?.startTime
                          ? moment(
                              showSlots.filter(
                                (slot) => slot?.status === true
                              )[0].startTime
                            ).format("LLL")
                          : "Schedule TBD"}
                      </h3>

                      {showSlots?.length ? (
                        <button
                          onClick={() => setOpen(true)}
                          className="btn"
                          style={{ marginTop: "10px" }}
                        >
                          View All Sessions
                        </button>
                      ) : null}
                    </li>
                    <li>
                      <AccessTimeIcon />
                      <p>Duration</p>
                      <h3>
                        {data?.data?.duration
                          ? `${data?.data?.duration} Mins`
                          : ""}{" "}
                        <span>Per session</span>
                      </h3>
                    </li>
                    <li
                      onClick={() => {
                        if (
                          data?.data?.classMode == ClassMode.OFFLINE ||
                          data?.data?.classMode == ClassMode.HYBRID
                        ) {
                          const mapUrl = `https://www.google.com/maps/search/?api=1&query=${data?.data?.latitude},${data?.data?.longitude}`;
                          window.open(mapUrl, "_blank");
                        }
                      }}
                    >
                      <LocationOnIcon />
                      <p>Location</p>
                      <h3>
                        {data?.data?.classMode
                          ? ClASS_MODE_NAME[data?.data?.classMode]
                          : ""}
                      </h3>
                    </li>
                    <li>
                      <LanguageIcon />
                      <p>Language</p>
                      <h3>
                        {data?.data?.language
                          ? TeachingLanguage[data?.data?.language]
                          : ""}
                      </h3>
                    </li>
                  </ul>
                  <div className="class-info-card">
                    <div className="section-header">
                      <MenuBookIcon className="icon" />
                      <h2>About This Class & What You'll Learn</h2>
                    </div>
                    <p
                      className="description"
                      dangerouslySetInnerHTML={{
                        __html: data?.data?.description || "",
                      }}
                    />
                    {/* <p className="description">No description provided</p> */}

                    <div className="tag">Regular Class</div>

                    <div className="objective-section">
                      <div className="objective-title">
                        <FlagCircleIcon className="objective-icon" />
                        <h3>Learning Objective</h3>
                      </div>
                      <p className="objective-desc">
                        {data?.data?.objective || ""}
                      </p>
                    </div>
                    <div className="objective-section">
                      <div className="objective-title">
                        <SportsScoreIcon className="objective-icon" />
                        <h3>Learning Outcome</h3>
                      </div>
                    </div>
                    <ol className="outcomes">
                      <li>
                        <p style={{ color: "green" }}>
                          All learners will be able to{" "}
                          <span>{data?.data?.allOutcome || "N/A"}</span>
                        </p>
                      </li>
                      <li>
                        <p style={{ color: "blue" }}>
                          Most learners will be able to{" "}
                          <span>{data?.data?.mostOutcome || "N/A"}</span>
                        </p>
                      </li>
                      <li>
                        <p style={{ color: "violet" }}>
                          Some learners will be able to{" "}
                          <span>{data?.data?.someOutcome || "N/A"}</span>
                        </p>
                      </li>
                    </ol>

                    <div className="suitability">
                      <p>
                        <strong>Suitable for:</strong>
                      </p>
                      {data?.data?.grades?.length
                        ? data?.data?.grades?.map((item: any) => {
                            return (
                              <span className="grade-pill">
                                {GRADE_TYPE_NAME[item]}
                              </span>
                            );
                          })
                        : null}
                    </div>

                    <p className="timezone">
                      Class Capacity:{" "}
                      <strong>
                        {data?.data?.seats
                          ? `${data?.data?.seats} Studetnts`
                          : ""}
                      </strong>
                    </p>
                    <p className="timezone">
                      Timezone:{" "}
                      <strong>
                        {data?.data?.classslots?.[0]?.timezone || ""}
                      </strong>
                    </p>
                  </div>
                </div>
                <div className="sidebar_rt">
                  <div className="session-summary-card">
                    <h3 className="header1">Session Summary</h3>

                    <div className="row">
                      <div className="label">Session Type</div>
                      <div className="value">
                        {data?.data?.canBePrivate ? "Private" : "Public"}
                      </div>
                    </div>

                    <div className="row">
                      <div className="label">Session Time</div>
                      <div className="value">
                        {data?.data?.duration
                          ? `${data?.data?.duration} Mins`
                          : ""}
                      </div>
                    </div>

                    <div className="row">
                      <div className="label">Subject</div>
                      <div className="value">
                        {" "}
                        {data?.data?.language
                          ? TeachingLanguage[data?.data?.language]
                          : ""}
                      </div>
                    </div>

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
                  </div>
                </div>
              </div>
            </div>
            <div className="fixed_bottom">
              <div className="fdx">
                <div className="lt">
                  <h4>
                    <span>Price</span>
                    {data?.data?.fees
                      ? "$" +
                        convertToInternationalCurrencySystem(data?.data?.fees)
                      : data?.data?.isFreeLesson
                        ? "Free"
                        : ""}
                  </h4>
                </div>
              </div>
            </div>
          </section>
        </main>
      </TutorLayout>
      <Enrollment
        open={open}
        setOpen={setOpen}
        onClose={onClose}
        slots={showSlots}
        classMode={data?.data?.classMode}
        duration={data?.data?.duration}
        fee={
          data?.data?.fees
            ? "$" + convertToInternationalCurrencySystem(data?.data?.fees)
            : data?.data?.isFreeLesson
              ? "Free"
              : ""
        }
        days={data?.data?.continueFor || "1"}
      />
    </>
  );
}
export default ClassDetail;
