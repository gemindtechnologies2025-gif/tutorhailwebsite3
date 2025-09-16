/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import { ClickAwayListener, Input } from "@mui/material";
import {
  Menu,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {
  useLazyGetUserQuery,
  usePostLogoutMutation,
} from "../../../service/auth";
import { getFromStorage, setToStorage } from "../../../constants/storage";
import {
  getToken,
  resetAuth,
  role,
  setCredentials,
} from "../../../reducers/authSlice";
import { showError, showToast } from "../../../constants/toast";
import { STORAGE_KEYS } from "../../../constants/storageKeys";
import { useDispatch } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../hooks/store";
import { useDebounce } from "../../../constants/useDebounce";
import { useGetSearchQueryQuery } from "../../../service/parentDashboard";
import StarIcon from "@mui/icons-material/Star";
import useAuth from "../../../hooks/useAuth";
import LogoutModal from "../../../Modals/logout";
import { useLazyGetNotificationsQuery } from "../../../service/tutorApi";
import CURRENCY from "../../../constants/Currency";
import CurrencyModal from "../../../Modals/CurrencyModel";
import useExchangeCurrency from "../../../hooks/useCurrency";
import { setCurrencyMode, setCurrencySymbol, setCurrentCurrency } from "../../../reducers/currencySlice";
import { isValidInput } from "../../../utils/validations";
import { useChatNotCountQuery } from "../../../service/chatApi";
import { socket } from "../../../utils/socket";
import LoginAlertModal from "../../../Modals/LoginAlertModal";
import { PUSH_TYPE_KEYS } from "../../../constants/enums";
import moment from "moment";
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
type props = {
  zoom: boolean;
  search?: string,
  setSearch?: any;
};
const ParentHeader = ({ zoom, search, setSearch }: props) => {
  const navigate = useNavigate();
  const token = getFromStorage(STORAGE_KEYS.token);
  useExchangeCurrency();
  const [NotCount, setNotCount] = useState(Number(getFromStorage(STORAGE_KEYS.NOTIFICATION_COUNT) || 0));
  const [ChatCount, setChatCount] = useState(Number(getFromStorage(STORAGE_KEYS.CHAT_COUNT) || 0));
  const [getProfile] = useLazyGetUserQuery();
  const userDetails = useAuth();
  const crData = localStorage.getItem("currency") ? JSON.parse(localStorage.getItem("currency") || "") : {
    currency: 'USD',
    code: 'en-US',
    symbol: '$',
    flag: 'https://flagcdn.com/w80/us.png',
  };
  const [openCurr, setOpenCurr] = useState<boolean>(false);
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [getNotifications] = useLazyGetNotificationsQuery();
  const [notifications, setNotifcations] = useState<any>([]);
  const dispatch = useAppDispatch();
  const tokenFromRed = useAppSelector(getToken);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [open1, setOpen1] = React.useState<boolean>(false);
  const handleClose1 = () => {
    setOpen1(false);
  };
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
  const [openLog, setOpenLog] = useState<boolean>(false);
  const handleCloseLog = () => {
    setOpenLog(false);
  };
  const [openMenu1, setOpenMenu1] = useState(false);
  const toggleMenu = () => setOpenMenu1(!openMenu1);
  const setRole = () => {
    dispatch(role({ roleName: "parent" }));
  };
  const handleNavigate = (item: any) => {
    console.log('pushType', item?.pushType, 'res', item, 'res');
    if (item?.pushType === PUSH_TYPE_KEYS.REVERT_COMPLAINT || item?.pushType === PUSH_TYPE_KEYS.REVERT_QUERY) {
      navigate('/parent/inquiry')
    } else if (
      (item?.pushType === PUSH_TYPE_KEYS.BOOKING_ACCEPTED ||
        item?.pushType === PUSH_TYPE_KEYS.BOOKING_COMPLETED ||
        item?.pushType === PUSH_TYPE_KEYS.BOOKING_CANCELLED ||
        item?.pushType === PUSH_TYPE_KEYS.BOOKING_ADDED ||
        item?.pushType === PUSH_TYPE_KEYS.BOOKING_REJECTED)
    ) {
      navigate(`/parent/my-bookings`);
    } else if (
      item?.pushType === PUSH_TYPE_KEYS.CLASS_BOOKED
    ) {
      navigate(`/parent/my-bookings`);
    } else if (
      item?.pushType === PUSH_TYPE_KEYS.MESSAGE_SENT
    ) {
      navigate('/parent/chat');
    } else if (
      item?.pushType === PUSH_TYPE_KEYS.PARENT_CALL_JOINED
    ) {
    } else if (
      item?.pushType === PUSH_TYPE_KEYS.TUTOR_CALL_JOINED
    ) {
      navigate(`/zoom-call/${item?.bookingDetailId}?type=parent`, {
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
      item?.pushType === PUSH_TYPE_KEYS.LIKE_FORUM ||
      item?.pushType === PUSH_TYPE_KEYS.COMMENT_FORUM ||
      item?.pushType === PUSH_TYPE_KEYS.FORUM) {
      navigate('/parent/my-forum');
    } else if (
      item?.pushType === PUSH_TYPE_KEYS.FORUM
    ) {
      navigate('/parent/formdiscussion');
    } else if (
      item?.pushType === PUSH_TYPE_KEYS.UPDATE_CLASS
    ) {
      navigate(`/parent/ClassDetail/${item?.classId}`)
    } else if (
      item?.pushType === PUSH_TYPE_KEYS.BOOKING_CANCELLED
    ) {
      navigate(`/parent/booking-detail/accepted/${item?.bookingId}`)
    }
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
    setRole();
  }, []);
  useEffect(() => {
    if (tokenFromRed) {
      fetchUser();
    }
  }, [tokenFromRed]);
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
      dispatch(role({ roleName: "parent" }));
    }
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
  useEffect(() => {
    fetchProfile();
  }, []);
  useEffect(() => {
    if (token) {
      fetchNotification();
    }
  }, []);
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
      setChatCount((prev) => (prev - res?.data?.justReadCount));
      setToStorage(STORAGE_KEYS.CHAT_COUNT, ChatCount - res?.data?.justReadCount)
    });
    return () => {
      socket?.off("newNotification");
      socket?.off("listMessageOK");
      socket?.off("readMessageCount");
    };
  }, []);
  useEffect(() => {
    const storedCurrency: any = localStorage.getItem("currency");
    if (storedCurrency !== null || storedCurrency !== undefined) {
      try {
        const cr = JSON.parse(storedCurrency);
        if (cr) {
          dispatch(setCurrentCurrency(cr?.currency ?? ""));
          dispatch(setCurrencyMode(cr?.code ?? ""));
          dispatch(setCurrencySymbol(cr?.symbol ?? ""));
        }
      } catch (error) {
        console.error("Invalid currency data in localStorage:", error);
        localStorage.removeItem("currency"); // optional: clean invalid data
      }
    }
  }, []);
  return (
    <>
      <header
        className={zoom ? "site_header v2 zoom_header" : "site_header v2"}>
        <div className="main_header">
          <div className="conta_iner v2">
            <nav>
              <div className="header_lts">
                <a
                  onClick={() => (zoom ? window.open("/") : navigate("/"))}
                  className="site_logo"
                >
                  <figure>
                    <img src={`/static/images/logo.png`} alt="logo" />
                  </figure>
                </a>
                {window.location.pathname == '/parent/search-result' ? (
                  <div className="input_group">
                    <Input
                      className="form_control"
                      placeholder="Search"
                      value={search}
                      onChange={(e) => {
                        if (isValidInput(e.target.value)) {
                          setSearch(e.target.value);
                        }
                      }}
                    />
                    <span><img src={`/static/images/search-outline.svg`} alt="" /></span>
                  </div>
                ) : null}
              </div>
              <div className={`icon_flex icn_dom ${openMenu1 ? "active" : ""}`}>
                <a className={window.location.pathname == '/parent/search-result' ? "actv" : ""} onClick={() => navigate('/parent/search-result')}>
                  <figure>
                    <img src="/static/images/home.svg" alt="" />
                    <figcaption>Home</figcaption>
                  </figure>
                </a>
                <a className={window.location.pathname == '/parent/code' ? "actv" : ""} onClick={() => { token ? navigate('/parent/code') : setOpen1(true) }}>
                  <figure>
                    <img src={`/static/images/profile-2user.svg`} alt="" />
                    <figcaption>Pairing</figcaption>
                  </figure>
                </a>
                <a className={window.location.pathname == '/parent/videos' ? "actv" : ""} onClick={() => navigate('/parent/videos')}>
                  <figure>
                    <img src="/static/images/videos.svg" alt="" />
                    <figcaption>Explore</figcaption>
                  </figure>
                </a>
                <a className={window.location.pathname == '/parent/chat' ? "actv" : ""} onClick={() => { token ? navigate('/parent/chat') : setOpen1(true) }}>
                  <figure>
                    <img src="/static/images/inbox_icon.svg" alt="" />
                    <figcaption>Inbox</figcaption>
                    {ChatCount > 0 ? (
                      <strong>{ChatCount}</strong>
                    ) : null}
                  </figure>
                </a>
                <a className={window.location.pathname == '/parent/classes' ? "actv" : ""} onClick={() => navigate('/parent/classes')}>
                  <figure>
                    <img src="/static/images/classes.svg" alt="" />
                    <figcaption>Classes</figcaption>
                  </figure>
                </a>
                <div className="nv_lst_icns">
                  {token ? (
                    <IconButton
                      className="icon_btn"
                      onClick={() =>
                        zoom
                          ? window.open("/parent/wishlist")
                          : navigate("/parent/wishlist")
                      }
                    >
                      <figure>
                        <img
                          src={`/static/images/wishlist_icon.svg`}
                          alt="img"
                        />
                      </figure>
                    </IconButton>) : null}
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
                                onClick={() =>
                                  handleNavigate(item)
                                }
                                style={{
                                  backgroundColor: "lightgray",
                                  padding: "8px",
                                  borderRadius: "15px",
                                }}
                              >
                                <p>
                                  <strong>{item?.title}</strong> {item?.message}
                                </p>
                                  <span >{moment(item?.createdAt).fromNow()}</span>
                              </li>
                            </>
                          );
                        })
                        : ""}
                      {notifications?.oldNotification?.length ? (
                        <b>Older notifications</b>
                      ) : (
                        ""
                      )}
                      {notifications?.oldNotification?.length
                        ? notifications?.oldNotification?.map((item: any) => {
                          return (
                            <>
                              <li
                                onClick={() =>
                                  handleNavigate(item)
                                }
                                style={{ padding: "8px", borderRadius: "15px" }}
                              >
                                <p>
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
                <a onClick={() => setOpenCurr(true)}>
                  <figure className="profile">
                    <img alt="flag" src={crData?.flag} width={25} />
                    <figcaption>
                      {crData?.currency || 'USD'}
                      <span><img src={`/static/images/drop_icon.svg`} alt="" /></span>
                    </figcaption>
                  </figure>
                </a>
                {token ? (
                  <a>
                    <ClickAwayListener onClickAway={handleClose3}>
                      <figure className="profile" onClick={handleClick3}>
                        <img src={userDetails?.image || "/static/images/user.png"} alt="" />
                        <figcaption>{userDetails?.name || ""} <span>
                          <img src={`/static/images/drop_icon.svg`} alt="" />
                        </span> </figcaption>
                        <Menu
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl)}
                          onClose={handleClose}
                          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                        >
                          <MenuItem onClick={() => setOpenLog(true)}>Logout</MenuItem>
                        </Menu>
                      </figure>
                    </ClickAwayListener>
                  </a>
                ) : null}

              </div>
              <div onClick={toggleMenu} className="hamb_icon" >
                <MenuOpenIcon />
              </div>
            </nav>
          </div>
        </div >
      </header >
      <LogoutModal
        open={openLog}
        setOpen={setOpenLog}
        onClose={handleCloseLog}
      />
      <CurrencyModal
        open={openCurr}
        setOpen={setOpenCurr}
        onClose={() => setOpenCurr(false)}
      />
      <LoginAlertModal
        open={open1}
        setOpen={setOpen1}
        onClose={handleClose1}
        msg="Please login"
      />
    </>
  );
};
export default ParentHeader;
