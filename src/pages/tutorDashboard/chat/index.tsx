import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { TutorLayout } from "../../../layout/tutorLayout";
import { TextField, Button, IconButton, InputAdornment, Card, Skeleton, CardContent, Box, MenuItem, Menu } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import useAuth from "../../../hooks/useAuth";
import { chatHistory, ChatItem } from "../../../types/General";
import moment from "moment";
import { socket } from "../../../utils/socket";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import {
  useAgreeChatMutation,
  useLazyGetChatHistoryQuery,
  useLazyGetChatListQuery,
  useReportChatMutation,
} from "../../../service/chatApi";
import clsx from "clsx";
import { CHAT_MEDIA, CHAT_REPORT, CHAT_TYPE } from "../../../constants/enums";
import ChooseFileModal from "../../../Modals/ChooseFileModal";
import { showError, showToast } from "../../../constants/toast";
import ReportChatModal from "../../../Modals/ReportChatModal";
import { getFromStorage, setToStorage } from "../../../constants/storage";
import { STORAGE_KEYS } from "../../../constants/storageKeys";
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
  return messages.reduce((groups, message) => {
    const messageDate = moment(message.createdAt).format("YYYY-MM-DD"); // Group by date
    if (!groups[messageDate]) {
      groups[messageDate] = [];
    }
    groups[messageDate].push(message);
    return groups;
  }, {});
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
export default function TutorChat() {
  const navigate = useNavigate(); // hook for the navigation
  const location = useLocation(); // using the useLocation hook to get the location and afterwards the data inside the state
  const { state } = location;
  const user = useAuth();
  const [page, setPage] = useState<number>(1);
  const [historyPage, setHistoryPage] = useState<number>(1);
  const [input, setInput] = useState<string>(""); // input state to store the message
  const [chat, setChat] = useState<ChatItem[]>([]);
  const [history, setHistory] = useState<chatHistory[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [hasMoreHistory, setHasMoreHistory] = useState<boolean>(true);
  const [img, setImg] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [openReport, setOpenReport] = useState<boolean>(false);
  const [reportUser] = useReportChatMutation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);
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


  const handleMenuClose = () => setAnchorEl(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const BlockUser = async () => {
    const body = {
      type: CHAT_REPORT.BLOCK,
      chatId: details?.connectionId,
      parentId: details?.tutorId
    }

    try {
      const res = await reportUser(body).unwrap();
      if (res?.statusCode == 200) {
        showToast("Learner Blocked Successfully");
        handleMenuClose()
        fetchHistory()
      }
    } catch (error: any) {
      showError(error?.data?.message || "Something went wrong")
    }
  }

  const UnblockUser = async () => {
    const body = {
      type: CHAT_REPORT.UNBLOCK,
      chatId: details?.connectionId,
      parentId: details?.tutorId
    }
    try {
      const res = await reportUser(body).unwrap();
      if (res?.statusCode == 200) {
        showToast("Learner Unblocked Successfully");
        handleMenuClose()
        fetchHistory()
      }
    } catch (error: any) {
      showError(error?.data?.message || "Something went wrong")
    }
  }

  const onClose = () => {
    setOpen(false);
  };
  const [details, setDetails] = useState<detailsProp>({
    bookingId: state?.bookingId || "",
    connectionId: state?.connectionId || "",
    name: state?.name || "",
    image: state?.image || "",
    tutorId: state?.tutorId || ""
  });

  const scrollRef = useRef<any>();
  const [status, setStatus] = useState({
    listLoading: false,
    chatHistoryLoading: false,
  });

  const [isActive, setIsActive] = useState(false);
  const handleClick = () => {
    setIsActive(!isActive);
  };

  // API HOOKS
  const [getChatList] = useLazyGetChatListQuery();
  const [getChatHistory] = useLazyGetChatHistoryQuery();

  // function to implement data fetching
  const fetchChatList = async () => {
    try {
      setStatus((prev) => ({
        ...prev,
        listLoading: true,
      }));
      const res = await getChatList({ page: page }).unwrap();
      if (res?.statusCode === 200) {
        setHasMore(res?.data?.chat?.length > 0);

        setChat((prev) =>
          page === 1 ? res?.data?.chat : [...prev, ...res?.data?.chat]
        );
      }
    } catch (error: any) {
      //      console.log(error);
    } finally {
      setStatus((prev) => ({
        ...prev,
        listLoading: false,
      }));
    }
  };

  const fetchHistory = async () => {
    try {
      setStatus((prev) => ({
        ...prev,
        chatHistoryLoading: true,
      }));
      const res = await getChatHistory({
        page: historyPage,
        connectionId: details?.connectionId || "",
      }).unwrap();
      if (res?.statusCode === 200) {
        setAgree(res?.data?.chatAgree?.tutor);
        const arr = [...res?.data?.message]?.reverse();
        setHasMoreHistory(res?.data?.message?.length > 0);
        setHistory((prev) => (historyPage === 1 ? arr : [...arr, ...prev]));
      }
    } catch (error: any) {
      //      console.log(error);
    } finally {
      setStatus((prev) => ({
        ...prev,
        chatHistoryLoading: false,
      }));
    }
  };

  // room joining
  const joinRoom = () => {
    socket.emit("joinRoom", {

      type: state?.type || CHAT_TYPE.NORMAL,
      ...(state?.bookingId ? { bookingId: state?.bookingId } : {}),
      ...(details?.connectionId ? { connectionId: details?.connectionId } : {}),
      parentId: details?.tutorId || state?.tutorId,
      tutorId: user?._id
    });
  };

  // sending message
  const sendMessage = async () => {
    if (!input) {
      return;
    }
    let body = {

      type: state?.type || CHAT_TYPE.NORMAL,
      ...(state?.bookingId ? { bookingId: state?.bookingId } : {}),
      ...(state?.connectionId || details?.connectionId
        ? { connectionId: state?.connectionId || details?.connectionId }
        : {}),
      sentBy: user?.secondaryRole,
      message: input,
      tuturId: user?._id,
      parentId: details?.tutorId || state?.tutorId,
      uploadType: CHAT_MEDIA.TEXT,
    };
    console.log(body, 'body');

    socket.emit("send_message_user", body);
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    setInput("");
  };

  const sendImage = (img: string, type: string) => {
    if (!img) {
      return;
    }
    try {
      let data = {
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
      setOpen(false)
    } catch (error) {
      console.log("Error sending message:", error);
    }
  };

  useEffect(() => {
    // if (details?.bookingId) {
    joinRoom();
    // }
  }, [details?.bookingId, details?.connectionId]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (value) => {
        if (value[0].isIntersecting) {
          if (last) {
            observer.unobserve(last);
            setPage((page) => page + 1); // Increment page to load more data
          }
        }
      },
      { threshold: 0.5 }
    );

    const last = document.querySelector(".chat_single:last-child"); // Get last property box element
    if (last) {
      observer.observe(last); // Observe last property box for visibility
    }

    return () => {
      if (last) {
        observer.unobserve(last); // Clean up observer
      }
      observer.disconnect(); // Disconnect observer
    };
  }, [hasMore, chat]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (value) => {
        if (value[0].isIntersecting) {
          if (last) {
            observer.unobserve(last);
            setHistoryPage((page) => page + 1); // Increment page to load more data
          }
        }
      },
      { threshold: 0.5 }
    );

    const last = document.querySelector(".msg_body:first-child"); // Get last property box element
    if (last) {
      observer.observe(last); // Observe last property box for visibility
    }

    return () => {
      if (last) {
        observer.unobserve(last); // Clean up observer
      }
      observer.disconnect(); // Disconnect observer
    };
  }, [hasMoreHistory, history]);

  useEffect(() => {
    if (!hasMore) return;
    fetchChatList();
  }, [page]);

  useEffect(() => {
    if (!socket?.connected) {
      joinRoom();
    }
    socket?.on("connect", () => {
      joinRoom();
    });
    socket?.on("joinRoomOk", (value: any) => {
      console.log(value, "event is here");
      setDetails((prev) => ({ ...prev, connectionId: value?.data?.connectionId }))
    });
    socket?.on("send_message_Ok", (message: any) => {
      console.log(message, 'message in send');

      setHistory((prevMessages) => [...prevMessages, message?.data]);
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    });

    socket?.on('messageReadReceipt', (data: any) => {
      setHistory(prev => [
        ...prev?.map(item => ({
          ...item,
          isParentRead: true,
        })),
      ]);

    });
    socket?.on('readMessage', (data: any) => {
      setHistory(prev => [
        ...prev?.map(item => ({
          ...item,
          isParentRead: true,
        })),
      ]);

    });

    return () => {
      // Clean up socket listeners
      socket?.off("connect");
      socket?.off("joinRoomOk");
      socket?.off("send_message_Ok");
    };
  }, [socket]);

  useEffect(() => {
    if (!details?.connectionId) return;
    if (!hasMoreHistory) return;
    fetchHistory();
  }, [details?.connectionId, historyPage]);

  useEffect(() => {
    if ((scrollRef.current && historyPage === 1) || historyPage === 2) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, historyPage]);

  const groupMessage = groupMessagesByDate(history);
  return (
    <>
      <TutorLayout className="role-layout">
        <Loader isLoad={loading} />
        <main className="content">
          <section className="uhb_spc tChat_sc">
            <div className="conta_iner v2">
              <div className="role_head">
                <button
                  className="back_arrow"
                  onClick={() => navigate("/tutor/dashboard")}
                >
                  <img src={`/static/images/back.png`} alt="Back" />
                </button>
                <h1 className="hd_3">Chat</h1>
              </div>
              <div className="role_body">
                <div className="chat_sc gap_m">
                  <div className={isActive ? "lt_s hide" : "lt_s"}>
                    {/* <div className="search_bar">
                      <div className="control_group">
                        <TextField
                          fullWidth
                          hiddenLabel
                          placeholder="Search messages"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="end">
                                <img
                                  src={"/static/images/search_icon.svg"}
                                  alt="Icon"
                                />
                              </InputAdornment>
                            ),
                          }}
                        ></TextField>
                      </div>
                    </div> */}
                    {status.listLoading &&
                      Array.from(new Array(4)).map((item, index) => (
                        <ChatListSkeletom key={index} />
                      ))}

                    {chat?.length && !status.listLoading ? (
                      chat?.map((item, index) => (
                        <div
                          key={item?._id}
                          className="chat_single"
                          onClick={() => {
                            handleClick();
                            setDetails(() => ({
                              bookingId: item?.bookingId,
                              connectionId: item?._id,
                              name: item?.parentId?.name,
                              image: item?.parentId?.image,
                              tutorId: item?.parentId?._id
                            }));
                            setHasMoreHistory(true)
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
                                item?.parentId?.image
                                  ? item?.parentId?.image
                                  : "/static/images/parent_attachement.png"
                              }
                              alt="User"
                            />
                          </figure>
                          <div className="c_info">
                            <p>
                              <strong>{item?.parentId?.name || ""}</strong>
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
                      <div className="no_data">
                        <figure>
                          <img src="/static/images/noData.png" alt="no data found" />
                        </figure>
                        <p>No Chats found</p>
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
                            <strong>{details?.name || ""}</strong>
                            {/* <span>Started the Job</span> */}
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
                              <MenuItem onClick={() => { handleMenuClose(); setOpenReport(true) }}>Report</MenuItem>
                              {history?.[0]?.isParentBlocked == false ?
                                (
                                  <MenuItem onClick={BlockUser}>Block</MenuItem>
                                ) : (
                                  <MenuItem onClick={UnblockUser}>Unblock</MenuItem>
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
                              {/* Render the date marker */}
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
                                      recieved: user?.secondaryRole !== item?.sentBy,
                                      sended: user?.secondaryRole === item?.sentBy,
                                    })}
                                  >
                                    {item?.uploadType == CHAT_MEDIA.TEXT ? (
                                      <div className="msg_body">
                                        <span>
                                          {moment(item.createdAt).format("LT")}
                                          {user?.secondaryRole === item?.sentBy ? (

                                            <img style={{ marginLeft: "2px" }} width={18} src={item?.isParentRead ? '/static/images/read.png' : '/static/images/unread.png'} alt='' />
                                          ) : null}
                                        </span>
                                        <p>{item.message}</p>
                                      </div>
                                    ) : item?.uploadType == CHAT_MEDIA.IMAGE ? (
                                      <div className="msg_body">
                                        <span>
                                          {moment(item.createdAt).format("LT")}
                                          {user?.secondaryRole === item?.sentBy ? (

                                            <img style={{ marginLeft: "2px" }} width={18} src={item?.isParentRead ? '/static/images/read.png' : '/static/images/unread.png'} alt='' />
                                          ) : null}                                        </span>
                                        {item?.uploads?.map((image: string, index: number) =>
                                          image ? (
                                            <img
                                              key={index}
                                               onClick={() => {
                                                  setImg(image);
                                                  setOpenImage(true);
                                                }}
                                              src={image}
                                              alt="uploaded"
                                              style={{ maxWidth: "200px", borderRadius: "8px" }}
                                            />
                                          ) : null
                                        )}
                                      </div>
                                    ) :
                                      item?.uploadType == CHAT_MEDIA.DOC ? (
                                        <div className="msg_body">
                                          <span>
                                            {moment(item.createdAt).format("LT")}
                                            {user?.secondaryRole === item?.sentBy ? (

                                              <img style={{ marginLeft: "2px" }} width={18} src={item?.isParentRead ? '/static/images/read.png' : '/static/images/unread.png'} alt='' />
                                            ) : null}                                          </span>
                                          <iframe
                                            src={`https://docs.google.com/gview?url=${encodeURIComponent(item?.uploads?.[0])}&embedded=true`}
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
                          {history?.[0]?.isParentBlocked == true ? (
                            <div style={{ fontWeight: '600' }}>
                              You Have Blocked This Learner.
                            </div>
                          ) : history?.[0]?.isTutorBlocked == true ? (
                            <div style={{ fontWeight: '600' }}>
                              You Have Been Blocked By This Learner.
                            </div>
                          ) : (
                            <div className="control_group">
                              <TextField
                                hiddenLabel
                                value={input}
                                placeholder={agree ? "Type a message..." : 'Please acknowledge safety warning'}
                                fullWidth
                                disabled={!agree}
                                onChange={(e) => {
                                  if (isValidInput(e.target.value))
                                    setInput(e.target.value)
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
                        <p>Please Select user to chat</p>
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
          parentId={details?.tutorId}

        />
        <ImageViewModal
          open={openImage}
          onClose={() => setOpenImage(false)}
          setOpen={setOpenImage}
          image={img}
        />
      </TutorLayout>
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