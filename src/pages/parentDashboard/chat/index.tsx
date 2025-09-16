import React, { useEffect, useRef, useState } from "react";
import { ParentLayout } from "../../../layout/parentLayout";
import { useLocation, useNavigate } from "react-router-dom";
import {
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Card,
  Skeleton,
  CardContent,
  Box,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { socket } from "../../../utils/socket";
import {
  useAgreeChatMutation,
  useLazyGetChatHistoryQuery,
  useLazyGetChatListQuery,
  useReportChatMutation,
} from "../../../service/chatApi";
import moment from "moment";
import { chatHistory, ChatItem } from "../../../types/General";
import useAuth from "../../../hooks/useAuth";
import clsx from "clsx";
import {
  CHAT_MEDIA,
  CHAT_REPORT,
  CHAT_TYPE,
  UPVOTE_ROLE,
} from "../../../constants/enums";
import ChooseFileModal from "../../../Modals/ChooseFileModal";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { showError, showToast } from "../../../constants/toast";
import ReportChatModal from "../../../Modals/ReportChatModal";
import Loader from "../../../constants/Loader";
import { isValidInput } from "../../../utils/validations";
import ImageViewModal from "../../../Modals/ImageViewModal";

type detailsProp = {
  bookingId: string;
  connectionId: string;
  name: string;
  image: string;
  tutorId: string;
};

const groupMessagesByDate = (messages: any[]) => {
  return messages.reduce(
    (groups, message) => {
      const messageDate = moment(message.createdAt).format("YYYY-MM-DD");
      if (!groups[messageDate]) {
        groups[messageDate] = [];
      }
      groups[messageDate].push(message);
      return groups;
    },
    {} as Record<string, any[]>
  );
};

const renderDateMarker = (date: string) => {
  const today = moment().startOf("day");
  const messageDate = moment(date);

  if (messageDate.isSame(today, "day")) {
    return "Today";
  } else if (messageDate.isSame(today.clone().subtract(1, "days"), "day")) {
    return "Yesterday";
  } else {
    return messageDate.format("MMMM D, YYYY");
  }
};

export default function ParentChat() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const user = useAuth();

  // STATES
  const [page, setPage] = useState<number>(1);
  const [historyPage, setHistoryPage] = useState<number>(1);
  const [isActive, setIsActive] = useState(false);
  const [input, setInput] = useState<string>("");
  const [chat, setChat] = useState<ChatItem[]>([]);
  const [history, setHistory] = useState<chatHistory[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [hasMoreHistory, setHasMoreHistory] = useState<boolean>(true);
  const [img, setImg] = useState<string>("");
  const [reportUser] = useReportChatMutation();
  const [openReport, setOpenReport] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [openImage, setOpenImage] = useState<boolean>(false);
  const [agreeChat] = useAgreeChatMutation();
  const [agree, setAgree] = useState<boolean>(false);

  const UnderstandHandle = async () => {
    const body = {
      chatId: details?.connectionId,
    };
    try {
      const res = await agreeChat(body).unwrap();
      if (res?.statusCode == 200) {
        fetchHistory();
      }
    } catch (error: any) {
      showError(error?.data?.message || "Something went wrong");
    }
  };

  const BlockUser = async () => {
    const body = {
      type: CHAT_REPORT.BLOCK,
      chatId: details?.connectionId,
      tutorId: details?.tutorId,
    };
    try {
      const res = await reportUser(body).unwrap();
      if (res?.statusCode == 200) {
        showToast("Tutor Blocked Successfully");
        handleMenuClose();
        fetchHistory();
      }
    } catch (error: any) {
      showError(error?.data?.message || "Something went wrong");
    }
  };

  const UnblockUser = async () => {
    const body = {
      type: CHAT_REPORT.UNBLOCK,
      chatId: details?.connectionId,
      tutorId: details?.tutorId,
    };
    try {
      const res = await reportUser(body).unwrap();
      if (res?.statusCode == 200) {
        showToast("Tutor Unblocked Successfully");
        handleMenuClose();
        fetchHistory();
      }
    } catch (error: any) {
      showError(error?.data?.message || "Something went wrong");
    }
  };
  // File-attach modal
  const [open, setOpen] = useState<boolean>(false);
  const onClose = () => setOpen(false);

  const [details, setDetails] = useState<detailsProp>({
    bookingId: state?.bookingId || "",
    connectionId: "",
    name: state?.name || "",
    image: state?.image || "",
    tutorId: state?.tutorId || "",
  });

  const scrollRef = useRef<any>();
  const [status, setStatus] = useState({
    listLoading: false,
    chatHistoryLoading: false,
  });

  // API HOOKS
  const [getChatList] = useLazyGetChatListQuery();
  const [getChatHistory] = useLazyGetChatHistoryQuery();

  // Sidebar toggle
  const handleClick = () => setIsActive((prev) => !prev);

  // ===== Three-dot menu state & handlers (FIX) =====
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => setAnchorEl(null);

  // Fetch chat list
  const fetchChatList = async () => {
    try {
      setStatus((prev) => ({ ...prev, listLoading: true }));
      const res = await getChatList({ page }).unwrap();
      if (res?.statusCode === 200) {
        setHasMore(res?.data?.chat?.length > 0);
        setChat((prev) =>
          page === 1 ? res?.data?.chat : [...prev, ...res?.data?.chat]
        );
      }
    } catch (error) {
      // console.log(error);
    } finally {
      setStatus((prev) => ({ ...prev, listLoading: false }));
    }
  };

  // Fetch history
  const fetchHistory = async () => {
    try {
      setStatus((prev) => ({ ...prev, chatHistoryLoading: true }));
      const res = await getChatHistory({
        page: historyPage,
        connectionId: details?.connectionId || "",
      }).unwrap();

      if (res?.statusCode === 200) {
        setAgree(res?.data?.chatAgree?.parent);
        const arr = [...res?.data?.message]?.reverse();
        setHasMoreHistory(res?.data?.message?.length > 0);
        setHistory((prev) => (historyPage === 1 ? arr : [...arr, ...prev]));
      }
    } catch (error) {
      // console.log(error);
    } finally {
      setStatus((prev) => ({ ...prev, chatHistoryLoading: false }));
    }
  };

  // room joining
  const joinRoom = () => {
    socket.emit("joinRoom", {
      type: state?.type || CHAT_TYPE.NORMAL,
      ...(state?.bookingId ? { bookingId: state?.bookingId } : {}),
      ...(state?.connectionId ? { connectionId: state?.connectionId } : {}),
      parentId: user?._id,
      tutorId: details?.tutorId || state?.tutorId,
    });
  };

  // sending message
  const sendMessage = async () => {
    if (!input) return;

    const body = {
      type: state?.type || CHAT_TYPE.NORMAL,
      ...(state?.bookingId ? { bookingId: state?.bookingId } : {}),
      ...(state?.connectionId || details?.connectionId
        ? { connectionId: state?.connectionId || details?.connectionId }
        : {}),
      sentBy: user?.secondaryRole,
      message: input,
      parentId: user?._id,
      tutorId: details?.tutorId || state?.tutorId,
      uploadType: CHAT_MEDIA.TEXT,
    };

    socket.emit("send_message_user", body);
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    setInput("");
  };

  const sendImage = (img: string[], type: string) => {
    if (!img?.length) return;

    try {
      const data = {
        type: state?.type || CHAT_TYPE.NORMAL,
        ...(state?.bookingId ? { bookingId: state?.bookingId } : {}),
        ...(state?.connectionId || details?.connectionId
          ? { connectionId: state?.connectionId || details?.connectionId }
          : {}),
        sentBy: user?.secondaryRole,
        uploads: img,
        parentId: user?._id,
        tutorId: details?.tutorId || state?.tutorId,
        uploadType: type,
      };

      socket.emit("send_message_user", data);
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
      setImg("");
      setOpen(false);
    } catch (error) {
      console.log("Error sending message:", error);
    }
  };

  useEffect(() => {
    joinRoom();
  }, [details?.bookingId, details?.connectionId]); // eslint-disable-line

  // Infinite scroll for chat list
  useEffect(() => {
    const observer = new IntersectionObserver(
      (value) => {
        if (value[0].isIntersecting) {
          if (last) {
            observer.unobserve(last);
            setPage((page) => page + 1);
          }
        }
      },
      { threshold: 0.5 }
    );

    const last = document.querySelector(".chat_single:last-child");
    if (last) observer.observe(last);

    return () => {
      if (last) observer.unobserve(last);
      observer.disconnect();
    };
  }, [hasMore, chat]);

  // Infinite scroll for history (top)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (value) => {
        if (value[0].isIntersecting) {
          if (last) {
            observer.unobserve(last);
            setHistoryPage((page) => page + 1);
          }
        }
      },
      { threshold: 0.5 }
    );

    const last = document.querySelector(".msg_body:first-child");
    if (last) observer.observe(last);

    return () => {
      if (last) observer.unobserve(last);
      observer.disconnect();
    };
  }, [hasMoreHistory, history]);

  useEffect(() => {
    if (!hasMore) return;
    fetchChatList();
  }, [page]); // eslint-disable-line

  useEffect(() => {
    if (!socket?.connected) {
      joinRoom();
    }
    socket?.on("connect", () => {
      joinRoom();
    });
    socket?.on("joinRoomOk", (value: any) => {
      setDetails((prev) => ({
        ...prev,
        connectionId: value?.data?.connectionId,
      }));
    });
    socket?.on("send_message_Ok", (message: any) => {
      setHistory((prevMessages) => [...prevMessages, message?.data]);
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    });

    socket?.on("messageReadReceipt", (data: any) => {
      setHistory((prev) => [
        ...prev?.map((item) => ({
          ...item,
          isTutorRead: true,
        })),
      ]);
    });
    socket?.on("readMessage", (data: any) => {
      setHistory((prev) => [
        ...prev?.map((item) => ({
          ...item,
          isTutorRead: true,
        })),
      ]);
    });

    return () => {
      socket?.off("connect");
      socket?.off("joinRoomOk");
      socket?.off("send_message_Ok");
    };
  }, [socket]); // eslint-disable-line

  useEffect(() => {
    if (!details?.connectionId) return;
    if (!hasMoreHistory) return;
    fetchHistory();
  }, [details?.connectionId, historyPage]); // eslint-disable-line

  useEffect(() => {
    if ((scrollRef.current && historyPage === 1) || historyPage === 2) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, historyPage]);

  const groupMessage = groupMessagesByDate(history);

  return (
    <>
      <ParentLayout className="role-layout">
        <Loader isLoad={loading} />
        <main className="content">
          <section className="uhb_spc pChat_sc">
            <div className="conta_iner v2">
              <div className="role_head">
                <button
                  className="back_arrow"
                  onClick={() => navigate("/parent/search-result")}
                >
                  <img src={`/static/images/back.png`} alt="Back" />
                </button>
                <h1 className="hd_3">Chat</h1>
              </div>
              <div className="role_body">
                <div className="chat_sc gap_m">
                  <div className={isActive ? "lt_s hide" : "lt_s"}>
                    {status.listLoading &&
                      Array.from(new Array(4)).map((_, index) => (
                        <ChatListSkeletom key={index} />
                      ))}

                    {chat?.length && !status.listLoading ? (
                      chat?.map((item) => (
                        <div
                          key={item?._id}
                          className="chat_single"
                          onClick={() => {
                            handleClick();
                            setDetails(() => ({
                              bookingId: item?.bookingId,
                              connectionId: item?._id,
                              name: item?.tutorId?.name,
                              image: item?.tutorId?.image,
                              tutorId: item?.tutorId?._id,
                            }));
                            setHasMoreHistory(true);
                            setHistoryPage(1);
                            const updatedChats = chat.map((c) =>
                              c._id === item._id ? { ...c, unreadCount: 0 } : c
                            );
                            setChat(updatedChats);
                          }}
                        >
                          <figure>
                            <img
                              src={
                                item?.tutorId?.image
                                  ? item?.tutorId?.image
                                  : "/static/images/parent_attachement.png"
                              }
                              alt="User"
                            />
                          </figure>
                          <div className="c_info">
                            <p>
                              <strong>{item?.tutorId?.name || ""}</strong>
                              <span className="time">
                                {moment(item?.createdAt).fromNow()}
                              </span>
                            </p>
                            <div className="count_div">
                              <p>{item?.message || ""}</p>
                              {item?.unreadCount ? (
                                <span className="count">
                                  {item?.unreadCount}
                                </span>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : status.listLoading ? null : (
                      <div>
                        <p>No chats found</p>
                      </div>
                    )}
                  </div>

                  <div className={isActive ? "rt_s active" : "rt_s"}>
                    {details?.connectionId ? (
                      <div className="chat_box" ref={scrollRef}>
                        <div className="chat_head">
                          <IconButton
                            className="roundIcon_btn"
                            onClick={handleClick}
                          >
                            <ArrowBackIcon />
                          </IconButton>
                          <figure>
                            <img
                              src={
                                details?.image ||
                                "/static/images/parent_attachement.png"
                              }
                              alt="User"
                            />
                          </figure>
                          <h2>
                            <strong>
                              {details?.name || ""}
                              <span className="d_block">
                                {history?.[0]?.tutorId?.documentVerification
                                  ? "Verified Tutor"
                                  : "Unverified Tutor"}
                              </span>
                            </strong>
                          </h2>

                          {/* Three-dot menu (fixed) */}
                          <div className="chat_option">
                            <IconButton
                              aria-label="chat options"
                              aria-controls={menuOpen ? "chat-menu" : undefined}
                              aria-haspopup="true"
                              aria-expanded={menuOpen ? "true" : undefined}
                              onClick={handleMenuOpen}
                            >
                              <MoreVertIcon />
                            </IconButton>

                            <Menu
                              id="chat-menu"
                              anchorEl={anchorEl}
                              open={menuOpen}
                              onClose={handleMenuClose}
                              anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "right",
                              }}
                              transformOrigin={{
                                vertical: "top",
                                horizontal: "right",
                              }}
                            >
                              <MenuItem
                                onClick={() => {
                                  handleMenuClose();
                                  setOpenReport(true);
                                }}
                              >
                                Report
                              </MenuItem>
                              {history?.[0]?.isTutorBlocked == false ? (
                                <MenuItem onClick={BlockUser}>Block</MenuItem>
                              ) : (
                                <MenuItem onClick={UnblockUser}>
                                  Unblock
                                </MenuItem>
                              )}
                            </Menu>
                          </div>
                        </div>

                        <div className="chat_body">
                          {agree ? null : (
                            <div className="chat_agree">
                              <div className="icon-row">
                                <div className="text-wrapper">
                                  <p className="warning-text">
                                    ⚠️ This chat is monitored for your safety.
                                    Avoid transactions outside TutorHail to
                                    prevent scams. Avoid sharing any sensitive
                                    information here. Review our Terms &
                                    Conditions. Use Report or Block & Report for
                                    any inappropriate behavior.
                                  </p>
                                </div>
                              </div>
                              <div className="btn_div">
                                <button
                                  className="btn"
                                  onClick={UnderstandHandle}
                                >
                                  I Understand
                                </button>
                              </div>
                            </div>
                          )}

                          {Object.keys(groupMessage).map((date) => (
                            <div key={date}>
                              <div className="msg_container">
                                <span id="msg_day" className="msg_day">
                                  {renderDateMarker(date)}
                                </span>
                              </div>

                              {groupMessage[date].map(
                                (item: any, index: any) => (
                                  <div
                                    key={index}
                                    className={clsx("single_message", {
                                      recieved:
                                        user?.secondaryRole !== item?.sentBy,
                                      sended:
                                        user?.secondaryRole === item?.sentBy,
                                    })}
                                  >
                                    {item?.uploadType === CHAT_MEDIA.TEXT ? (
                                      <div className="msg_body">
                                        <span>
                                          {moment(item.createdAt).format("LT")}

                                          {user?.secondaryRole ===
                                          item?.sentBy ? (
                                            <img
                                              style={{ marginLeft: "2px" }}
                                              width={18}
                                              src={
                                                item?.isTutorRead
                                                  ? "/static/images/read.png"
                                                  : "/static/images/unread.png"
                                              }
                                              alt=""
                                            />
                                          ) : null}
                                        </span>
                                        <p>{item.message}</p>
                                      </div>
                                    ) : item?.uploadType ===
                                      CHAT_MEDIA.IMAGE ? (
                                      <div className="msg_body">
                                        <span>
                                          {moment(item.createdAt).format("LT")}
                                          {user?.secondaryRole ===
                                          item?.sentBy ? (
                                            <img
                                              style={{ marginLeft: "2px" }}
                                              width={18}
                                              src={
                                                item?.isTutorRead
                                                  ? "/static/images/read.png"
                                                  : "/static/images/unread.png"
                                              }
                                              alt=""
                                            />
                                          ) : null}
                                        </span>
                                        {item?.uploads?.map(
                                          (image: string, index: number) =>
                                            image ? (
                                              <img
                                                onClick={() => {
                                                  setImg(image);
                                                  setOpenImage(true);
                                                }}
                                                key={index}
                                                src={image}
                                                alt="uploaded"
                                                style={{
                                                  maxWidth: "200px",
                                                  borderRadius: "8px",
                                                }}
                                              />
                                            ) : null
                                        )}
                                      </div>
                                    ) : item?.uploadType === CHAT_MEDIA.DOC ? (
                                      <div className="msg_body">
                                        <span>
                                          {moment(item.createdAt).format("LT")}
                                          {user?.secondaryRole ===
                                          item?.sentBy ? (
                                            <img
                                              style={{ marginLeft: "2px" }}
                                              width={18}
                                              src={
                                                item?.isTutorRead
                                                  ? "/static/images/read.png"
                                                  : "/static/images/unread.png"
                                              }
                                              alt=""
                                            />
                                          ) : null}
                                        </span>
                                        <iframe
                                          src={`https://docs.google.com/gview?url=${encodeURIComponent(
                                            item?.uploads?.[0]
                                          )}&embedded=true`}
                                          style={{
                                            width: "100%",
                                            height: "200px",
                                            border: "1px solid #e0e0e0",
                                            borderRadius: "4px",
                                          }}
                                          title={"PDF Document"}
                                        />
                                      </div>
                                    ) : null}
                                  </div>
                                )
                              )}
                            </div>
                          ))}
                        </div>

                        <div className="chat_foot">
                          {history?.[0]?.isTutorBlocked == true ? (
                            <div style={{ fontWeight: "600" }}>
                              You Have Blocked This Tutor.
                            </div>
                          ) : history?.[0]?.isParentBlocked == true ? (
                            <div style={{ fontWeight: "600" }}>
                              You Have Been Blocked By This Tutor.
                            </div>
                          ) : (
                            <div className="control_group">
                              <TextField
                                hiddenLabel
                                value={input}
                                placeholder={agree ? "Type a message...":'Please acknowledge safety warning'}
                                fullWidth
                                disabled={!agree}
                                onChange={(e) => {
                                  if (isValidInput(e.target.value))
                                    setInput(e.target.value);
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    sendMessage();
                                  }
                                }}
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <IconButton onClick={() => setOpen(true)}>
                                        <img
                                          src={"/static/images/attachFile.png"}
                                          alt="Icon"
                                        />
                                      </IconButton>
                                    </InputAdornment>
                                  ),
                                }}
                              />
                              <Button onClick={sendMessage}>
                                <img
                                  src={"/static/images/export_icon.svg"}
                                  alt="Icon"
                                />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="no-chat-container">
                        <figure>
                          <img src="/static/images/user.png" alt="" />
                        </figure>
                        <p>Select user to chat</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <ChooseFileModal
          img={img}
          setImg={setImg}
          open={open}
          setOpen={setOpen}
          onClose={onClose}
          sendImage={sendImage}
          setLoading={setLoading}
        />
        <ReportChatModal
          open={openReport}
          onClose={() => setOpenReport(false)}
          setOpen={setOpenReport}
          chatId={details?.connectionId}
          tutorId={details?.tutorId}
        />
        <ImageViewModal
          open={openImage}
          onClose={() => setOpenImage(false)}
          setOpen={setOpenImage}
          image={img}
        />
      </ParentLayout>
    </>
  );
}

const ChatListSkeletom = () => {
  return (
    <Card
      style={{
        display: "flex",
        alignItems: "center",
        padding: "5px",
        marginBottom: "10px",
        maxHeight: "84px",
      }}
    >
      <Skeleton variant="circular" width={40} height={40} />
      <CardContent style={{ flex: 1 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="start"
          flexDirection={"column"}
        >
          <Skeleton variant="text" width="40%" height={30} />
          <Skeleton variant="text" width="60%" height={20} />
        </Box>
      </CardContent>
    </Card>
  );
};
