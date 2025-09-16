import React, { useState, useRef, useEffect } from "react";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";
import GradeIcon from "@mui/icons-material/Grade";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import TurnedInIcon from "@mui/icons-material/TurnedIn";
import { useAppSelector } from "../hooks/store";
import { getRole, role } from "../reducers/authSlice";
import { useDeleteClassByIdMutation } from "../service/class";
import { useSaveClassMutation } from "../service/content";
import { showError, showToast } from "../constants/toast";
import { useNavigate } from "react-router-dom";
import { RWebShare } from "react-web-share";
import { MoreVertical, Heart, Share2, BookOpen, Flag } from "lucide-react";
import { REDIRECTLINK } from "../constants/url";
import {
  ClASS_MODE_NAME,
  CLASS_SETTING,
  STATUS_NAME,
  TEASER_VIDEO_STATUS,
} from "../constants/enums";
import {
  currencyMode,
  currencySymbol,
  selectCurrencyRates,
  selectCurrentCurrency,
} from "../reducers/currencySlice";
import { convertCurrency } from "../utils/currency";
import ReportClass from "../Modals/ReportClass";
import { getFromStorage } from "../constants/storage";
import { STORAGE_KEYS } from "../constants/storageKeys";
import CURRENCY from "../constants/Currency";

type RecommendedClassesProps = {
  data: any;
  saved?: boolean;
};

export const RecommendedClasses = React.forwardRef<
  HTMLDivElement,
  RecommendedClassesProps
>(({ data, saved }, ref) => {
  const navigate = useNavigate();
  const [deleteClass] = useDeleteClassByIdMutation();
  const [saveClassApi] = useSaveClassMutation();
  const roleName = getFromStorage(STORAGE_KEYS.roleName);
  const isLong = data?.description && data.description.length > 50;
  const displayText = isLong
    ? data?.description?.slice(0, 50) + "..."
    : data?.description || "";
  const currencyRates = useAppSelector(selectCurrencyRates);
  const currentCurrency = useAppSelector(selectCurrentCurrency);
  const currentCurrencyMode = useAppSelector(currencyMode);
  const currentCurrencySymbol = useAppSelector(currencySymbol);
  const [open1, setOpen1] = useState(false);

  const saveClassFunc = async () => {
    try {
      const body = { classId: data?._id };
      const res = await saveClassApi({ body }).unwrap();
      if (res?.statusCode == 200) {
        showToast("Class saved successfully");
      }
    } catch (error: any) {
      showError(error?.data?.message || "Something went wrong");
    }
  };

  const deleteClassFunc = async () => {
    try {
      const res = await deleteClass({ id: data?._id }).unwrap();
      if (res?.statusCode === 200) {
        showToast("Class deleted successfully");
      }
    } catch (error: any) {
      showError(error?.data?.message || "Something went wrong");
    }
  };

  // dropdown state
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={ref} className="recm_card">
      <figure>
        <img
          onClick={() => {
            roleName == "parent"
              ? navigate(`/parent/ClassDetail/${data?._id}`)
              : navigate(`/tutor/classes/details/${data?._id}`);
          }}
          src={data?.thumbnail || `/static/images/recmd_classes.png`}
          alt="recmnd_classes"
        />
        <figcaption>
          {roleName == "parent" || data?.isCoTutor ? null : (
            <output className="icn_grp_del">
              {data?.isClassBooked == true ? null : (
                <i onClick={() => navigate(`/tutor/create-class/${data?._id}`)}>
                  <BorderColorIcon />
                </i>
              )}

              {data?.setting == CLASS_SETTING.DRAFT &&
                data?.isClassBooked == true
                ? null
                : (
                  <i onClick={deleteClassFunc} className="del">
                    <RestoreFromTrashIcon />
                  </i>
                )}
            </output>
          )}

          {data?.classStatus ? (
            <code
              className={`code ${data?.classStatus == TEASER_VIDEO_STATUS.APPROVED
                ? "approve"
                : data?.classStatus == TEASER_VIDEO_STATUS.REJECTED
                  ? "rejected"
                  : ""
                }`}
            >
              {STATUS_NAME[data?.classStatus]}
            </code>
          ) : null}

          <div className="btn_group recm_option_grp">
            <div className="top_badge_fdx">
              <a className="badge chemistry">{data?.subjects?.name || ""}</a>
              <div>
                <RWebShare
                  data={{
                    text: "Click on link to see the teaser video details",
                    url: `${REDIRECTLINK}parent/ClassDetail/${data?._id}`,
                    title: data?.topic || "",
                  }}
                >
                  <span>
                    <img src={"/static/images/share_nw.svg"} alt="" />
                  </span>
                </RWebShare>
                {roleName == "parent" ? (
                  <span onClick={saveClassFunc}>
                    {data?.isSave || saved ? (
                      <TurnedInIcon />
                    ) : (
                      <img src={"/static/images/bookmark.svg"} alt="" />
                    )}
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        </figcaption>
      </figure>
      <div className="profile_area">
        <figure className={`avatar ${data?.tutor?.isActive ? 'active_border' : ''}`}>
          <img src={data?.tutor?.image || "/static/images/user.png"} alt="profile" />
        </figure>
      </div>

      <div className="contnt__mn">
        <h4
          onClick={() => {
            roleName == "parent"
              ? navigate(`/parent/ClassDetail/${data?._id}`)
              : navigate(`/tutor/classes/details/${data?._id}`);
          }}
        >
          {data?.topic || ""}
        </h4>

        <p
          onClick={() => {
            roleName == "parent"
              ? navigate(`/parent/ClassDetail/${data?._id}`)
              : navigate(`/tutor/classes/details/${data?._id}`);
          }}
          className="dess"
          dangerouslySetInnerHTML={{ __html: displayText || "" }}
        />
        <span style={{ color: 'green', fontSize: '14px' }}>{data?.isCoTutor ? "Joined as Co-tutor" : "Online class"}</span>
        <div
          onClick={() => {
            roleName == "parent"
              ? navigate(`/parent/ClassDetail/${data?._id}`)
              : navigate(`/tutor/classes/details/${data?._id}`);
          }}
          className="follow_cnt"
        >
          <div>
            {data?.tutor?.name ? (
              <h5>
                {data?.tutor?.name || ""}{" "}
                <span className="star">
                  <GradeIcon /> {data?.tutor?.avgRating || 0}
                </span>
              </h5>
            ) : null}

            <div className="class-info">
              <div className="info-item">
                <AccessTimeIcon fontSize="small" />
                <span>
                  {data?.duration
                    ? `${(data?.duration / 60).toFixed(1)} hrs`
                    : "—"}
                </span>
              </div>
              <div className="info-item">
                <LocationOnIcon fontSize="small" />
                <span className="status online">
                  {data?.classMode ? ClASS_MODE_NAME[data?.classMode] : ''}
                </span>
              </div>
            </div>
          </div>
        </div>
        {roleName == 'tutor' ? (
          <div className="enroll_price">
            {data?.isFreeLesson ? 'Free' :
              ` ${CURRENCY?.find((item) => item.currency == data?.currency)?.symbol || '$'}${data?.fees}`}
            <span>{data?.isFreeLesson ? "" : "/hr"}</span>
          </div>
        ) : (
          <div className="enroll_price">
            {data?.isFreeLesson ? 'Free' :
              `${currentCurrencySymbol} ${convertCurrency({
                price: data?.usdPrice ? data?.usdPrice : 0,
                rate: currencyRates[currentCurrency],
              }).toLocaleString(`${currentCurrencyMode}`)}`}
            <span>{data?.isFreeLesson ? "" : "/hr"}</span>
          </div>
        )}


        <div className="card_footer">

          {roleName == 'tutor' ? null : (
            <button
              onClick={() => {
                roleName == "parent"
                  ? navigate(`/parent/ClassDetail/${data?._id}`)
                  : navigate(`/tutor/classes/details/${data?._id}`);
              }}
              className="btn primary enroll_btn"
            >
              Enroll Now
            </button>
          )}


          {/* Dropdown Menu */}
          <div className="saved_flx more-menu-wrapper" ref={menuRef}>
            <button
              className="more-btn"
              onClick={() => setOpen((prev) => !prev)}
            >
              <MoreVertical size={20} />
            </button>

            {open && (
              <div className="dropdown">
                {roleName == "tutor" ? null : (
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      saveClassFunc();
                      setOpen(false);
                    }}
                  >
                    <Heart size={18} /> Save Class
                  </button>
                )}

                <RWebShare
                  data={{
                    text: "Click on link to see the teaser video details",
                    url: `${REDIRECTLINK}ClassDetail/${data?._id}`,
                    title: data?.topic || "",
                  }}
                >
                  <button className="dropdown-item">
                    <Share2 size={18} /> Share Class
                  </button>
                </RWebShare>
                <button
                  onClick={() => {
                    roleName == "parent"
                      ? navigate(`/parent/ClassDetail/${data?._id}`)
                      : navigate(`/tutor/classes/details/${data?._id}`);
                  }}
                  className="dropdown-item"
                >
                  <BookOpen size={18} /> View Curriculum
                </button>
                {roleName == "tutor" ? null : (
                  <button
                    onClick={() => setOpen1(true)}
                    className="dropdown-item danger"
                  >
                    <Flag size={18} /> Report Class
                  </button>
                )}

              </div>
            )}
            <ReportClass
              open={open1}
              onClose={() => setOpen1(false)}
              setOpen={setOpen1}
              data={data}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

RecommendedClasses.displayName = "RecommendedClasses";
