import AddIcon from "@mui/icons-material/Add";
import {
  useCommentEngagementMutation,
  useCommentsQuery,
  useEngagementMutation,
  useFollowTutorMutation,
} from "../service/content";
import { CommentEngagements, Engagements } from "../constants/enums";
import { showError, showWarning } from "../constants/toast";
import React, { useEffect, useRef, useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import moment from "moment";
import { isValidInput } from "../utils/validations";

import { RWebShare } from "react-web-share";
import GiftModal from "../Modals/GiftModal";
import ReportContentModal from "../Modals/ReportContent";
import { useNavigate } from "react-router-dom";
import { REDIRECTLINK } from "../constants/url";
import { getFromStorage } from "../constants/storage";
import { STORAGE_KEYS } from "../constants/storageKeys";
import { useInView } from "../hooks/useinView";
import LoginAlertModal from "../Modals/LoginAlertModal";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";

type Reply = {
  text: string;
  isReply: boolean;
  userName: string;
  id: string;
};

export const ReelsParent = ({ data, following, setFollowing, single }: any) => {
  const navigate = useNavigate();
  const [updateEngagement] = useEngagementMutation({});
  const [followTutor] = useFollowTutorMutation();
  const [showComments, setShowComments] = useState(false);
  const [replyHandleApi] = useCommentEngagementMutation();
  const [expandedReplies, setExpandedReplies] = useState<string[]>([]);
  const [openGift, setOpenGift] = useState<boolean>(false);
  const [openReport, setOpenReport] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showOverlay, setShowOverlay] = useState(false);
  const [userPaused, setUserPaused] = useState(false);

  // Progress bar states
  const [progress, setProgress] = useState(0); // 0.0 - 1.0
  const [duration, setDuration] = useState(1);

  const replyRef = useRef<any>(null);
  const token = getFromStorage(STORAGE_KEYS.token);
  const [reply, setReply] = useState<Reply>({
    text: "",
    isReply: false,
    userName: "",
    id: "",
  });
  const { data: comments } = useCommentsQuery(
    { id: data?._id },
    { skip: !data?._id || !showComments }
  );
  const videoRef = useRef<HTMLVideoElement>(null);
  const isInView = useInView(videoRef);
  const [open2, setOpen2] = React.useState<boolean>(false);
  const handleClose2 = () => {
    setOpen2(false);
  };

  const [newComment, setNewComment] = useState("");

  const toggleReplies = (commentId: string) => {
    setExpandedReplies((prev) =>
      prev.includes(commentId)
        ? prev.filter((id) => id !== commentId)
        : [...prev, commentId]
    );
  };

  const followTutorFunc = async () => {
    const body = {
      tutorId: data?.user?._id || "",
    };
    try {
      const res = await followTutor(body).unwrap();
      if (res?.statusCode == 200) {
        // Optionally handle success
      }
    } catch (error: any) {
      showError(error?.data?.message || "Something went wrong");
    }
  };

  const handleEngagement = async () => {
    try {
      let body = {
        contentId: data?._id || "",
        engagementType: Engagements.LIKE,
      };
      const res = await updateEngagement(body).unwrap();
      if (res?.statusCode === 200) {
        // Optionally handle success
      }
    } catch (error: any) {
      // Optionally handle error
    }
  };

  const handleSave = async () => {
    try {
      let body = {
        contentId: data?._id || "",
        engagementType: Engagements.SAVE,
      };
      const res = await updateEngagement(body).unwrap();
      if (res?.statusCode === 200) {
        // Optionally handle success
      }
    } catch (error: any) {
      // Optionally handle error
    }
  };

  const AddComment = async () => {
    const body = {
      contentId: data?._id || "",
      engagementType: Engagements.COMMENT,
      commentText: newComment,
    };
    try {
      const res = await updateEngagement(body).unwrap();
      if (res?.statusCode == 200) {
        setNewComment("");
      }
    } catch (error: any) {
      showError(error?.data?.message || "Something went wrong");
    }
  };

  const AddCommentReply = async () => {
    const body = {
      commentId: reply.id || "",
      type: CommentEngagements.REPLY,
      reply: newComment,
    };
    try {
      const res = await replyHandleApi(body).unwrap();
      if (res?.statusCode == 200) {
        setReply({
          text: "",
          isReply: false,
          userName: "",
          id: "",
        });
        setNewComment("");
      }
    } catch (error: any) {
      showError(error?.data?.message || "Something went wrong");
    }
  };

  const LikeOnReply = async (id: string) => {
    const body = {
      commentId: id,
      type: CommentEngagements.LIKE,
    };
    try {
      const res = await replyHandleApi(body).unwrap();
      if (res?.statusCode == 200) {
      }
    } catch (error: any) {
      showError(error?.data?.message || "Something went wrong");
    }
  };

  const handlePlay = () => {
    setIsPlaying(true);
    setShowOverlay(true);
    setUserPaused(false);
    setTimeout(() => setShowOverlay(false), 700);
  };

  const handlePause = () => {
    setIsPlaying(false);
    setShowOverlay(true);
    setUserPaused(true);
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setShowOverlay(true);
    setTimeout(() => setShowOverlay(false), 700);
  };

  // Progress bar logic
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video && duration > 0) {
      setProgress(video.currentTime / duration);
    }
  };
  const handleLoadedMetadata = () => {
    if (videoRef.current) setDuration(videoRef.current.duration || 1);
  };

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    if (isInView) {
      document.querySelectorAll("video").forEach((vid) => {
        if (vid !== videoEl) {
          vid.pause();
          vid.muted = true;
        }
      });

      videoEl.muted = false;
      if (!userPaused) {
        videoEl.play().catch(() => {});
      }
    } else {
      videoEl.pause();
      videoEl.muted = true;
    }
  }, [isInView, userPaused]);

  return (
    <div className="reels_flx">
      <div className="reels_wp">
        <figure className="video_mn" style={{ position: "relative" }}>
          <video
            ref={videoRef}
            controls={true}
            playsInline
            muted={false}
            autoPlay
            loop
            src={data?.images?.[0]}
            onPlay={handlePlay}
            onPause={handlePause}
            onClick={togglePlay}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
          />
          {/* Instagram-style progress bar */}
          <div className="insta-progress-bar">
            <div
              className="insta-progress-bar-inner"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          {showOverlay && (
            <div
              className="video-overlay"
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                background: "rgba(0,0,0,.35)",
                borderRadius: "50%",
                padding: "18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
                zIndex: 10,
                animation: "fadeOut 0.7s forwards",
              }}
            >
              {isPlaying ? (
                <PauseIcon style={{ fontSize: 64, color: "#fff" }} />
              ) : (
                <PlayArrowIcon style={{ fontSize: 64, color: "#fff" }} />
              )}
            </div>
          )}
        </figure>

        {/* Video Header */}
        <div className="video_header">
          <ul>
            <li onClick={() => navigate("/parent/posts")}>
              <span>Posts</span>
            </li>
            <li onClick={() => setFollowing(false)}>
              <span className={following ? "" : "active"}>Short Videos</span>
            </li>
            <li
              onClick={() => {
                single
                  ? navigate("/parent/videos", { state: { following: true } })
                  : setFollowing(true);
              }}
            >
              <span className={following ? "active" : ""}>Following</span>
            </li>
          </ul>
          <div onClick={() => navigate("/parent/videos/all")}>
            <img src={`/static/images/search-outline.svg`} alt="search" />
          </div>
        </div>

        {/* Footer */}
        <div className="video_footer">
          <p className="reel_name">{data?.user?.name || "user"}</p>
          <div className="btn_grp">
            <button className="btn voilet">
              {data?.subjects?.[0]?.name || ""}
            </button>
            <button className="btn primary">
              {data?.category?.name || ""}
            </button>
          </div>
          <div className="des_end">
            <h5>{data?.title || ""}</h5>
            <p dangerouslySetInnerHTML={{ __html: data?.description || "" }} />
          </div>
        </div>

        {/* COMMENT SECTION MODAL */}
        {showComments ? (
          <div className="comment_modal">
            <div className="modal_content">
              <div className="modal_header">
                <h4> {comments?.data?.total || 0} Comments</h4>
                <button onClick={() => setShowComments(false)}>✕</button>
              </div>

              <div className="comment_list comment_section">
                <ul>
                  {comments?.data?.data?.length
                    ? comments?.data?.data?.map((item: any, index: number) => {
                        const isExpanded = expandedReplies.includes(item._id);
                        return (
                          <li key={index}>
                            <div>
                              <figure>
                                <img
                                  src={
                                    item?.user?.image ||
                                    `/static/images/sophie.png`
                                  }
                                  alt="sophie"
                                />
                              </figure>
                              <div className="comment_sc_inr">
                                <h4>{item?.user?.name}</h4>
                                <p>{item?.commentText || ""}</p>
                                <div className="reaction_box">
                                  <span onClick={() => LikeOnReply(item?._id)}>
                                    {item?.isLiked ? "Unlike" : "Like"}
                                  </span>
                                  <span
                                    onClick={() => {
                                      setReply({
                                        text: item?.commentText,
                                        isReply: true,
                                        userName: item?.user?.name,
                                        id: item?._id,
                                      });
                                      if (replyRef?.current) {
                                        replyRef.current.focus();
                                      }
                                    }}
                                  >
                                    Reply
                                  </span>
                                </div>
                              </div>
                            </div>
                            <p className="seen_hr">
                              {moment(item?.createdAt).fromNow()}
                            </p>
                            {item?.commentReply?.length ? (
                              <p
                                className="replies"
                                onClick={() => toggleReplies(item._id)}
                              >
                                {" "}
                                {isExpanded ? "Hide replies" : "View replies"}
                              </p>
                            ) : null}
                            {isExpanded
                              ? item?.commentReply?.map((reply: any) => {
                                  return (
                                    <li key={reply}>
                                      <div>
                                        <figure>
                                          <img
                                            src={
                                              reply?.replyUser?.image ||
                                              `/static/images/sophie.png`
                                            }
                                            alt="sophie"
                                          />
                                        </figure>
                                        <div className="comment_sc_inr">
                                          <h4>{reply?.replyUser?.name}</h4>
                                          <p>{reply?.reply || ""}</p>
                                        </div>
                                      </div>
                                      <p className="seen_hr">
                                        {moment(reply?.createdAt).fromNow()}
                                      </p>
                                    </li>
                                  );
                                })
                              : null}
                          </li>
                        );
                      })
                    : null}
                </ul>
              </div>

              <div className="comment_input">
                <input
                  ref={replyRef}
                  type="text"
                  placeholder={
                    reply.isReply
                      ? `reply to ${reply.userName}.. `
                      : "Add comment"
                  }
                  value={newComment}
                  onChange={(e) => {
                    if (isValidInput(e.target.value)) {
                      setNewComment(e.target.value);
                    }
                  }}
                />
                <span
                  onClick={() =>
                    reply.isReply ? AddCommentReply() : AddComment()
                  }
                >
                  <SendIcon />
                </span>
              </div>
            </div>
          </div>
        ) : null}
        <GiftModal
          open={openGift}
          setOpen={setOpenGift}
          onClose={() => setOpenGift(false)}
          data={data}
        />
        <ReportContentModal
          open={openReport}
          setOpen={setOpenReport}
          onClose={() => setOpenReport(false)}
          data={data}
        />
      </div>
      <div className="video_sidebar video_sidebar1" style={{ height: "500px" }}>
        <ul>
          <li className="add_profile">
            <figure
              onClick={() =>
                !token
                  ? setOpen2(true)
                  : data?.isFollowing
                    ? navigate(`/parent/tutorProfieDetails/${data?.user?._id}`)
                    : followTutorFunc()
              }
            >
              <img
                className={data?.user?.isActive ? "online" : ""}
                src={data?.user?.image || `/static/images/add_profile.jpg`}
                alt="profile"
              />
              <figcaption>{data?.user?.name?.split(" ")[0] || ""}</figcaption>
              {!data?.isFollowing && (
                <span>
                  <AddIcon />
                </span>
              )}
            </figure>
          </li>
          <li onClick={() => (!token ? setOpen2(true) : handleSave())}>
            <figure>
              <img
                className={data?.isSave ? `img_white` : `img`}
                src={
                  data?.isSave
                    ? `/static/images/save.svg`
                    : `/static/images/white_save.svg`
                }
                alt="save"
              />
              <figcaption style={{ color: "white" }}>
                {data?.saveCount || 0}
              </figcaption>
            </figure>
          </li>
          <li onClick={() => (!token ? setOpen2(true) : handleEngagement())}>
            <figure>
              <img
                src={
                  data?.isLike
                    ? `/static/images/heart.png`
                    : `/static/images/likes.svg`
                }
                alt="like"
              />
              <figcaption style={{ color: "white" }}>
                {data?.likeCount || 0}
              </figcaption>
            </figure>
          </li>
          {/* COMMENT BUTTON */}
          <li
            onClick={() => (!token ? setOpen2(true) : setShowComments(true))}
            className="open_comment_trigger"
          >
            <figure>
              <img src={`/static/images/white_comment.svg`} alt="comment" />
              <figcaption style={{ color: "white" }}>
                {data?.commentCount || "0"}
              </figcaption>
            </figure>
          </li>
          <RWebShare
            data={{
              text: "Click on link to see the teaser video details",
              url: `${REDIRECTLINK}parent/Videos/${data?._id}`,
              title: data?.title || "",
            }}
          >
            <li>
              <figure>
                <img src={`/static/images/white_share.svg`} alt="share" />
                <figcaption style={{ color: "white" }}>
                  {data?.shareCount || 0}
                </figcaption>
              </figure>
            </li>
          </RWebShare>
          <li onClick={() => (!token ? setOpen2(true) : setOpenReport(true))}>
            <figure>
              <img
                width={30}
                className="img_white"
                src={`/static/images/problem.png`}
                alt="gift"
              />
              <figcaption style={{ color: "white" }}>Report</figcaption>
            </figure>
          </li>
          <li onClick={() => (!token ? setOpen2(true) : setOpenGift(true))}>
            <figure>
              <img src={`/static/images/white_gift.svg`} alt="gift" />
              <figcaption style={{ color: "white" }}>Gift</figcaption>
            </figure>
          </li>
        </ul>
      </div>
      <LoginAlertModal
        open={open2}
        setOpen={setOpen2}
        onClose={handleClose2}
        msg="Please login"
      />
      <style>{`
        @keyframes fadeOut {
          0% { opacity: 1; }
          85% { opacity: 1; }
          100% { opacity: 0; }
        }
        .insta-progress-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 4px;
          width: 100%;
          background: rgba(255,255,255,0.2);
          z-index: 20;
          pointer-events: none;
        }
        .insta-progress-bar-inner {
          height: 100%;
          background: #fff;
          width: 0%;
          transition: width 0.2s linear;
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
};

export default ReelsParent;
