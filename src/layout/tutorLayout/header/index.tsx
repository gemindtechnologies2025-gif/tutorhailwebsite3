/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import {
  ClickAwayListener,
  Menu,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import {
  useLazyGetUserQuery,
} from "../../../service/auth";
import { useAppDispatch, useAppSelector } from "../../../hooks/store";
import {
  getFromStorage,
  setToStorage,
} from "../../../constants/storage";
import { STORAGE_KEYS } from "../../../constants/storageKeys";
import {
  getToken,
  role,
  setCredentials,
} from "../../../reducers/authSlice";
import { showError, showToast } from "../../../constants/toast";
import useAuth from "../../../hooks/useAuth";
import LogoutModal from "../../../Modals/logout";
import { useLazyGetNotificationsQuery } from "../../../service/tutorApi";
import { useChatNotCountQuery } from "../../../service/chatApi";
import { socket } from "../../../utils/socket";
import BookingAlertModal from "../../../Modals/BookingAlertModal";
import { PUSH_TYPE_KEYS } from "../../../constants/enums";
import moment from "moment";
import MenuOpenIcon from '@mui/icons-material/MenuOpen';

const TutorHeader = () => {
  const navigate = useNavigate();
  const [NotCount, setNotCount] = useState(Number(getFromStorage(STORAGE_KEYS.NOTIFICATION_COUNT) || 0));
  const [ChatCount, setChatCount] = useState(Number(getFromStorage(STORAGE_KEYS.CHAT_COUNT) || 0));
  const tokenFromRed = useAppSelector(getToken);
  const [coTutorModal, setCoTutorModal] = useState<boolean>(false)
  const token = getFromStorage(STORAGE_KEYS.token);
  const roleName = getFromStorage(STORAGE_KEYS.roleName);
  const [getNotifications] = useLazyGetNotificationsQuery();
  const [notifications, setNotifcations] = useState<any>([]);
  const userDetails = useAuth();
  const dispatch = useAppDispatch();
  const [getProfile] = useLazyGetUserQuery();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open1 = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement> | any) => {
    setAnchorEl(event.currentTarget);
  };
  const [data, setData] = useState<any>();
  // const { data: countData, isLoading, isSuccess } = useChatNotCountQuery({}, { skip: !token });

  const [openMenu1, setOpenMenu1] = useState(false);
  const toggleMenu = () => setOpenMenu1(!openMenu1);

  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);

  // Notification menu
  const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };
  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick3 = (e: React.MouseEvent<HTMLElement>) => {
    // Toggle open/close on figure click
    if (anchorEl) {
      handleClose();
    } else {
      setAnchorEl(e.currentTarget);
    }
  };
  const handleClose3 = () => {
    setAnchorEl(null);
  };
  const setRole = () => {
    dispatch(role({ roleName: "tutor" }));
  };
  const [openLog, setOpenLog] = useState<boolean>(false);
  const handleCloseLog = () => {
    setOpenLog(false);
  };

  const [notiType, setNotiType] = React.useState("0");
  const handleChange = (event: SelectChangeEvent) => {
    setNotiType(event.target.value as string);
  };

  const fetchUser = async () => {
    try {
      const res = await getProfile({}).unwrap();
      if (res?.statusCode === 200) {
        setNotCount(res?.data?.notificationUnreadCount || 0);
        setToStorage(STORAGE_KEYS.NOTIFICATION_COUNT, res?.data?.notificationUnreadCount)
        setChatCount(res?.data?.chatUnreadCount || 0);
        setToStorage(STORAGE_KEYS.CHAT_COUNT, res?.data?.chatUnreadCount)
        dispatch(
          setCredentials({
            user: res?.data || null,
            token: token || null,
          })
        );
      }
    } catch (error: any) {
      showError(error?.data?.message);
    }
  };

  useEffect(() => {
    if (window) {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, []);

  useEffect(() => {
    if (tokenFromRed && roleName === "tutor") {
      fetchUser();
    }
  }, []);

  useEffect(() => {
    setRole();
  }, []);




  const handleNavigate = (item: any) => {
    if (item?.pushType === PUSH_TYPE_KEYS.REVERT_COMPLAINT || item?.pushType === PUSH_TYPE_KEYS.REVERT_QUERY) {

    } else if (
      (item?.pushType === PUSH_TYPE_KEYS.BOOKING_ACCEPTED ||
        item?.pushType === PUSH_TYPE_KEYS.BOOKING_COMPLETED ||
        item?.pushType === PUSH_TYPE_KEYS.BOOKING_CANCELLED ||
        item?.pushType === PUSH_TYPE_KEYS.BOOKING_ADDED ||
        item?.pushType === PUSH_TYPE_KEYS.BOOKING_REJECTED)
    ) {
      navigate(`/tutor/my-bookings`);
    } else if (
      item?.pushType === PUSH_TYPE_KEYS.CLASS_BOOKED
    ) {
      navigate(`/tutor/my-bookings`);
    } else if (
      item?.pushType === PUSH_TYPE_KEYS.MESSAGE_SENT
    ) {
      navigate('/tutor/chat');
    } else if (
      (item?.pushType === PUSH_TYPE_KEYS.WITHDRAWL_REQUEST ||
        item?.pushType === PUSH_TYPE_KEYS.WITHDRAW_ACCEPTED ||
        item?.pushType === PUSH_TYPE_KEYS.WITHDRAW_REJECTED)
    ) {
      navigate('/tutor/manage-earnings');
    } else if (
      item?.pushType === PUSH_TYPE_KEYS.PARENT_CALL_JOINED
    ) {

      navigate(`/zoom-call/${item?.bookingDetailId}?type=tutor`, {
        state: {
          data: {
            sessionName: item?.bookingDetailId,
            displayName: 'user',
            roleType: "0",
            sessionIdleTimeoutMins: 60,
          }
        }
      })

    } else if (
      item?.pushType === PUSH_TYPE_KEYS.TUTOR_CALL_JOINED

    ) {

    } else if (item?.pushType === PUSH_TYPE_KEYS.FOLLOW) {
      navigate('/tutor/manage-followers');
    } else if (
      item?.pushType === PUSH_TYPE_KEYS.LIKE_SHORT_VIDEO ||
      item?.pushType === PUSH_TYPE_KEYS.COMMENT_SHORT_VIDEO ||
      item?.pushType === PUSH_TYPE_KEYS.SHORT_VIDEO) {
      navigate('/tutor/TutorShortVideos');
    } else if (
      item?.pushType === PUSH_TYPE_KEYS.LIKE_TEASER ||
      item?.pushType === PUSH_TYPE_KEYS.COMMENT_TEASER ||
      item?.pushType === PUSH_TYPE_KEYS.TEASER_VIDEO) {
      navigate('/tutor/TutorTeaserVideos');
    } else if (

      item?.pushType === PUSH_TYPE_KEYS.LIKE_FORUM ||
      item?.pushType === PUSH_TYPE_KEYS.COMMENT_FORUM ||
      item?.pushType === PUSH_TYPE_KEYS.FORUM) {
      navigate('/tutor/formdiscussion');
    } else if (

      item?.pushType === PUSH_TYPE_KEYS.LIKE_POST ||
      item?.pushType === PUSH_TYPE_KEYS.COMMENT_POST ||
      item?.pushType === PUSH_TYPE_KEYS.POST) {
      navigate('/tutor/posts');
    } else if (

      item?.pushType === PUSH_TYPE_KEYS.POST
    ) {
      navigate('/tutor/posts');
    } else if (

      item?.pushType === PUSH_TYPE_KEYS.FORUM
    ) {
      navigate('/tutor/formdiscussion');
    } else if (

      item?.pushType === PUSH_TYPE_KEYS.SHORT_VIDEO
    ) {
      navigate('/tutor/TutorShortVideos');
    } else if (

      item?.pushType === PUSH_TYPE_KEYS.TEASER_VIDEO
    ) {
      navigate('/tutor/TutorTeaserVideos');
    } else if (

      item?.pushType === PUSH_TYPE_KEYS.UPDATE_CLASS
    ) {
      navigate(`/tutor/classes/details/${item?.classId}`)

    } else if (
      item?.pushType === PUSH_TYPE_KEYS.COTUTOR
    ) {
      if (item?.coTutorStatus === 1) {
        setData({
          tutorId: item?.tutorId || '',
          classId: item?.classId || '',
          tutorName: item?.tutorName || '',
          className: item?.className || '',
        })
        setCoTutorModal(true);

      } else if (item?.coTutorStatus === 2) {

        navigate(`/tutor/classes/details/${item?.classId}`)

      } else if (item?.coTutorStatus === 3) {
        showToast("You've rejected this request");
      }
    } else if (

      item?.pushType === PUSH_TYPE_KEYS.BOOKING_CANCELLED
    ) {
      navigate(`/tutor/booking-detail/cancelled/${item?.bookingId}`)

    }
  };



  useEffect(() => {

    socket?.on("newNotification", (res: any) => {

      setNotCount((prev) => (prev + 1));
      setToStorage(STORAGE_KEYS.NOTIFICATION_COUNT, NotCount + 1)

    });
    socket?.on("listMessageOk", (res: any) => {
      setChatCount((prev) => (prev + 1));
      setToStorage(STORAGE_KEYS.CHAT_COUNT, ChatCount + 1)

    });

    socket?.on("readMessageCount", (res: any) => {
      console.log(res, 'res in readMessageCount');
      setChatCount((prev) => (prev - res?.data?.justReadCount));
      setToStorage(STORAGE_KEYS.CHAT_COUNT, ChatCount - res?.data?.justReadCount)
    });

    return () => {
      socket?.off("newNotification");
      socket?.off("listMessageOK");
      socket?.off("readMessageCount");
    };
  }, []);

  const fetchProfile = () => {
    const token = getFromStorage(STORAGE_KEYS.token);
    const userData = getFromStorage(STORAGE_KEYS.user);
    if (token) {
      dispatch(
        setCredentials({
          user: userData || null,
          token: token || null,
        })
      );
      dispatch(role({ roleName: "tutor" }));
    }
  };

  const fetchNotification = async () => {
    try {
      const res = await getNotifications({ page: 1, limit: 100 }).unwrap();
      if (res?.statusCode === 200) {
        setNotifcations(res?.data);
      }
    } catch (error: any) {
      showError(error?.data?.message);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (roleName === "tutor" && token && notificationAnchorEl !== null) fetchNotification();
  }, [notificationAnchorEl]);


  useEffect(() => {
    const handleModalOpen = (res: any) => {
      console.log(res, 'resresresres');
      setData(res?.data)
      setCoTutorModal(true);

    }
    socket?.on('newClass', handleModalOpen);
    return () => {
      socket?.off('newClass', handleModalOpen);
    };
  }, []);


  return (
    <>
      <header className="site_header v2">
        <div className="main_header">
          <div className="conta_iner v2">
            {/* <nav>
              <IconButton
                className="icon_btn site_hamburgur"
                onClick={toggleDrawer(true)}
              >
                <span></span>
              </IconButton>
              <a
                onClick={() => navigate("/tutor/dashboard")}
                className="site_logo"
              >
                <figure>
                  <img src={`/static/images/logo.png`} alt="logo" />
                </figure>
              </a>
              <div className="icon_flex">
                <IconButton
                  className="icon_btn"
                  id="notification-button"
                  aria-controls={open1 ? "notification-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open1 ? "true" : undefined}
                  onClick={handleClick}
                >
                  <figure>
                    <img src={`/static/images/bell_icon.svg`} alt="img" />
                  </figure>
                </IconButton>
              
              </div>
            </nav> */}
            <nav>



              <div className="header_lts">
                <a
                  onClick={() => (navigate("/"))}
                  className="site_logo"
                >
                  <figure>
                    <img src={`/static/images/logo.png`} alt="logo" />
                  </figure>
                </a>

              </div>

              <div className={`icon_flex icn_dom ${openMenu1 ? "active" : ""}`}>
                <a className={window.location.pathname == '/tutor/home' ? "actv" : ""} onClick={() => navigate("/tutor/home")}>
                  <figure>
                    <img src="/static/images/home.svg" alt="" />
                    <figcaption>Home</figcaption>
                  </figure>
                </a>
                <a className={window.location.pathname == '/tutor/dashboard' ? "actv" : ""} onClick={() => navigate('/tutor/dashboard')} >
                  <figure>
                    <img src="/static/images/videos.svg" alt="" />
                    <figcaption>Dashboard</figcaption>
                  </figure>
                </a>



                <a className={window.location.pathname == '/tutor/chat' ? "actv" : ""} onClick={() => navigate('/tutor/chat')}>
                  <figure>
                    <img src="/static/images/inbox_icon.svg" alt="" />
                    <figcaption>Inbox</figcaption>
                    {ChatCount > 0 ? (
                      <strong>{ChatCount}</strong>
                    ) : null}
                  </figure>
                </a>

                <a className={window.location.pathname == '/tutor/classes' ? "actv" : ""} onClick={() => navigate('/tutor/classes')} >
                  <figure>
                    <img src="/static/images/classes.svg" alt="" />
                    <figcaption>Create class</figcaption>
                  </figure>
                </a>
                <a  >
                  <ClickAwayListener onClickAway={handleClose3}>
                    <figure className="profile" onClick={handleClick3}>
                      <img
                        src={userDetails?.image || "/static/images/user.png"}
                        alt=""
                      />
                      <figcaption>
                        {userDetails?.name || ""}{" "}
                        <span>
                          <img src={`/static/images/drop_icon.svg`} alt="" />
                        </span>{" "}
                      </figcaption>
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose3}
                        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                        transformOrigin={{ vertical: "top", horizontal: "left" }}
                      >
                        <MenuItem onClick={() => setOpenLog(true)}>Logout</MenuItem>
                      </Menu>
                    </figure>
                  </ClickAwayListener>
                </a>


                {token ? (
                  <IconButton
                    className="icon_btn"
                    id="notification-button"
                    aria-controls={notificationAnchorEl ? "notification-menu" : undefined}
                    aria-expanded={notificationAnchorEl ? "true" : undefined}
                    aria-haspopup="true"
                    onClick={(e) => { handleNotificationClick(e); setNotCount(0) }}
                  >
                    <figure>
                      <img src={`/static/images/bell_icon.svg`} alt="img" />
                      {
                        NotCount ? (
                          <figcaption className="count">{NotCount}</figcaption>

                        ) : null
                      }
                    </figure>


                  </IconButton>
                ) : null}
                <Menu
                  className="noti_box"
                  id="notification-menu"
                  anchorEl={notificationAnchorEl}
                  open={Boolean(notificationAnchorEl)}
                  onClose={handleNotificationClose}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                >
                  <div className="head">
                    <div className="lt_s">
                      <h2>Notifications</h2>
                    </div>
                  </div>
                  <ul className="body">
                    {notifications?.newNotification?.length ? (
                      <h6>Recent notifications</h6>
                    ) : (
                      ""
                    )}

                    {notifications?.newNotification?.length
                      ? notifications?.newNotification?.map((item: any) => {
                        return (
                          <>
                            <li

                              style={{
                                backgroundColor: "lightgray",
                                padding: "8px",
                                borderRadius: "15px",
                              }}
                            >
                              <p onClick={() => handleNavigate(item)}>
                                <strong>{item?.title}</strong> {item?.message}
                              </p>
                                <span >{moment(item?.createdAt).fromNow()}</span>
                            </li>
                          </>
                        );
                      })
                      : ""}

                    {notifications?.oldNotification?.length ? (
                      <h6>Older notifications</h6>
                    ) : (
                      ""
                    )}
                    {notifications?.oldNotification?.length
                      ? notifications?.oldNotification?.map((item: any) => {
                        return (
                          <>
                            <li

                              style={{ padding: "8px", borderRadius: "15px" }}
                            >
                              <p onClick={() => handleNavigate(item)}>
                                <strong>{item?.title}</strong> {item?.message}
                              </p>
                              <span >{moment(item?.createdAt).fromNow()}</span>
                            </li>
                          </>
                        );
                      })
                      : ""}
                  </ul>
                </Menu>
              </div>
              <div onClick={toggleMenu} className="hamb_icon" >
                <MenuOpenIcon />
              </div>
            </nav>
          </div>
        </div>
      </header>
      <LogoutModal
        open={openLog}
        setOpen={setOpenLog}
        onClose={handleCloseLog}
      />
      <BookingAlertModal
        open={coTutorModal}
        setOpen={setCoTutorModal}
        onClose={() => setCoTutorModal(false)}
        data={data}
      />
    </>
  );
};

export default TutorHeader;
