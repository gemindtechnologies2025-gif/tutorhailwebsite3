import React, { useRef, useState } from "react";
import Box from "@mui/material/Box";
import { ForumTypeInterface } from "../types/General";
import {
  useAddPollMutation,
  useCommentEngagementMutation,
  useCommentsQuery,
  useDeleteContentMutation,
  useEngagementMutation,
  useFollowTutorMutation,
  usePollResultQuery,
} from "../service/content";
import {
  CommentEngagements,
  CONTENT_TYPE,
  Engagements,
  POST_TYPE,
  UPVOTE_ROLE,
} from "../constants/enums";
import useAuth from "../hooks/useAuth";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Button,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  TextField,
  Tooltip,
} from "@mui/material";
import { isValidInput } from "../utils/validations";
import { showError, showToast } from "../constants/toast";
import moment from "moment";
import CloseIcon from "@mui/icons-material/Close";
import { AddFormAndDisscussion } from "../Modals/AddFormAndDisscussion";
import { useNavigate } from "react-router-dom";
import { RWebShare } from "react-web-share";
import { useAppSelector } from "../hooks/store";
import { getRole } from "../reducers/authSlice";
import GiftModal from "../Modals/GiftModal";
import AdvanceDocumentViewer from "./DocViewer";
import ReportContentModal from "../Modals/ReportContent";
import DontShowPostModal from "./DontShowPostModal";
import MuteForumModal from "./MuteForumModal";
import { REDIRECTLINK } from "../constants/url";
import LinearProgress from "@mui/material/LinearProgress";
import LoginAlertModal from "../Modals/LoginAlertModal";
import { getFromStorage } from "../constants/storage";
import { STORAGE_KEYS } from "../constants/storageKeys";
import ImageGrid from "./ImageGrid";
import GiftsListingModal from "../Modals/GiftsListingModal";

type Reply = {
  text: string;
  isReply: boolean;
  userName: string;
  id: string;
};

interface UpvoteProps {
  data?: ForumTypeInterface | any;
  saved?: boolean;
}

const Upvote = React.forwardRef<HTMLDivElement, UpvoteProps>(
  ({ data, saved }, ref) => {
    const navigate = useNavigate();
    const token = getFromStorage(STORAGE_KEYS.token);
    const [expanded, setExpanded] = React.useState(false);
    const [updateEngagement] = useEngagementMutation({});
    const [openEdit, setOpenEdit] = useState<boolean>(false);
    const handleOpenEdit = () => setOpenEdit(true);
    const [openGift, setOpenGift] = useState<boolean>(false);
    const [openGift1, setOpenGift1] = useState<boolean>(false);
    const [openReport, setOpenReport] = useState<boolean>(false);
    const [openHideModal, setOpenHideModal] = useState<boolean>(false);
    const [openDontModal, setOpenDontModal] = useState<boolean>(false);
    const handleCloseEdit = () => setOpenEdit(false);
    const user = useAuth();
    const [expandedReplies, setExpandedReplies] = useState<string[]>([]);
    const replyRef = useRef<any>(null);
    const [followTutor] = useFollowTutorMutation();
    const [comment, setComment] = useState<string>("");
    const isUser = data?.user?._id == user?._id;
    const [reply, setReply] = useState<Reply>({
      text: "",
      isReply: false,
      userName: "",
      id: "",
    });
    const [showComment, setShowComment] = useState<boolean>(false);
    const [viewResult, setViewResult] = useState<boolean>(
      data?.userVotedOptionId ? true : false
    );
    const { data: comments, isLoading } = useCommentsQuery(
      { id: data?._id },
      { skip: !data?._id || !showComment }
    );
    const [replyHandleApi] = useCommentEngagementMutation();
    const [deleteContent] = useDeleteContentMutation();
    const [addVote] = useAddPollMutation();
    const roleName = useAppSelector(getRole);
    const { data: pollResultData, refetch } = usePollResultQuery(
      { id: data?._id || "" },
      { skip: data?.uploadType !== POST_TYPE.POLL || roleName === "parent" }
    );
    const [open2, setOpen2] = React.useState<boolean>(false);
    const handleClose2 = () => {
      setOpen2(false);
    };
    const deleteForum = async () => {
      try {
        const res = await deleteContent({ id: data?._id }).unwrap();
        if (res?.statusCode === 200) {
          showToast("Forum deleted Successfully");
          handleClose();
        }
      } catch (error: any) {
        showError(error?.data?.message);
      }
    };

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: any) => {
      setAnchorEl(event.currentTarget);
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

    const addVoteFunction = async (id: string) => {
      try {
        let body = {
          contentId: data?._id || "",
          pollOptionId: id,
        };
        const res = await addVote({ body }).unwrap();
        if (res?.statusCode === 200) {
        }
      } catch (error: any) {
        showError(error?.data?.message || "Something went wrong");
      }
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    const handleEdit = () => {
      handleClose();
      setOpenEdit(true);
    };

    const AddComment = async () => {
      const body = {
        contentId: data?._id || "",
        engagementType: Engagements.COMMENT,
        commentText: comment,
      };
      try {
        const res = await updateEngagement(body).unwrap();
        if (res?.statusCode == 200) {
          setComment("");
        }
      } catch (error: any) {
        showError(error?.data?.message || "Something went wrong");
      }
    };

    const followTutorFunc = async () => {
      const body = {
        tutorId: data?.user?._id || "",
      };
      try {
        const res = await followTutor(body).unwrap();
        if (res?.statusCode == 200) {
        }
      } catch (error: any) {
        showError(error?.data?.message || "Something went wrong");
      }
    };

    const AddCommentReply = async () => {
      const body = {
        commentId: reply.id || "",
        type: CommentEngagements.REPLY,
        reply: comment,
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
          setComment("");
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

    const handleEngagement = async (type: number) => {
      try {
        let body = {
          contentId: data?._id || "",
          engagementType: type,
        };

        const res = await updateEngagement(body).unwrap();
        if (res?.statusCode === 200) {
        }
      } catch (error: any) {
        // handle error
      }
    };

    const notInteresed = async () => {
      try {
        let body = {
          contentId: data?._id || "",
          engagementType: Engagements.NOT_INTERESTED,
        };

        const res = await updateEngagement(body).unwrap();
        if (res?.statusCode === 200) {
          showToast("Submitted successfully");
        }
      } catch (error: any) {
        // handle error
      }
    };

    const isLong = data?.description && data.description.length > 162;
    // const displayText =
    //   isLong && !expanded
    //     ? data.description!.slice(0, 162) + "..."
    //     : data?.description || "";

    const displayText = isLong
      ? !expanded
        ? `${data.description!.slice(0, 162)}... <span style="cursor:pointer;color:blue;">Read More</span>`
        : `${data?.description || ""} <span style="cursor:pointer;color:blue;">Show Less</span>`
      : data?.description || "";

    const toggleReplies = (commentId: string) => {
      setExpandedReplies((prev) =>
        prev.includes(commentId)
          ? prev.filter((id) => id !== commentId)
          : [...prev, commentId]
      );
    };

    const isImage = (url: string) => {
      const ext = url.split(".").pop()?.toLowerCase();
      if (url?.includes("-blob")) return true;
      return ["jpg", "jpeg", "png", "gif", "webp"].includes(ext || "");
    };

    const isPDF = (url: string) =>
      url.split(".").pop()?.toLowerCase() === "pdf";
    const isVideo = (url: string) =>
      ["mp4", "webm", "ogg"].includes(
        url.split(".").pop()?.toLowerCase() || ""
      );

    return (
      <div ref={ref} className="study_card_wrp">
        <div
          style={{
            display: "flex",
            gap: "10px",
            justifyContent: "space-between",
            alignItems: "center ",
          }}
        >
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {data?.category?.name ? (
              <pre>{data?.category?.name || ""}</pre>
            ) : null}
            {data?.subjects?.map((item: any, index: number) => (
              <pre key={index}>{item?.name}</pre>
            ))}
          </div>

          {isUser ? (
            <div className="rt_filter">
              <IconButton onClick={handleClick}>
                <MoreVertIcon />
              </IconButton>
              <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                {data?.uploadType != POST_TYPE.POLL ? (
                  <MenuItem onClick={handleEdit}>Edit</MenuItem>
                ) : null}
                <MenuItem onClick={deleteForum}>Delete</MenuItem>
              </Menu>
            </div>
          ) : (
            <div className="rt_filter">
              <IconButton onClick={handleClick}>
                <MoreVertIcon />
              </IconButton>
              <div className="filter_menubar">
                <Menu
                  className="filter_menubar"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                >
                  <MenuItem>
                    <RWebShare
                      data={{
                        text: "Click on link to see the forum details",
                        url: `${REDIRECTLINK}${roleName == "tutor" ? "tutor" : "parent"}/formDetails/${data?._id}`,
                        title: data?.title || "",
                      }}
                    >
                      <figure>
                        <img src={`/static/images/share.svg`} alt="svg" />
                        <figcaption>{"Share Discussion"}</figcaption>
                      </figure>
                    </RWebShare>
                  </MenuItem>
                  <MenuItem
                    onClick={() => (token ? setOpenReport(true) : setOpen2)}
                  >
                    <figure>
                      <img src={`/static/images/shield.png`} alt="svg" />
                      <figcaption>{"Report Learner"}</figcaption>
                    </figure>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      if (token) {
                        setOpenHideModal(true);
                        handleClose();
                      } else {
                        setOpen2(true);
                      }
                    }}
                  >
                    <figure>
                      <img src={`/static/images/approved.png`} alt="svg" />
                      <figcaption>{"Mute Learner"}</figcaption>
                    </figure>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      if (token) {
                        notInteresed();
                        handleClose();
                      } else {
                        setOpen2(true);
                      }
                    }}
                  >
                    <figure>
                      <img src={`/static/images/hide.png`} alt="svg" />
                      <figcaption>{"Not Interested"}</figcaption>
                    </figure>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      if (token) {
                        setOpenDontModal(true);
                        handleClose();
                      } else {
                        setOpen2(true);
                      }
                    }}
                  >
                    <figure>
                      <img src={`/static/images/hidePost.png`} alt="svg" />
                      <figcaption>{`Don't show ${data?.user?.name}'s discussion`}</figcaption>
                    </figure>
                  </MenuItem>
                </Menu>
              </div>
            </div>
          )}
        </div>
        <div className="profile_row">
          <div
            className="lt"
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
            }}
          >
            <figure
              onClick={() => {
                if (data?.createdBy == UPVOTE_ROLE.TUTOR) {
                  navigate(`/parent/tutorProfieDetails/${data?.user?._id}`);
                }
              }}
            >
              <img
                src={data?.user?.image || `/static/images/emili.png`}
                alt="png"
              />
              <figcaption
                onClick={() => {
                  if (data?.createdBy == UPVOTE_ROLE.TUTOR) {
                    navigate(`/parent/tutorProfieDetails/${data?.user?._id}`);
                  }
                }}
              >
                {data?.user?.name || ""}
                <p>
                  {data?.createdAt ? moment(data?.createdAt).fromNow() : ""}{" "}
                  <span>
                    <img src={`/static/images/eye.svg`} alt="eye" />
                    {data?.views || "0"}
                  </span>
                </p>
              </figcaption>
            </figure>
            {/* Gift Button at Corner */}
            <span
              style={{
                top: 0,
                right: 0,
                zIndex: 2,
                cursor: "pointer",
              }}
              onClick={() =>
                token && roleName === "tutor"
                  ? setOpenGift1(true)
                  : token && roleName === "parent"
                    ? setOpenGift(true)
                    : setOpen2(true)
              }
            >
              <img
                width="20px"
                src={`/static/images/gift_bk.png`}
                alt="Gift"
                title="Gift"
              />
            </span>
          </div>
        </div>

        <div
          className="profile_des"
          onClick={() =>
            saved &&
            navigate(
              `/${roleName == "tutor" ? "tutor" : "parent"}/formDetails/${data?._id}`
            )
          }
        >
          <h2>{data?.title || ""}</h2>
          <p
            dangerouslySetInnerHTML={{ __html: displayText }}
            onClick={() => setExpanded(!expanded)}
          ></p>
          {/* grid_view */}
          {data?.images?.length ? (
            // Case: all are images and more than one → slider
            data.images.length > 1 ? (
              <ImageGrid data={{ images: data?.images }} />
            ) : (
              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  flexWrap: "wrap",
                  marginBottom: "20px",
                }}
              >
                {data?.images?.map((url: string, index: number) => {
                  if (isImage(url)) {
                    return (
                      <figure>
                        <img
                          key={index}
                          width="100px"
                          src={url}
                          alt="media"
                          style={{
                            borderRadius: "4px",
                            border: "1px solid #ccc",
                          }}
                        />
                      </figure>
                    );
                  }
                  if (isPDF(url)) {
                    return (
                      <iframe
                        src={`https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`}
                        style={{
                          width: "100%",
                          height: "400px",
                          border: "1px solid #e0e0e0",
                          borderRadius: "15px",
                          marginBottom: "20px",
                        }}
                        title={"PDF Document"}
                      />
                    );
                  }
                  if (isVideo(url)) {
                    return (
                      <video
                        key={index}
                        width="100%"
                        height="240"
                        controls
                        style={{
                          borderRadius: "4px",
                          border: "1px solid #ccc",
                        }}
                      >
                        <source
                          src={url}
                          type={`video/${url.split(".").pop()}`}
                        />
                        Your browser does not support the video tag.
                      </video>
                    );
                  }
                  return <AdvanceDocumentViewer key={index} url={url} />;
                })}
              </div>
            )
          ) : null}

          {data?.uploadType == POST_TYPE.POLL ? (
            <div className="poll_options">
              <h2>{data?.question || ""}</h2>
              {(data?.userVotedOptionId && roleName == "parent") ||
              (!data?.userVotedOptionId && viewResult) ||
              (roleName == "tutor" && viewResult) ? (
                <ul>
                  {roleName == "parent"
                    ? data?.pollOptions?.map((option: any, index: number) => (
                        <li className="home_li_progress" key={index}>
                          <p>
                            {" "}
                            <span>{option?.option}</span>{" "}
                            {option?.votes
                              ? (
                                  (option?.votes / data?.votesCount) *
                                  100
                                )?.toFixed(1)
                              : 0}
                            %
                          </p>
                          {!option?.votes ? (
                            <LinearProgress
                              variant="determinate"
                              value={100}
                              sx={{
                                height: 10,
                                borderRadius: 5,
                                backgroundColor: "#e0e0e0",
                                "& .MuiLinearProgress-bar": {
                                  backgroundColor: "lightgrey", // grey bar
                                },
                              }}
                            />
                          ) : (
                            <LinearProgress
                              variant="determinate"
                              value={
                                option?.votes
                                  ? (option?.votes / data?.votesCount) * 100
                                  : 0
                              }
                              sx={{
                                height: 10,
                                borderRadius: 5,
                                backgroundColor: "lightgray", // light grey track
                                "& .MuiLinearProgress-bar": {
                                  backgroundColor: "#05A633",
                                },
                              }}
                            />
                          )}
                        </li>
                      ))
                    : pollResultData?.data?.results?.map(
                        (option: any, index: number) => (
                          <li className="home_li_progress" key={index}>
                            <p>
                              {" "}
                              <span>{option?.option}</span>{" "}
                              {Math.round(option?.percentage) || 0}%
                            </p>
                            {option?.percentage &&
                            option?.percentage == "0.00" ? (
                              <LinearProgress
                                variant="determinate"
                                value={100}
                                sx={{
                                  height: 10,
                                  borderRadius: 5,
                                  backgroundColor: "#e0e0e0", // light grey track
                                  "& .MuiLinearProgress-bar": {
                                    backgroundColor: "lightgrey", // grey bar
                                  },
                                }}
                              />
                            ) : (
                              <LinearProgress
                                variant="determinate"
                                value={Math.round(option?.percentage) || 0}
                                sx={{
                                  height: 10,
                                  borderRadius: 5,
                                  backgroundColor: "lightgrey", // light grey track
                                  "& .MuiLinearProgress-bar": {
                                    backgroundColor: "#05A633", // grey bar
                                  },
                                }}
                              />
                            )}
                          </li>
                        )
                      )}
                </ul>
              ) : (
                <ul className="poll_options_list">
                  {data?.pollOptions?.map((option: any, index: number) => (
                    <li key={index}>
                      <Box
                        onClick={() =>
                          token ? addVoteFunction(option?._id) : setOpen2(true)
                        }
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <span>
                          {option?.option} ({option.votes || 0} votes)
                        </span>
                      </Box>
                    </li>
                  ))}
                </ul>
              )}

              {data?.userVotedOptionId &&
              roleName == "parent" ? null : viewResult ? (
                <p onClick={() => setViewResult(false)}>
                  {pollResultData?.data?.totalVotes || 0}{" "}
                  {pollResultData?.data?.totalVotes == 1 ? "vote" : "votes"} .
                  Hide Results
                </p>
              ) : (
                <p onClick={() => setViewResult(true)}>View Results</p>
              )}
            </div>
          ) : null}

          {data?.contentType == CONTENT_TYPE.FORUM ? (
            <div className="count_like">
              <ul>
                <li>
                  <figure>
                    <img
                      src={
                        data?.isLike
                          ? `/static/images/heart_fill.svg`
                          : `/static/images/heart.svg`
                      }
                      alt="svg"
                    />
                    <figcaption>{data?.likeCount || "0"}</figcaption>
                  </figure>
                </li>

                <li>
                  <figure>
                    <img src={`/static/images/comments_upvote.png`} alt="svg" />
                    <figcaption>{data?.commentCount || "0"}</figcaption>
                  </figure>{" "}
                </li>
                <li>
                  <figure>
                    <img
                      src={
                        data?.isUpvote
                          ? `/static/images/count-up_fill.svg`
                          : `/static/images/count-up.svg`
                      }
                      alt="svg"
                    />
                    <figcaption>{data?.upVoteCount || "0"}</figcaption>
                  </figure>
                </li>
                <li>
                  <figure>
                    <img
                      src={
                        data?.isDownvote
                          ? `/static/images/count_down_fill.svg`
                          : `/static/images/count_down.svg`
                      }
                      alt="svg"
                    />
                    <figcaption>{data?.downVoteCount || "0"}</figcaption>
                  </figure>
                </li>
                <li>
                  <figure>
                    <img src={`/static/images/eye.svg`} alt="svg" />
                    <figcaption> {data?.views || "0"} Views</figcaption>
                  </figure>
                </li>
              </ul>
            </div>
          ) : (
            <div className="count_like count_flex">
              <ul>
                <li>
                  <figure>
                    <figcaption>{data?.likeCount || "0"}</figcaption>
                    <p>Likes</p>
                  </figure>
                </li>

                <li>
                  <figure>
                    <figcaption>{data?.commentCount || "0"}</figcaption>
                    <p>Comments</p>
                  </figure>{" "}
                </li>
                <li>
                  <figure>
                    <figcaption>{data?.upVoteCount || "0"}</figcaption>
                    <p>Upvotes</p>
                  </figure>
                </li>
                <li>
                  <figure>
                    <figcaption>{data?.downVoteCount || "0"}</figcaption>
                    <p>Downvotes</p>
                  </figure>
                </li>
                <li>
                  <figure>
                    <figcaption> {data?.user?.followers || "0"} </figcaption>
                    <p>Followers</p>
                  </figure>
                </li>
              </ul>
            </div>
          )}
        </div>

        <div className="social_footer">
          <div className="row">
            <ul className="rt__s">
              <li>
                <figure
                  onClick={() =>
                    token ? handleEngagement(Engagements.LIKE) : setOpen2(true)
                  }
                >
                  <img
                    src={
                      data?.isLike
                        ? `/static/images/like_fill.svg`
                        : `/static/images/like.svg`
                    }
                    alt="svg"
                  />
                  <figcaption>{"Like"}</figcaption>
                </figure>
              </li>
              <li>
                <figure
                  onClick={() =>
                    saved
                      ? navigate(
                          `/${roleName == "tutor" ? "tutor" : "parent"}/formDetails/${data?._id}`
                        )
                      : setShowComment(!showComment)
                  }
                >
                  <img src={`/static/images/comments_upvote.png`} alt="svg" />
                  <figcaption>{"Comment"}</figcaption>
                </figure>{" "}
              </li>
              <li>
                <figure
                  onClick={() =>
                    token
                      ? handleEngagement(Engagements.UPVOTE)
                      : setOpen2(true)
                  }
                >
                  <img
                    style={{ width: "18px", height: "18px" }}
                    src={
                      data?.isUpvote
                        ? `/static/images/upvote_up_green.png`
                        : `/static/images/upvote_up_black.png`
                    }
                    alt="svg"
                  />
                  <figcaption>{"Upvote"}</figcaption>
                </figure>
              </li>

              <li>
                <figure
                  onClick={() =>
                    token
                      ? handleEngagement(Engagements.DOWNVOTE)
                      : setOpen2(true)
                  }
                >
                  <img
                    style={{ width: "18px", height: "18px" }}
                    src={
                      data?.isDownvote
                        ? `/static/images/upvote_down_green.png`
                        : `/static/images/upvote_down_black.png`
                    }
                    alt="svg"
                  />
                  <figcaption>{"Downvote"}</figcaption>
                </figure>
              </li>

              <li onClick={() => (token ? handleSave() : setOpen2(true))}>
                <figure>
                  <img
                    src={
                      data?.isSave
                        ? `/static/images/save.svg`
                        : `/static/images/save_empty.svg`
                    }
                    alt="svg"
                  />
                  <figcaption>{data?.isSave ? "Saved" : "Save"}</figcaption>
                </figure>
              </li>
              {isUser || data?.createdBy == UPVOTE_ROLE.PARENT ? null : (
                <li
                  onClick={() => (token ? followTutorFunc() : setOpen2(true))}
                >
                  <figure>
                    <img
                      src={
                        data?.isFollowing
                          ? `/static/images/followedGreen.png`
                          : `/static/images/followUpvote.png`
                      }
                      alt="svg"
                    />
                    <figcaption>{"Follow"}</figcaption>
                  </figure>
                </li>
              )}
            </ul>
          </div>
        </div>
        {showComment ? (
          <div className="comment_section">
            <ins>{comments?.data?.total || 0} Comments</ins>

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
                                item?.user?.image || `/static/images/sophie.png`
                              }
                              alt="sophie"
                            />
                          </figure>
                          <div className="comment_sc_inr">
                            <h4>
                              {item?.user?.name}
                              {/* <span>Tutor</span> */}
                            </h4>
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
                                    console.log(replyRef, "replyRef");
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
            <div className="send_group_row">
              <TextField
                inputRef={replyRef}
                placeholder={
                  reply.isReply
                    ? `reply to ${reply.userName}.. `
                    : "Add comment"
                }
                value={comment}
                onChange={(e) => {
                  if (isValidInput(e.target.value)) {
                    setComment(e.target.value);
                  }
                }}
                InputProps={{
                  endAdornment: reply.isReply ? (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => {
                          setComment("");
                          setReply({
                            text: "",
                            isReply: false,
                            userName: "",
                            id: "",
                          });
                        }}
                      >
                        <CloseIcon />
                      </IconButton>
                    </InputAdornment>
                  ) : null,
                }}
              />
              <span
                className="gift_btn"
                onClick={() =>
                  reply.isReply ? AddCommentReply() : AddComment()
                }
              >
                <img width={"25px"} src={`/static/images/send.png`} alt="" />
              </span>
            </div>
          </div>
        ) : null}

        {/* comment setion */}
        <AddFormAndDisscussion
          handleClose={handleCloseEdit}
          handleOpen={handleOpenEdit}
          open={openEdit}
          data={data}
          edit={true}
        />
        <GiftModal
          open={openGift}
          setOpen={setOpenGift}
          onClose={() => setOpenGift(false)}
          data={data}
        />
        <GiftsListingModal
          open={openGift1}
          setOpen={setOpenGift1}
          onClose={() => setOpenGift1(false)}
          id={data?._id}
        />
        <ReportContentModal
          open={openReport}
          setOpen={setOpenReport}
          onClose={() => setOpenReport(false)}
          data={data}
        />
        <DontShowPostModal
          open={openHideModal}
          onClose={() => setOpenHideModal(false)}
          setOpen={setOpenHideModal}
          data={data}
        />
        <MuteForumModal
          open={openDontModal}
          onClose={() => setOpenDontModal(false)}
          setOpen={setOpenDontModal}
          data={data}
        />
        <LoginAlertModal
          open={open2}
          setOpen={setOpen2}
          onClose={handleClose2}
          msg="Please login"
        />
      </div>
    );
  }
);

export default Upvote;
