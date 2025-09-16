import * as React from "react";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import SocialModal from "../Modals/SocialModal";
import AboutProfile from "../Modals/AboutProfile";
import GiftModal from "../Modals/GiftModal"; // Assuming you have this modal
import { FormControlLabel, styled, Switch, SwitchProps } from "@mui/material";
import { UPVOTE_ROLE } from "../constants/enums";
import { getFromStorage, setToStorage } from "../constants/storage";
import { STORAGE_KEYS } from "../constants/storageKeys";
import { useUpdateProfileMutation } from "../service/auth";
import { useAppDispatch } from "../hooks/store";
import { setCredentials } from "../reducers/authSlice";
import { showError } from "../constants/toast";
import LoginAlertModal from "../Modals/LoginAlertModal";
import MenuOpenIcon from '@mui/icons-material/MenuOpen';


const NewSideBarParent = () => {
  const navigate = useNavigate();
  const userDetails = useAuth();

  const [updateStatus] = useUpdateProfileMutation();
  const dispatch = useAppDispatch();
  const token = getFromStorage(STORAGE_KEYS.token);
  const [openSocialModal, setOpenSocialModal] = React.useState<boolean>(false);
  const [role, setRole] = React.useState(false);
  const [open1, setOpen1] = React.useState<boolean>(false);
  const [openMenu1, setOpenMenu1] = React.useState<boolean>(false);
  const toggleMenu = () => setOpenMenu1(!openMenu1);

  

  const handleClose = () => {
    setOpen1(false);
  };
  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRole(event.target.checked);
    if (event.target.checked == true) {
      changeStatus()
    }
  };

  const changeStatus = async () => {
    const body = {
      secondaryRole: UPVOTE_ROLE.TUTOR,
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
        setToStorage(STORAGE_KEYS.roleName, 'tutor')
        navigate("/tutor/dashboard");

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
          backgroundColor: "#65C466",
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
    <>
      <Box>
        <div className="side_menu_wrap ">
          <div className="profile_bx card">
            <figure>
              <img src={userDetails?.bannerImg || `/static/images/profile_bg.png`} alt="profile_bg" />
              {token ? (
                <figcaption>
                  <span className="dot"></span> {userDetails?.isOnline ? "Live" : "Offline"}
                </figcaption>
              ) : null}

            </figure>
            <div className="btm_profile">
              <figure >
                <img src={userDetails?.image || `/static/images/user.png`} alt="amelia" />
              </figure>
              <div className="cntnt">
                <h2>{userDetails?.name || "Guest"}</h2>
                <p>
                  {userDetails?.userName || ""} <span>{userDetails?.email || "-"}</span>
                </p>
              </div>
            </div>
            {token ? (
              <div className="res_menu_toggle">
              <button onClick={() => navigate("/parent/profile")} className="btn primary">
                Edit Profile
              </button>
              <span onClick={toggleMenu} >
                   <MenuOpenIcon />
                 </span>
              </div>
            ) : (
              <button onClick={() => { navigate("/auth/as-parent/login"); setToStorage(STORAGE_KEYS.roleName, 'parent') }} className="btn primary">
                Sign in
              </button>
            )}

            {userDetails?.role == UPVOTE_ROLE.TUTOR && userDetails?.secondaryRole == UPVOTE_ROLE.PARENT ? (
              <div className="switch_set">
                <p>Learner Mode</p>
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
            ) : (
              null
            )}

          </div>

          <div  className={`list_wrapper ${openMenu1 ? "active" : ""}`}>
            <ul>

              <li className={window.location.pathname == '/parent/my-bookings' ? "actv" : ""} onClick={() => { token ? navigate("/parent/my-bookings") : setOpen1(true) }}>
                <figure>
                  <img src={`/static/images/sidebar/sidebar1.svg`} alt="sidebar1" />
                  <figcaption>My Bookings</figcaption>
                </figure>
                <span>
                  <img src={`/static/images/sidebar/forwrd.svg`} alt="forwrd" />
                </span>
              </li>

              <li className={window.location.pathname == '/parent/inquiry' ? "actv" : ""} onClick={() => { token ? navigate("/parent/inquiry") : setOpen1(true) }}>
                <figure>
                  <img src={`/static/images/sidebar/side4.svg`} alt="side4" />
                  <figcaption>Inquiry</figcaption>
                </figure>
                <span>
                  <img src={`/static/images/sidebar/forwrd.svg`} alt="forwrd" />
                </span>
              </li>

              <li className={window.location.pathname == '/parent/study-material' ? "actv" : ""} onClick={() => { token ? navigate("/parent/study-material") : setOpen1(true) }}>
                <figure>
                  <img src={`/static/images/sidebar/side4.svg`} alt="side4" />
                  <figcaption>My Study Material</figcaption>
                </figure>
                <span>
                  <img src={`/static/images/sidebar/forwrd.svg`} alt="forwrd" />
                </span>
              </li>

              <li className={window.location.pathname == '/parent/formdiscussion' ? "actv" : ""} onClick={() => { navigate("/parent/formdiscussion") }}>
                <figure>
                  <img src={`/static/images/sidebar/side6.svg`} alt="side6" />
                  <figcaption>Forum & Discussion</figcaption>
                </figure>
                <span>
                  <img src={`/static/images/sidebar/forwrd.svg`} alt="forwrd" />
                </span>
              </li>

              <li className={window.location.pathname == '/parent/location' ? "actv" : ""} onClick={() => { token ? navigate("/parent/location") : setOpen1(true) }}>
                <figure>
                  <img src={`/static/images/sidebar/side7.svg`} alt="side7" />
                  <figcaption>My Address</figcaption>
                </figure>
                <span>
                  <img src={`/static/images/sidebar/forwrd.svg`} alt="forwrd" />
                </span>
              </li>

              <li className={window.location.pathname == '/parent/my-forum' ? "actv" : ""} onClick={() => { token ? navigate("/parent/my-forum") : setOpen1(true) }}>
                <figure>
                  <img src={`/static/images/sidebar/side6.svg`} alt="side6" />
                  <figcaption>My Forum & Discussion</figcaption>
                </figure>
                <span>
                  <img src={`/static/images/sidebar/forwrd.svg`} alt="forwrd" />
                </span>
              </li>
            </ul>

            <ul>


              <li className={window.location.pathname == '/parent/savedItems' ? "actv" : ""} onClick={() => { token ? navigate('/parent/savedItems') : setOpen1(true) }}>
                <figure>
                  <img src={`/static/images/sidebar/archive-minus.svg`} alt="archive-minus" />
                  <figcaption>My Saved Items</figcaption>
                </figure>
                <span>
                  <img src={`/static/images/sidebar/forwrd.svg`} alt="forwrd" />
                </span>
              </li>


              <li onClick={() => { token ? setOpenSocialModal(true) : setOpen1(true) }}>
                <figure>
                  <img src={`/static/images/sidebar/info-circle.svg`} alt="info-circle" />
                  <figcaption>About Profile</figcaption>
                </figure>
                <span>
                  <img src={`/static/images/sidebar/forwrd.svg`} alt="forwrd" />
                </span>
              </li>
            </ul>
          </div>
        </div>
      </Box>
      <LoginAlertModal
        open={open1}
        setOpen={setOpen1}
        onClose={handleClose}
        msg="Please login"
      />
      <SocialModal open={openSocialModal} setOpen={setOpenSocialModal} onClose={() => setOpenSocialModal(false)} />
    </>
  );
};

export default NewSideBarParent;
