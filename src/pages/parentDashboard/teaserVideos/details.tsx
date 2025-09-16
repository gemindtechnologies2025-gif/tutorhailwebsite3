import { useNavigate, useParams } from "react-router-dom";
import { AddFormAndDisscussion } from "../../../Modals/AddFormAndDisscussion";
import {
  useCommentEngagementMutation,
  useCommentsQuery,
  useEngagementMutation,
  useFollowTutorMutation,
  useGetContentByIdQuery,
  useGetContentQuery,
} from "../../../service/content";
import SendIcon from "@mui/icons-material/Send";

import Loader from "../../../constants/Loader";
import { TutorLayout } from "../../../layout/tutorLayout";
import NewSideBarTutor from "../../../components/NewSideBarTutor";
import { ParentLayout } from "../../../layout/parentLayout";
import TutorListing from "../../../components/TutorListing";
import { RWebShare } from "react-web-share";
import React, { useRef, useState } from "react";
import { CommentEngagements, Engagements } from "../../../constants/enums";
import { showError } from "../../../constants/toast";
import moment from "moment";
import { isValidInput } from "../../../utils/validations";
import GiftModal from "../../../Modals/GiftModal";
import { Tooltip } from "@material-ui/core";
import ReportContentModal from "../../../Modals/ReportContent";
import { REDIRECTLINK } from "../../../constants/url";
import NewSideBarParent from "../../../components/NewSideBarParent";
import { getFromStorage } from "../../../constants/storage";
import { STORAGE_KEYS } from "../../../constants/storageKeys";
import LoginAlertModal from "../../../Modals/LoginAlertModal";

type Reply = {
  text: string;
  isReply: boolean;
  userName: string;
  id: string;
};
export const  TeaserVideoDetailsParent = () => {
  const { id } = useParams();
  const token=getFromStorage(STORAGE_KEYS.token)
  const navigate=useNavigate();
  const [replyHandleApi] = useCommentEngagementMutation();
  const [showComments, setShowComments] = useState(false);
  const { data: ForumData, isLoading } = useGetContentByIdQuery({
    id: id,
  });
  const [openGift, setOpenGift] = useState<boolean>(false);
  const [openReport, setOpenReport] = useState<boolean>(false);
  const [followTutor] = useFollowTutorMutation();
  const [updateEngagement] = useEngagementMutation({});
  const [newComment, setNewComment] = useState("");
  const [expandedReplies, setExpandedReplies] = useState<string[]>([]);
  const { data: comments } = useCommentsQuery(
    { id: id },
    { skip: !id || !showComments }
  );
  const replyRef = useRef<any>(null);
  const [reply, setReply] = useState<Reply>({
    text: "",
    isReply: false,
    userName: "",
    id: "",
  });
   const [open2, setOpen2] = React.useState<boolean>(false);
        const handleClose2 = () => {
          setOpen2(false);
        };

  const toggleReplies = (commentId: string) => {
    setExpandedReplies((prev) =>
      prev.includes(commentId)
        ? prev.filter((id) => id !== commentId)
        : [...prev, commentId]
    );
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
  const followTutorFunc = async () => {
    const body = {
      tutorId: ForumData?.data?.user?._id || "",
    };
    try {
      const res = await followTutor(body).unwrap();
      if (res?.statusCode == 200) {
      }
    } catch (error: any) {
      showError(error?.data?.message || "Something went wrong");
    }
  };

  const AddComment = async () => {
    const body = {
      contentId: ForumData?.data?._id || "",
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
  const handleEngagement = async (type: number) => {
    try {
      let body = {
        contentId: ForumData?.data?._id || "",
        engagementType: type,
      };

      const res = await updateEngagement(body).unwrap();
      if (res?.statusCode === 200) {
        // handle success
      }
    } catch (error: any) {
      // handle error
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
  return (
    <ParentLayout className="role-layout">
      <Loader isLoad={isLoading} />
      <main className="content">
        <section className="uh_spc pSearchResult_sc home_wrp teaser_video_prf">
          <div className="conta_iner v2">
            <div className="mn_fdx">
              <NewSideBarParent />
              <div className="mdl_cntnt">
                <div className="thoughts">
                  <div>
                    <video
                      src={
                        ForumData?.data?.images?.[0] ||
                        "/static/videos/sample.mp4"
                      }
                      style={{
                        width: "100%",
                        maxHeight: "300px",
                        objectFit: "contain",
                      }}
                      controls
                    />
                  </div>
                  <div className="title_top">
                    <h2>{ForumData?.data?.title || ""}</h2>
                    <RWebShare
                      data={{
                        text: "Click on link to see the teaser video details",
                        url: `${REDIRECTLINK}teaserVideos/${ForumData?.data?._id}`,
                        title: ForumData?.data?.title || "",
                      }}
                    >
                      <img
                        className="share"
                        src={`/static/images/share.png`}
                        alt="png"
                        width={"35px"}
                      />
                    </RWebShare>
                    <Tooltip title="Report">
                      <img 
                      onClick={()=>token ? setOpenReport(true):setOpen2(true)}
                        src={`/static/images/problem.png`}
                        alt="png"
                        width={"35px"}
                      />
                    </Tooltip>
                  </div>
                  <h4 className="video_duration">
                    {ForumData?.data?.views || 0} Views |{" "}
                    {ForumData?.data?.createdAt
                      ? moment(ForumData?.data?.createdAt).format("LL")
                      : ""}
                  </h4>
                  <ul className="like">
                    <li
                      className="like_li"
                      onClick={() => token ? handleEngagement(Engagements.LIKE):setOpen2(true)}
                    >
                      <span>{ForumData?.data?.likeCount || "0"}</span>
                      <img
                        src={
                          ForumData?.data?.isLike
                            ? `/static/images/like_fill.svg`
                            : `/static/images/like.svg`
                        }
                        alt="svg"
                      />
                    </li>
                    <li onClick={() => token ?  setShowComments(true):setOpen2(true)}>
                      {ForumData?.data?.commentCount || 0} Comments
                    </li>
                    <li onClick={() => token ?  setOpenGift(true):setOpen2(true)}>Gifts</li>
                    <li onClick={() => token ? navigate(`/parent/ScheduleBookings/${ForumData?.data?.user?._id}`):setOpen2(true)}>Request session</li>
                  </ul>
                  <div className="profile_row1">
                    <figure>
                      <img
                        src={
                          ForumData?.data?.user?.image ||
                          `/static/images/emili.png`
                        }
                        alt="png"
                        width={"50px"}
                      />
                    </figure>
                    <div>
                      <h2> {ForumData?.data?.user?.name || "User"}</h2>
                      <p>{ForumData?.data?.user?.followers || 0} Followers</p>
                    </div>
                    <button onClick={()=> token ?  followTutorFunc():setOpen2(true)} >
                      {ForumData?.data?.isFollowing ? "Unfollow" : "Follow"}
                    </button>
                  </div>

                  <div className="details_row">
                    <p>
                      {" "}
                      <b>Subject</b>
                      {ForumData?.data?.subjects?.name || ""}
                    </p>

                    <p>
                      {" "}
                      <b>Topic </b>
                      {ForumData?.data?.topic || ""}
                    </p>

                    <p>
                      {" "}
                      <b>Grade</b>Primary
                    </p>
                  </div>

                  <div className="objective">
                    <h3>Objective</h3>
                    <p
                      dangerouslySetInnerHTML={{
                        __html: ForumData?.data?.description || "",
                      }}
                    />
                  </div>
                  {showComments ? (
                    <div className="comment_modal">
                      <div className="modal_content">
                        <div className="modal_header">
                          <h4> {comments?.data?.total || 0} Comments</h4>
                          <button onClick={() => setShowComments(false)}>
                            ✕
                          </button>
                        </div>

                        <div className="comment_list comment_section">
                          <ul>
                            {comments?.data?.data?.length
                              ? comments?.data?.data?.map(
                                  (item: any, index: number) => {
                                    const isExpanded = expandedReplies.includes(
                                      item._id
                                    );
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
                                            <h4>
                                              {item?.user?.name}
                                              {/* <span>Tutor</span> */}
                                            </h4>
                                            <p>{item?.commentText || ""}</p>
                                            <div className="reaction_box">
                                              <span
                                                onClick={() =>
                                                  LikeOnReply(item?._id)
                                                }
                                              >
                                                {item?.isLiked
                                                  ? "Unlike"
                                                  : "Like"}
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
                                                    console.log(
                                                      replyRef,
                                                      "replyRef"
                                                    );
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
                                            onClick={() =>
                                              toggleReplies(item._id)
                                            }
                                          >
                                            {" "}
                                            {isExpanded
                                              ? "Hide replies"
                                              : "View replies"}
                                          </p>
                                        ) : null}
                                        {isExpanded
                                          ? item?.commentReply?.map(
                                              (reply: any) => {
                                                return (
                                                  <li key={reply}>
                                                    <div>
                                                      <figure>
                                                        <img
                                                          src={
                                                            reply?.replyUser
                                                              ?.image ||
                                                            `/static/images/sophie.png`
                                                          }
                                                          alt="sophie"
                                                        />
                                                      </figure>
                                                      <div className="comment_sc_inr">
                                                        <h4>
                                                          {
                                                            reply?.replyUser
                                                              ?.name
                                                          }
                                                        </h4>
                                                        <p>
                                                          {reply?.reply || ""}
                                                        </p>
                                                      </div>
                                                    </div>
                                                    <p className="seen_hr">
                                                      {moment(
                                                        reply?.createdAt
                                                      ).fromNow()}
                                                    </p>
                                                  </li>
                                                );
                                              }
                                            )
                                          : null}
                                      </li>
                                    );
                                  }
                                )
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
                </div>
              </div>
              <div className="sidebar_rt">
                <TutorListing />
              </div>
            </div>
          </div>
        </section>
      </main>

      <GiftModal
        open={openGift}
        setOpen={setOpenGift}
        onClose={() => setOpenGift(false)}
        data={ForumData?.data}
      />
      <ReportContentModal
        open={openReport}
        setOpen={setOpenReport}
        onClose={() => setOpenReport(false)}
        data={ForumData?.data}
      />
       <LoginAlertModal
                      open={open2}
                      setOpen={setOpen2}
                      onClose={handleClose2}
                      msg="Please login"
                    />
    </ParentLayout>
  );
};
