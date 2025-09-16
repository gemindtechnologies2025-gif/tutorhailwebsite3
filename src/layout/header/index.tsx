/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  MenuItem,
  TextField,
} from "@mui/material";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import { useAppDispatch, useAppSelector } from "../../hooks/store";
import {
  getRole,
  getToken,
  role,
  setCredentials,
} from "../../reducers/authSlice";
import { getFromStorage, setToStorage } from "../../constants/storage";
import { STORAGE_KEYS } from "../../constants/storageKeys";
import { Paper, Tooltip } from "@material-ui/core";
import { useDebounce } from "../../constants/useDebounce";
import { useGetSearchQueryQuery } from "../../service/parentDashboard";
import CloseIcon from "@mui/icons-material/Close";
import StarIcon from "@mui/icons-material/Star";
import useAuth from "../../hooks/useAuth";
const Header = () => { 
  const navigate = useNavigate();
  const user = useAuth();

  const [showInput, setShowInput] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const debounceValue = useDebounce(query, 750);
  

  const { data, isLoading, isSuccess, isError } = useGetSearchQueryQuery(
    {
      query: debounceValue,
    },
    { skip: !debounceValue }
  );

  useEffect(() => {
    if (window) {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, []);

  const roleName = getFromStorage(STORAGE_KEYS.roleName);
  
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const setRole = (roles: string) => {
    dispatch(role({ roleName: roles }));
  };

  const [isActive, setIsActive] = useState(false);
  const hamburgurClick = () => {
    setIsActive(!isActive); // Toggle isActive state
  };

  const token = getFromStorage(STORAGE_KEYS.token);
  const tokenFromRed = useAppSelector(getToken);
  const userData = getFromStorage(STORAGE_KEYS.user) as any;

  const fetchProfile = () => {
    if (token) {
      dispatch(
        setCredentials({
          user: userData || null,
          token: token || null,
        })
      );
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <header className={isActive ? "site_header menu_opened" : "site_header"}>
      <div className="top_header">
        <div className="conta_iner">
          <p>
            Are you a Student? This is the best platform to get a qualified &
            Experienced tutor for your children. Join now to grab offers
          </p>
        </div>
      </div>
      <div className="main_header">
        <div className="conta_iner">
          <nav>
            <a onClick={() => navigate("/")} className="site_logo">
              <figure>
                <img src={`/static/images/logo.png`} alt="logo" />
              </figure>
            </a>
            <ul className="site_menu">
              <li>
                <a
                  className="active"
                  target="_blank"
                  onClick={() => {
                    navigate("/");
                    window.scroll(0, 0);
                  }}
                >
                  Home
                </a>
              </li>
              <li onClick={() => navigate("/about-us")}>
                <a>Who we are</a>
              </li>
              <li>
                <a target="_blank" onClick={() => navigate("/faq")}>
                  FAQ
                </a>
              </li>
              <li>
                <a
                  target="_blank"
                  onClick={() => navigate("/terms-and-conditions")}
                >
                  T&C's
                </a>
              </li>
              <li>
                <a>Career</a>
              </li>
              <li>
                <a target="_blank" onClick={() => navigate("/contact-us")}>
                  Contact Us
                </a>
              </li>
            </ul>

            <div  className="icon_flex  ">
              <IconButton
                className="icon_btn hamb_icon"
                onClick={hamburgurClick}
              >
                <MenuIcon />
              </IconButton>
              {/* <IconButton className="icon_btn">
                <figure>
                  <img src={`/static/images/search_icon.svg`} alt="img" />
                </figure>
              </IconButton> */}
              {showInput && (
                <TextField
                  className="search-input"
                  hiddenLabel
                  fullWidth
                  placeholder="Search here..."
                  variant="outlined"
                  name="search"
                  type="text"
                  id="search"
                  inputProps={{ maxLength: 80 }}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              )}

              {isSuccess ? (
                <Paper
                  style={{
                    position: "absolute",
                    top: "75px",
                    width: "28%",
                    zIndex: 999,
                    right: "204px",
                    height: "fit-content", // Fixed height for the dropdown
                    maxHeight: "360px",
                    overflowY: "auto",
                  }}
                  elevation={3}
                >
                  <List>
                    {data?.data?.tutor?.length ? (
                      data?.data?.tutor?.map((item, index) => (
                        <ListItem
                          key={index}
                          style={{}}
                          className="search-result"
                          onClick={() =>
                            navigate(`/parent/tutor-detail/${item?._id}`)
                          }
                        >
                          {/* Left Side: Avatar */}
                          <Box marginRight="20px" padding={"12px"}>
                            {" "}
                            {/* Adds some space between image and text */}
                            <ListItemAvatar>
                              <Avatar
                                alt={item.name}
                                src={item.image}
                                style={{
                                  width: "60px",
                                  height: "60px", // Bigger avatar for better visual impact
                                  borderRadius: "4px", // Slight rounding for a modern look
                                }}
                              />
                            </ListItemAvatar>
                          </Box>

                          <Box flex="1">
                            <Box display="flex" justifyContent="space-between">
                              {/* Tutor Name and Subjects */}
                              <Box>
                                <h2>{item.name}</h2>
                                <p>
                                  {item?.classCount
                                    ? item.classCount > 99
                                      ? "99+ classes"
                                      : `${item.classCount} ${item.classCount > 1 ? "classes" : "class"}`
                                    : ""}
                                </p>
                                <ins>${item?.price || ""}/hour</ins>
                                <span
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    color: "#FFB400",
                                  }}
                                >
                                  <StarIcon
                                    fontSize="inherit"
                                    style={{ marginRight: "2px" }}
                                  />
                                  {item?.avgRating?.toFixed(1) || ""}
                                </span>
                              </Box>
                            </Box>
                          </Box>
                        </ListItem>
                      ))
                    ) : (
                      <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        height="250px" // Takes up the full height of the Paper
                      >
                        <h2 style={{ fontSize: "14px" }}>no matches found</h2>
                      </Box>
                    )}
                  </List>
                </Paper>
              ) : null}

              {/* {user ? (
                showInput ? (
                  <IconButton
                    className="icon_btn"
                    onClick={() => {
                      setQuery("");
                      setShowInput(false);
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                ) : (
                  <IconButton
                    className="icon_btn"
                    onClick={() => setShowInput(true)}
                  >
                    <figure>
                      <img src={`/static/images/search_icon.svg`} alt="img" />
                    </figure>
                  </IconButton>
                )
              ) : null} */}
              {/* {user && (
                <IconButton className="icon_btn">
                  <figure>
                    <img src={`/static/images/bell_icon.svg`} alt="img" />
                  </figure>
                </IconButton>
              )} */}
              {tokenFromRed ? (
                <figure className="profile-pic">
                  <img
                    alt="profile"
                    onClick={() =>
                      roleName === "tutor"
                        ? navigate("/tutor/dashboard")
                        : navigate("/parent/search-result")
                    }
                    src={userData?.image || "static/images/user.png"}
                  />
                </figure>
              ) : (
                <>
                  <Button
                    size="small"
                    id="login-button"
                    aria-controls={open ? "login-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                    onClick={handleClick}
                  >
                    Sign In / Sign Up
                  </Button>
                  <Menu
                    id="login-menu"
                    className="common_drop"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                      "aria-labelledby": "login-button",
                    }}
                  >
                    <MenuItem>
                      <Box
                        component="a"
                        onClick={() => {
                          navigate("/auth/as-tutor/login");
                          dispatch(role({ roleName: 'tutor' }));
                          setToStorage(STORAGE_KEYS.roleName,'tutor')
                        }}
                      >
                        As Tutor
                      </Box>
                    </MenuItem>
                    <MenuItem>
                      <Box
                        component="a"
                        onClick={() => {
                          navigate("/auth/as-parent/login");
                           dispatch(role({ roleName: 'prent' }));
                            setToStorage(STORAGE_KEYS.roleName,'parent')
                        }}
                      >
                        As Parent
                      </Box>
                    </MenuItem>
                  </Menu>
                </>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;

// function useEffect(arg0: () => void, arg1: never[]) {
//     throw new Error('Function not implemented.');
// }
