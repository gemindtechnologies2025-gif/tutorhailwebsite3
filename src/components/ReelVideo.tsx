import React, { useRef, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import useAuth from "../hooks/useAuth";
import EditIcon from "@mui/icons-material/Edit";
import SendIcon from "@mui/icons-material/Send";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import {
  useCommentEngagementMutation,
  useCommentsQuery,
  useDeleteContentMutation,
  useEngagementMutation,
} from "../service/content";
import { showError, showToast } from "../constants/toast";
import { CommentEngagements, Engagements } from "../constants/enums";
import moment from "moment";
import { isValidInput } from "../utils/validations";
import GiftsListingModal from "../Modals/GiftsListingModal";

type Reply = {
  text: string;
  isReply: boolean;
  userName: string;
  id: string;
};
export const Reels = ({ data }: any) => {
  const user = useAuth();
  const navigate = useNavigate();
  const [deleteContent] = useDeleteContentMutation();
  const [updateEngagement] = useEngagementMutation({});
  const [showComments, setShowComments] = useState(false);
  const [replyHandleApi] = useCommentEngagementMutation();
  const [expandedReplies, setExpandedReplies] = useState<string[]>([]);
  const replyRef = useRef<any>(null);
  const [openGift1, setOpenGift1] = useState<boolean>(false);

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

  const [newComment, setNewComment] = useState("");

  const toggleReplies = (commentId: string) => {
    setExpandedReplies((prev) =>
      prev.includes(commentId)
        ? prev.filter((id) => id !== commentId)
        : [...prev, commentId]
    );
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
  const deleteForum = async () => {
    try {
      const res = await deleteContent({ id: data?._id }).unwrap();
      if (res?.statusCode === 200) {
        showToast("Short video deleted Successfully");
        navigate("/tutor/TutorShortVideos");
      }
    } catch (error: any) {
      showError(error?.data?.message);
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

  return (
    <div className="reels_wp">
      <div className="options">
        <EditIcon
          onClick={() =>
            navigate("/tutor/TutorShortVideos", {
              state: { edit: true, data: data },
            })
          }
        />
        <DeleteIcon onClick={() => deleteForum()} />
      </div>
      <figure className="video_mn">
        <video autoPlay={true} loop={true} src={data?.images?.[0]} />
      </figure>

      <div className="video_sidebar">
        <ul>
          <li className="add_profile">
            <figure>
              <img
                src={user?.image || `/static/images/add_profile.jpg`}
                alt=""
              />
              <figcaption>{user?.name || ""}</figcaption>
            </figure>
          </li>
          <li onClick={handleEngagement}>
            <figure>
              <img
                src={
                  data?.isLike
                    ? `/static/images/heart.png`
                    : `/static/images/likes.svg`
                }
                alt="like"
              />
              <figcaption>{data?.likeCount || 0}</figcaption>
            </figure>
          </li>
          <li
            onClick={() => setShowComments(true)}
            className="open_comment_trigger"
          >
            <figure>
              <img src={`/static/images/white_comment.svg`} alt="comment" />
              <figcaption>{data?.commentCount || "0"}</figcaption>
            </figure>
          </li>
          <li  onClick={()=>setOpenGift1(true)} >
            <figure>
              <img src={`/static/images/white_gift.svg`} alt="" />
              <figcaption>Gift</figcaption>
            </figure>
          </li>
        </ul>
      </div>
      <div className="video_footer">
        <div className="btn_grp">
          <button className="btn voilet">{data?.subjects?.name || ""}</button>
          <button className="btn primary">{data?.category?.name || ""}</button>
        </div>
        <div className="des_end">
          <h5>{data?.title || ""} </h5>
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
      <GiftsListingModal
        open={openGift1}
        setOpen={setOpenGift1}
        onClose={() => setOpenGift1(false)}
        id={data?._id}
      />
    </div>
  );
};
export default Reels;
