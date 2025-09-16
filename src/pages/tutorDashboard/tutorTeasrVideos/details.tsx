import { useNavigate, useParams } from "react-router-dom";
import { AddFormAndDisscussion } from "../../../Modals/AddFormAndDisscussion";
import {
  useCommentEngagementMutation,
  useCommentsQuery,
  useDeleteContentMutation,
  useEngagementMutation,
  useGetContentByIdQuery,
  useGetContentQuery,
} from "../../../service/content";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Loader from "../../../constants/Loader";
import { TutorLayout } from "../../../layout/tutorLayout";
import NewSideBarTutor from "../../../components/NewSideBarTutor";
import { RWebShare } from "react-web-share";
import { showError, showToast } from "../../../constants/toast";
import { CommentEngagements, Engagements } from "../../../constants/enums";
import { useRef, useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import moment from "moment";
import { isValidInput } from "../../../utils/validations";
import { REDIRECTLINK } from "../../../constants/url";
import GiftsListingModal from "../../../Modals/GiftsListingModal";

type Reply = {
  text: string;
  isReply: boolean;
  userName: string;
  id: string;
};

export const TeaserVideoDetailsTutor = () => {
  const { id } = useParams();
  const [showComments, setShowComments] = useState(false);
  const [updateEngagement] = useEngagementMutation({});
  const navigate = useNavigate();
  const [replyHandleApi] = useCommentEngagementMutation();
  const [newComment, setNewComment] = useState("");
  const [openGift1, setOpenGift1] = useState<boolean>(false);

  const [deleteContent] = useDeleteContentMutation();
  const [expandedReplies, setExpandedReplies] = useState<string[]>([]);

  const { data: ForumData, isLoading } = useGetContentByIdQuery({
    id: id,
  });
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
  const deleteForum = async () => {
    try {
      const res = await deleteContent({ id: id }).unwrap();
      if (res?.statusCode === 200) {
        showToast("Teaser video deleted Successfully");
        navigate("/tutor/TutorTeaserVideos");
      }
    } catch (error: any) {
      showError(error?.data?.message);
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
  return (
    <TutorLayout className="role-layout">
      <Loader isLoad={isLoading} />
      <main className="content">
        <section className="uh_spc pSearchResult_sc home_wrp teaser_video_prf">
          <div className="conta_iner v2">
            <div className="mn_fdx">
              <NewSideBarTutor />
              <div className="mdl_cntnt">
                <div className="thoughts">
                  <figure className="ts_video">
                    <video
                      src={
                        ForumData?.data?.images?.[0] ||
                        "/static/videos/sample.mp4"
                      }
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      controls
                    />
                  </figure>
                  <div>
                    <div className="options">
                      <EditIcon
                        onClick={() =>
                          navigate("/tutor/TutorTeaserVideos", {
                            state: { edit: true, data: ForumData?.data },
                          })
                        }
                      />
                      <DeleteIcon onClick={() => deleteForum()} />
                      <RWebShare
                        data={{
                          text: "Click on link to see the teaser video details",
                          url: `${REDIRECTLINK}tutor/teaserVideos/${ForumData?.data?._id}`,
                          title: ForumData?.data?.title || "",
                        }}
                      >
                        <img
                          src={`/static/images/share.png`}
                          alt="png"
                          width={"35px"}
                        />
                      </RWebShare>
                    </div>
                  </div>
                  <h2 className="sub_title">{ForumData?.data?.title || ""}</h2>
                  <ul className="like">
                    <li
                      className="like_li"
                      onClick={() => handleEngagement(Engagements.LIKE)}
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
                    <li onClick={() => setShowComments(true)}>
                      {ForumData?.data?.commentCount || 0} Comments
                    </li>
                    <li  onClick={()=>setOpenGift1(true)}>Gifts</li>
                  </ul>
                  <div className="profile_row">
                    <figure>
                      <img
                        src={
                          ForumData?.data?.user?.image ||
                          `/static/images/emili.png`
                        }
                        alt="png"
                      />
                    </figure>
                    <h4>
                      {ForumData?.data?.user?.name || "Amelia Bell"}
                      <span>
                        {ForumData?.data?.user?.followers || 0}Followers
                      </span>
                    </h4>
                  </div>

                  <ul className="context_list">
                    <li>
                      <p>
                        Subject{" "}
                        <span>{ForumData?.data?.subjects?.name || ""}</span>
                      </p>
                    </li>
                    <li>
                      <p>
                        Topic <span>{ForumData?.data?.topic || ""}</span>{" "}
                      </p>
                    </li>
                    <li>
                      <p>
                        Grade <span>Primary</span>
                      </p>
                    </li>
                  </ul>

                  <div className="des_C">
                    <h2>Objective</h2>
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
                <section className="side_menu_wrap  page_link">
                  <ul>
                    <li>
                      <a>About Us</a>
                    </li>
                    <li>
                      <a>Contact Us</a>
                    </li>
                    <li>
                      <a>Help Center</a>
                    </li>
                    <li>
                      <a>Terms & conditions</a>
                    </li>
                    <li>
                      <a>Privacy Policy</a>
                    </li>
                    <li>
                      <a>FAQ’s</a>
                    </li>
                  </ul>
                </section>
              </div>
            </div>
          </div>
        </section>
          <GiftsListingModal
                open={openGift1}
                setOpen={setOpenGift1}
                onClose={() => setOpenGift1(false)}
                id={ForumData?.data?._id}
              />
      </main>
    </TutorLayout>
  );
};
