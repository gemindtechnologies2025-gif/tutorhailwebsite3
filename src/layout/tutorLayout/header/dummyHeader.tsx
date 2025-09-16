/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Divider,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    Menu,
  
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import { useAppDispatch } from "../../../hooks/store";
import {
    getFromStorage,
  
} from "../../../constants/storage";
import { STORAGE_KEYS } from "../../../constants/storageKeys";
import {
    role,
    setCredentials,
} from "../../../reducers/authSlice";
import useAuth from "../../../hooks/useAuth";
import LogoutModal from "../../../Modals/logout";

const DummyHeader = () => {
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);
    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };
  
   
    const userDetails = useAuth();
    const dispatch = useAppDispatch();
  
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open1 = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const setRole = () => {
        dispatch(role({ roleName: "tutor" }));
    }
    const [openLog, setOpenLog] = useState<boolean>(false);
    const handleCloseLog = () => {
        setOpenLog(false);
    };
   

    useEffect(() => {
        if (window) {
            window.scrollTo({ top: 0, behavior: "auto" });
        }
    }, []);

   

    useEffect(() => {
        setRole()
    }, [])
    const DrawerList = (
        <Box className="aside_inner" role="presentation">
            <div className="aside_top">
                <figure onClick={() => window.open("/tutor/dashboard")}>
                    <img src={`/static/images/logo_favicon.svg`} alt="logo" />
                </figure>
                <button onClick={toggleDrawer(false)}>
                    <CloseIcon />
                </button>
            </div>
            <button
                className="aside_profile"
                onClick={() => window.open("/tutor/profile")}
            >
                <figure>
                    <img
                        src={
                            userDetails?.image
                                ? userDetails?.image
                                : `/static/images/user.png`
                        }
                        alt="logo"
                    />
                </figure>
                <p>
                    <strong>{userDetails?.name ? userDetails?.name : "-"}</strong>
                    <span>{userDetails?.address ? userDetails?.address : "-"}</span>
                </p>
                <ArrowForwardIosIcon />
            </button>
            <div className="aside_menu">
                <List disablePadding>
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => window.open("/tutor/my-bookings")}>
                            <figure>
                                <img src={`/static/images/booking_icon.svg`} alt="Icon" />
                            </figure>
                            <p>My Bookings</p>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => window.open("/tutor/chat")}>
                            <figure>
                                <img src={`/static/images/chat_icon.svg`} alt="Icon" />
                            </figure>
                            <p>My Chats</p>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => window.open("/tutor/manage-users")}>
                            <figure>
                                <img src={`/static/images/pairing_icon.svg`} alt="Icon" />
                            </figure>
                            <p>Manage Users</p>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => window.open("/tutor/manage-earnings")}>
                            <figure>
                                <img src={`/static/images/earnings_icon.svg`} alt="Icon" />
                            </figure>
                            <p>Manage Earnings</p>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => window.open("/tutor/manage-reviews")}>
                            <figure>
                                <img src={`/static/images/reviews_icon.svg`} alt="Icon" />
                            </figure>
                            <p>Manage Reviews</p>
                        </ListItemButton>
                    </ListItem>
                </List>
                <Divider />
                <List disablePadding>
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => window.open("/tutor/contact-us")}>
                            <figure>
                                <img src={`/static/images/phone_icon.svg`} alt="Icon" />
                            </figure>
                            <p>Contact Us</p>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton
                            onClick={() => window.open("/tutor/terms-and-conditions")}
                        >
                            <figure>
                                <img src={`/static/images/cms_icon.svg`} alt="Icon" />
                            </figure>
                            <p>Terms & Condition</p>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => window.open("/tutor/faq")}>
                            <figure>
                                <img src={`/static/images/faq_icon.svg`} alt="Icon" />
                            </figure>
                            <p>FAQ</p>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => window.open("/tutor/about-us")}>
                            <figure>
                                <img src={`/static/images/about_icon.svg`} alt="Icon" />
                            </figure>
                            <p>About</p>
                        </ListItemButton>
                    </ListItem>
                </List>
                <Divider className="mt_auto" />
                <List disablePadding>
                    <ListItem disablePadding>
                        <ListItemButton
                            // onClick={() => navigate('/auth/as-tutor/login')}
                            onClick={() => setOpenLog(true)}
                        >
                            <figure>
                                <img src={`/static/images/signout_icon.svg`} alt="Icon" />
                            </figure>
                            <p>Sign Out</p>
                        </ListItemButton>
                    </ListItem>
                </List>
            </div>
        </Box>
    );

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


    useEffect(() => {
        fetchProfile();
    }, []);

    

    return (
        <>
            <header className="site_header v2 zoom_header">
                <div className="main_header">
                    <div className="conta_iner v2">
                        <nav>
                            {/* <IconButton
                                className="icon_btn site_hamburgur"
                                onClick={toggleDrawer(true)}
                            >
                                <span></span>
                            </IconButton> */}
                            <a
                                onClick={() => window.open("/tutor/dashboard")}
                                className="site_logo"
                            >
                                <figure>
                                    <img src={`/static/images/logo.png`} alt="logo" />
                                </figure>
                            </a>
                           
                        </nav>
                    </div>
                </div>
            </header>
            <LogoutModal
                open={openLog}
                setOpen={setOpenLog}
                onClose={handleCloseLog}
            />

            <Drawer
                className="header_aside"
                open={open}
                onClose={toggleDrawer(false)}
            >
                {DrawerList}
            </Drawer>
        </>
    );
};

export default DummyHeader;
