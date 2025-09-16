import * as React from "react";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { FormControlLabel, styled, Switch, SwitchProps } from "@mui/material";
import { UPVOTE_ROLE } from "../constants/enums";
import { showError } from "../constants/toast";
import { useUpdateProfileMutation } from "../service/auth";
import { getFromStorage, setToStorage } from "../constants/storage";
import { STORAGE_KEYS } from "../constants/storageKeys";
import { useAppDispatch } from "../hooks/store";
import { setCredentials } from "../reducers/authSlice";
import SocialModal from "../Modals/SocialModal";
import AboutProfile from "../Modals/AboutProfile";
import { RWebShare } from "react-web-share";
import { REDIRECTLINK } from "../constants/url";
import MenuOpenIcon from '@mui/icons-material/MenuOpen';


const NewSideBarTutor = () => {
    const navigate = useNavigate();
    const userDetails = useAuth();
    const token = getFromStorage(STORAGE_KEYS.token);
    const [openSocialModal, setOpenSocialModal] = React.useState<boolean>(false);
    const [openAboutModal, setOpenAboutModal] = React.useState<boolean>(false);
    const [updateStatus] = useUpdateProfileMutation();
    const dispatch = useAppDispatch();
    const [role, setRole] = React.useState(true);
     const [openMenu1, setOpenMenu1] = React.useState<boolean>(false); 
     const toggleMenu = () => setOpenMenu1(!openMenu1);

    const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRole(event.target.checked);
        if (event.target.checked == false) {
            changeStatus()
            setToStorage(STORAGE_KEYS.roleName, 'parent')
            navigate("/parent/search-result");
        }
    };


    const changeStatus = async () => {
        const body = {
            secondaryRole: UPVOTE_ROLE.PARENT,
        };

        try {
            const res = await updateStatus(body).unwrap();
            if (res?.statusCode == 200) {
                setToStorage(STORAGE_KEYS.user, res?.data || null);

                dispatch(
                    setCredentials({
                        user: res?.data || null,
                        token: token || null,
                    })
                );
                setToStorage(STORAGE_KEYS.roleName, 'parent')
                navigate("/parent/search-result");

            }
        } catch (error: any) {
            showError(error?.data?.message);
        }
    };

    const IOSSwitch = styled((props: SwitchProps) => (
        <Switch
            focusVisibleClassName=".Mui-focusVisible"
            disableRipple
            {...props}
        />
    ))(({ theme }) => ({
        width: 42,
        height: 26,
        padding: 0,
        "& .MuiSwitch-switchBase": {
            padding: 0,
            margin: 2,
            transitionDuration: "300ms",
            "&.Mui-checked": {
                transform: "translateX(16px)",
                color: "#fff",
                "& + .MuiSwitch-track": {
                    backgroundColor: "#1eb2f7ff",
                    opacity: 1,
                    border: 0,
                    ...theme.applyStyles("dark", {
                        backgroundColor: "#2ECA45",
                    }),
                },
                "&.Mui-disabled + .MuiSwitch-track": {
                    opacity: 0.5,
                },
            },
            "&.Mui-focusVisible .MuiSwitch-thumb": {
                color: "#33cf4d",
                border: "6px solid #fff",
            },
            "&.Mui-disabled .MuiSwitch-thumb": {
                color: theme.palette.grey[100],
                ...theme.applyStyles("dark", {
                    color: theme.palette.grey[600],
                }),
            },
            "&.Mui-disabled + .MuiSwitch-track": {
                opacity: 0.7,
                ...theme.applyStyles("dark", {
                    opacity: 0.3,
                }),
            },
        },
        "& .MuiSwitch-thumb": {
            boxSizing: "border-box",
            width: 22,
            height: 22,
        },
        "& .MuiSwitch-track": {
            borderRadius: 26 / 2,
            backgroundColor: "#E9E9EA",
            opacity: 1,
            transition: theme.transitions.create(["background-color"], {
                duration: 500,
            }),
            ...theme.applyStyles("dark", {
                backgroundColor: "#39393D",
            }),
        },
    }));


    return (
        <Box>
            <div className="side_menu_wrap">
                <div className="profile_bx card">
                    <figure>
                        <img src={userDetails?.bannerImg || `/static/images/profile_bg.png`} alt="profile_bg" />
                        <figcaption>
                            {" "}
                            <span className="dot"></span>{" "}
                            {userDetails?.isActive ? "Live" : "Offline"}
                        </figcaption>
                    </figure>

                    <div className="btm_profile">
                        <figure className={userDetails?.isActive ? 'active_border' : ""}>
                            <img
                                src={userDetails?.image || `/static/images/user.png`}
                                alt="amelia"
                            />
                        </figure>
                        <div className="cntnt">
                            <h2>{userDetails?.name || "-"}</h2>
                            <p>
                                {userDetails?.userName || ""}{" "}
                                <span>{userDetails?.email || "-"}</span>
                            </p>
                        </div>
                    </div>
                    <div className="res_menu_toggle">
                        <button
                            onClick={() => navigate("/tutor/profile")}
                            className="btn primary"
                        >
                            Edit Profile
                        </button>
                        <span onClick={toggleMenu}>
                            <MenuOpenIcon />
                        </span>
                    </div>
                    <div className="switch_set">
                        <p>Tutor Mode</p>
                        <FormControlLabel
                            control={
                                <IOSSwitch
                                    sx={{ m: 1 }}
                                    checked={role}
                                    onChange={handleSwitchChange}
                                    defaultChecked
                                />
                            }
                            label=""
                        />
                    </div>


                </div>

                <div className={`list_wrapper ${openMenu1 ? "active" : ""}`}>
                    <ul>
                        <li className={window.location.pathname == '/tutor/my-bookings' ? "actv" : ""} onClick={() => navigate("/tutor/my-bookings")}>
                            <figure>
                                <img
                                    src={`/static/images/sidebar/sidebar1.svg`}
                                    alt="sidebar1"
                                />
                                <figcaption>My Bookings</figcaption>
                            </figure>
                            <span>
                                <img src={`/static/images/sidebar/forwrd.svg`} alt="forwrd" />
                            </span>
                        </li>
                        <li className={window.location.pathname == '/tutor/manage-followers' ? "actv" : ""} onClick={() => navigate("/tutor/manage-followers")}>
                            <figure>
                                <img
                                    src={`/static/images/sidebar/sidebar1.svg`}
                                    alt="sidebar1"
                                />
                                <figcaption>My Followers/Viewers</figcaption>
                            </figure>
                            <span>
                                <img src={`/static/images/sidebar/forwrd.svg`} alt="forwrd" />
                            </span>
                        </li>
                        <li className={window.location.pathname == '/tutor/manage-reviews' ? "actv" : ""} onClick={() => navigate("/tutor/manage-reviews")}>
                            <figure>
                                <img src={`/static/images/sidebar/side2.svg`} alt="side2" />
                                <figcaption>Manage Reviews</figcaption>
                            </figure>
                            <span>
                                <img src={`/static/images/sidebar/forwrd.svg`} alt="forwrd" />
                            </span>
                        </li>

                        <li className={window.location.pathname == '/tutor/manage-users' ? "actv" : ""} onClick={() => navigate("/tutor/manage-users")}>
                            <figure>
                                <img src={`/static/images/sidebar/side3.svg`} alt="side3" />
                                <figcaption>Manage Users</figcaption>
                            </figure>
                            <span>
                                <img src={`/static/images/sidebar/forwrd.svg`} alt="forwrd" />
                            </span>
                        </li>

                        <li className={window.location.pathname == '/tutor/TutorTeaserVideos' ? "actv" : ""} onClick={() => navigate('/tutor/TutorTeaserVideos')}>
                            <figure>
                                <img src={`/static/images/sidebar/side4.svg`} alt="side4" />
                                <figcaption>Teaser Videos</figcaption>
                            </figure>
                            <span>
                                <img src={`/static/images/sidebar/forwrd.svg`} alt="forwrd" />
                            </span>
                        </li>

                        <li className={window.location.pathname == '/tutor/promo-codes' ? "actv" : ""} onClick={() => navigate('/tutor/promo-codes')}>
                            <figure>
                                <img src={`/static/images/sidebar/side4.svg`} alt="side4" />
                                <figcaption>My Promo code</figcaption>
                            </figure>
                            <span>
                                <img src={`/static/images/sidebar/forwrd.svg`} alt="forwrd" />
                            </span>
                        </li>
                        <li className={window.location.pathname == '/tutor/TutorShortVideos' ? "actv" : ""} onClick={() => navigate('/tutor/TutorShortVideos')}>
                            <figure>
                                <img src={`/static/images/sidebar/side4.svg`} alt="side4" />
                                <figcaption>Short Videos</figcaption>
                            </figure>
                            <span>
                                <img src={`/static/images/sidebar/forwrd.svg`} alt="forwrd" />
                            </span>
                        </li>
                        <li className={window.location.pathname == '/tutor/classes/drafts' ? "actv" : ""} onClick={() => navigate('/tutor/classes/drafts')}>
                            <figure>
                                <img src={`/static/images/sidebar/side6.svg`} alt="side4" />
                                <figcaption>My Draft Classes</figcaption>
                            </figure>
                            <span>
                                <img src={`/static/images/sidebar/forwrd.svg`} alt="forwrd" />
                            </span>
                        </li>
                        <li className={window.location.pathname == '/tutor/TutorTeaserVideos/drafts' ? "actv" : ""} onClick={() => navigate('/tutor/TutorTeaserVideos/drafts')}>
                            <figure>
                                <img src={`/static/images/sidebar/side4.svg`} alt="side4" />
                                <figcaption>My Draft Teaser Videos</figcaption>
                            </figure>
                            <span>
                                <img src={`/static/images/sidebar/forwrd.svg`} alt="forwrd" />
                            </span>
                        </li>
                        <li className={window.location.pathname == '/tutor/formdiscussion' ? "actv" : ""} onClick={() => navigate("/tutor/formdiscussion")}>
                            <figure>
                                <img src={`/static/images/sidebar/side6.svg`} alt="side4" />
                                <figcaption>Forum & Discussion</figcaption>
                            </figure>
                            <span>
                                <img src={`/static/images/sidebar/forwrd.svg`} alt="forwrd" />
                            </span>
                        </li>



                        <li className={window.location.pathname == '/tutor/inquries' ? "actv" : ""} onClick={() => navigate('/tutor/inquries')}>
                            <figure>
                                <img src={`/static/images/sidebar/side8.svg`} alt="side4" />
                                <figcaption>Inquiries</figcaption>
                            </figure>
                            <span>
                                <img src={`/static/images/sidebar/forwrd.svg`} alt="forwrd" />
                            </span>
                        </li>

                        <li className={window.location.pathname == '/tutor/manage-earnings' ? "actv" : ""} onClick={() => navigate("/tutor/manage-earnings")}>
                            <figure>
                                <img src={`/static/images/sidebar/side7.svg`} alt="side4" />
                                <figcaption>Manage Earnings</figcaption>
                            </figure>
                            <span>
                                <img src={`/static/images/sidebar/forwrd.svg`} alt="forwrd" />
                            </span>
                        </li>
                    </ul>
                    <ul>
                        <li>
                            <figure>
                                <img src={`/static/images/sidebar/side9.svg`} alt="side9" />
                                <RWebShare
                                    data={{
                                        text: "Click on link to see the tutor details",
                                        url: `${REDIRECTLINK}tutorProfieDetails/${userDetails?._id}`,
                                        title: userDetails?.name || "",
                                    }}
                                >
                                    <figcaption>Share Profile Via</figcaption>
                                </RWebShare>

                            </figure>
                            <span>
                                <img src={`/static/images/sidebar/forwrd.svg`} alt="forwrd" />
                            </span>
                        </li>

                        <li onClick={() => setOpenAboutModal(true)}>
                            <figure>
                                <img src={`/static/images/sidebar/side11.svg`} alt="side11" />
                                <figcaption>Social Links</figcaption>
                            </figure>
                            <span>
                                <img src={`/static/images/sidebar/forwrd.svg`} alt="forwrd" />
                            </span>
                        </li>
                        <li onClick={() => setOpenSocialModal(true)}>
                            <figure>
                                <img
                                    src={`/static/images/sidebar/info-circle.svg`}
                                    alt="info-circle"
                                />
                                <figcaption>About Profile</figcaption>
                            </figure>
                            <span>
                                <img src={`/static/images/sidebar/forwrd.svg`} alt="forwrd" />
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
            <SocialModal open={openSocialModal} setOpen={setOpenSocialModal} onClose={() => setOpenSocialModal(false)} />
            <AboutProfile open={openAboutModal} setOpen={setOpenAboutModal} onClose={() => setOpenAboutModal(false)} />
        </Box>
    );
};

export default NewSideBarTutor;
