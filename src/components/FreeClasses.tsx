import React, { useEffect, useRef, useState } from 'react'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IosShareIcon from '@mui/icons-material/IosShare';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { ClASS_MODE_NAME } from '../constants/enums';
import { getFromStorage } from '../constants/storage';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { useNavigate } from 'react-router-dom';
import { RWebShare } from 'react-web-share';
import { REDIRECTLINK } from '../constants/url';
import { useSaveClassMutation } from '../service/content';
import { showError, showToast } from '../constants/toast';
import { MoreVertical, Heart, Share2, BookOpen, Flag } from "lucide-react";
import ReportClass from '../Modals/ReportClass';

type ClassItem = {
  id: string
  subject: string
  title: string
  location: string
  avatar: string
  durationMins: number
  mode: 'Online' | 'Offline'
  priceLabel: 'FREE' | string
  image: string
}



const FreeClasses = React.forwardRef<HTMLDivElement, any>(({ data }, ref) => {
  const navigate = useNavigate();
  const isLong = data?.description && data.description.length > 50;
  const roleName = getFromStorage(STORAGE_KEYS.roleName);
  const [saveClassApi] = useSaveClassMutation();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [open1, setOpen1] = useState(false);

  const saveClassFunc = async () => {
    try {
      const body = { classId: data?._id };
      const res = await saveClassApi({ body }).unwrap();
      if (res?.statusCode == 200) {
         setOpen(false);
        // showToast("Class saved successfully");
      }
    } catch (error: any) {
      showError(error?.data?.message || "Something went wrong");
    }
  };

  const displayText = isLong
    ? data?.description?.slice(0, 50) + "..."
    : data?.description || "";

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
    <div className="class_card" ref={ref}>
      <div
        onClick={() => {
          roleName == "parent"
            ? navigate(`/parent/ClassDetail/${data?._id}`)
            : navigate(`/tutor/classes/details/${data?._id}`);
        }}
        className="lt"
      >
        <figure>
          <img src={data?.thumbnail} alt="image" />
          <figcaption>
            <span className="price_badge">FREE</span>
          </figcaption>
        </figure>
        <span className="subject_badge">{data?.subjects?.name || ""}</span>
      </div>
      <div className="rt">
        <div className="top_row">
          <div className="titles">
            <h4>{data?.topic || ""}</h4>
            <p dangerouslySetInnerHTML={{ __html: displayText || "" }} />
          </div>
          <div className="icons">
            <div
              onClick={() => {
                saveClassFunc();
              }}
            >
              {data?.isSave ? <BookmarkIcon /> : <BookmarkBorderIcon />}
            </div>
            <RWebShare
              data={{
                text: "Click on link to see the teaser video details",
                url: `${REDIRECTLINK}ClassDetail/${data?._id}`,
                title: data?.topic || "",
              }}
            >
              <div>
                <IosShareIcon />
              </div>
            </RWebShare>
            <div
              className="saved_flx more-menu-wrapper"
              ref={menuRef}
              onClick={() => setOpen((prev) => !prev)}
            >
              <MoreVertIcon />
              {open && (
                <div className="dropdown">
                  {roleName == "tutor" ? null : (
                    <button
                      className="dropdown-item"
                      onClick={(e) => {
                        e.stopPropagation();
                       
                        saveClassFunc();
                      }}
                    >
                      <Heart size={18} /> {data?.isSave ? "Unsave ": "Save "}Class
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
            </div>
          </div>
        </div>
        <div className="meta_row">
          <span className="avatar">
            <img src={data?.tutor?.image || ""} alt="avatar" />
          </span>

          <span className="duration">
            {data?.duration
              ? `${(data?.duration / 60).toFixed(1)} hrs`
              : "—"}
          </span>
          <span className="mode_badge">
            {data?.classMode ? ClASS_MODE_NAME[data?.classMode] : ""}
          </span>
          {roleName == "tutor" ? null : (
            <button
              onClick={() => {
                roleName == "parent"
                  ? navigate(`/parent/ClassDetail/${data?._id}`)
                  : navigate(`/tutor/classes/details/${data?._id}`);
              }}
              className="enroll_btn"
            >
              Enroll Now
            </button>
          )}
        </div>
        <ReportClass
          open={open1}
          onClose={() => setOpen1(false)}
          setOpen={setOpen1}
          data={data}
        />
      </div>
    </div>
  );
});

export default FreeClasses;


