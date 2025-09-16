/* eslint-disable jsx-a11y/img-redundant-alt */
import { ParentLayout } from "../../../layout/parentLayout";
import { Box, Button, Drawer, Grid } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import StarIcon from "@mui/icons-material/Star";
import { useNavigate } from "react-router-dom";
import FilterSidebar from "../common/filterSidebar";
import LocationDrawer from "../common/locationDrawer";
import React, { useEffect, useState } from "react";
import { ParentDashBoardApi } from "../../../service/parentDashboard";
import { Booking, TutorDetails } from "../../../types/General";
import Skeleton from "@mui/material/Skeleton";
import dayjs from "dayjs";

import { wishListApi } from "../../../service/wishListApi";
import { showToast } from "../../../constants/toast";


export default function ParentDashboard() {
  const navigate = useNavigate();
  let timeout: NodeJS.Timeout; // timeout for debouncing
  // States
  const [open, setOpen] = React.useState(false); // state to handle open for the track location
  const [popularTutor, setPopularTutor] = useState<TutorDetails[]>([]); // state to store the data of the popular tutor
  const [recommended, setRecommended] = useState<TutorDetails[]>([]); // state to store the data of the recommended tutor
  const [loading, setLoading] = useState<boolean>(false); // loading state
  const [loadingOne, setLoadingOne] = useState<boolean>(false); // loading state
  const [prevTutor, setPrevTutor] = useState<TutorDetails[]>([]); // state to store the data of previously booked tutor
  const [currentBooking, setCurrentBooking] = useState<Booking>(); // state to store the data of current booking

  // API Hooks
  const [getTutor] = ParentDashBoardApi.useLazyGetPopularTutorQuery(); // api hook for the popular and recommended tutor
  const [getBooking] = ParentDashBoardApi.useLazyGetCurrentBookingQuery(); // api hook for the current booking and previously booked tutor
  const [addWishlist] = wishListApi.useAddWishListMutation();
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  
  

  // method for the api call to fetch popular and recommended tutors
  const fetchTutor = async () => {
    try {
      const res = await getTutor({ limit: 6 }).unwrap();
      if (res?.statusCode === 200) {
        // setData(res?.data)
        setPopularTutor(res?.data?.tutor?.slice(0, 4));
        setRecommended(res?.data?.recomended?.slice(0, 4));
        setLoading(false);
        
      }
    } catch (error) {
//      console.log(error);
      setLoading(false);
    }
  };

  // method for the api call to fetch Bookings of the user
  const fetchBooking = async () => {
    try {
      const res = await getBooking({}).unwrap();
      if (res?.statusCode === 200) {
        // setData(res?.data)
        setPrevTutor(res?.data?.tutor);
        setCurrentBooking(res?.data?.booking);
        setLoadingOne(false);
      }
    } catch (error) {
//      console.log(error);
      setLoadingOne(false);
    }
  };

  const handleWishList = async (item: TutorDetails) => {
//    console.log(item, "wish");
    try {
      let body = {
        tutorId: item?._id,
      };

      const res = await addWishlist({ body }).unwrap();
      if (res?.statusCode === 200) {
        if (item?.isFav) {
          showToast("Tutor removed to wishlist");
        } else {
          showToast("Tutor added to wishlist");
        }
        fetchBooking()
        fetchTutor()
      }
    } catch (error: any) {
//      console.log(error);
    }
  };
  useEffect(() => {
    setLoading(true);
    setLoadingOne(true);
    timeout = setTimeout(() => {
      fetchTutor();
      fetchBooking();
    }, 2000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <ParentLayout className="role-layout">
        <main className="content">
          <section className="uh_spc pDashboard_sc">
            <div className="conta_iner v2">
              {/* <div className="location_bar">
                <figure>
                  <img src={`/static/images/address_icon.svg`} alt="Icon" />
                </figure>
                <h1>New York, United States</h1>
                <Box component="a">Change</Box>
              </div> */}
              <div className="parent_dash">
                <div className="gap_m">
                  {/* <FilterSidebar /> */}
                  <div className="rt_s">
                    <div className="parent_dash_banner">
                      <figure>
                        <img
                          src={`/static/images/parent_banner.png`}
                          alt="Image"
                        />
                      </figure>
                      <div className="info">
                        <h2>
                          Learn with <br /> the best Tutors
                        </h2>
                        <p>
                          Achieve excellence and master your subjects with
                          expert guidance.
                        </p>
                      </div>
                    </div>
                    {currentBooking && (
                      <div className="dash_title">
                        <h2>Today’s Booking</h2>
                        <Box
                          component="a"
                          onClick={() => navigate("/parent/my-bookings")}
                        >
                          View more <ArrowForwardIosIcon />
                        </Box>
                      </div>
                    )}
                    {loadingOne ? (
                      <Box
                        sx={{
                          padding: 2,
                          borderRadius: 2,
                          backgroundColor: "#FCFDFFEF",
                          marginTop: 5,
                        }}
                      >
                        <Grid container spacing={2} alignItems="center">
                          {/* Avatar Placeholder */}
                          <Grid item>
                            <Skeleton
                              variant="rounded"
                              width={150}
                              height={150}
                            />
                          </Grid>

                          {/* Main Content */}
                          <Grid item xs>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <Skeleton
                                variant="text"
                                width="40%"
                                height={28}
                              />{" "}
                              {/* Name */}
                              <Skeleton
                                variant="rectangular"
                                width={120}
                                height={32}
                                sx={{ borderRadius: 1 }}
                              />{" "}
                              {/* Button */}
                            </Box>
                            <Skeleton
                              variant="rectangular"
                              width={160}
                              height={20}
                              sx={{ borderRadius: 1, marginTop: 1 }}
                            />{" "}
                            {/* Booking Code */}
                            <Grid container spacing={2} sx={{ marginTop: 2 }}>
                              <Grid item>
                                <Skeleton
                                  variant="text"
                                  width={120}
                                  height={20}
                                />{" "}
                                {/* Date & Time */}
                              </Grid>
                              <Grid item>
                                <Skeleton
                                  variant="text"
                                  width={60}
                                  height={20}
                                />{" "}
                                {/* Subject */}
                              </Grid>
                              <Grid item>
                                <Skeleton
                                  variant="text"
                                  width={60}
                                  height={20}
                                />{" "}
                                {/* Price */}
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Box>
                    ) : (
                      currentBooking && (
                        <div className="booking_box">
                          <figure>
                            <img
                              src={
                                currentBooking?.tutors?.image ||
                                `/static/images/userNew.png`
                              }
                              alt="Image"
                            />
                          </figure>
                          <div className="info">
                            <div className="flex">
                              <div className="lt">
                                <h3>{currentBooking?.tutors?.name || ""}</h3>
                                <span className="code">
                                  Booking Code -{" "}
                                  <strong>
                                    {currentBooking?.bookingdetails[0]?.otp
                                      ?.otp || ""}
                                  </strong>
                                </span>
                              </div>
                              <div className="rt">
                                <Button onClick={toggleDrawer(true)}>
                                  <img
                                    src={`/static/images/map_icon.svg`}
                                    alt="Icon"
                                  />
                                  Track Location
                                </Button>
                              </div>
                            </div>
                            <ul>
                              <li>
                                <span>Date & Time</span>
                                <strong>
                                  {dayjs(
                                    currentBooking?.bookingdetails[0]?.startTime
                                  )
                                    .locale("D MMMM, YY [at] HH:mm")
                                    .format("D MMMM,YYYY, hh:mm a")}
                                </strong>
                              </li>
                              <li>
                                <span>Subject</span>
                                <strong>
                                  {currentBooking?.subjects[0]?.name || ""}
                                </strong>
                              </li>
                              <li>
                                <span>Price</span>
                                <strong>
                                  $
                                  {currentBooking?.teachingdetails?.price || ""}
                                  /Hour
                                </strong>
                              </li>
                            </ul>
                          </div>
                        </div>
                      )
                    )}
                    {prevTutor?.length > 0 && (
                      <div className="dash_title">
                        <h2>Tutors You Booked Previously</h2>
                        {/* <Box
                          component="a"
                          onClick={() => navigate("/parent/booked-tutor")}
                        >
                          View more <ArrowForwardIosIcon />
                        </Box> */}
                      </div>
                    )}
                    <div className="tutor_list gap_m">
                      {loadingOne
                        ? Array.from(new Array(4)).map((item, index) => (
                          <Skeleton
                            variant="rounded"
                            animation="wave"
                            width={210}
                            height={220}
                            key={index}
                            sx={{
                              bgcolor: "#FCFDFFEF",
                              borderRadius: "8px",
                            }}
                          />
                        ))
                        : prevTutor?.map((item, index) => (
                          <div className="tutor_item" key={item?._id}>
                            <figure>
                              <img
                                src={item?.image || "static/images/card1.png"}
                                alt="tutor image"
                              />
                              {item?.avgRating && (
                                <span className="t_rating">
                                  <StarIcon />{" "}
                                  {item?.avgRating?.toFixed(1) || ""}
                                </span>
                              )}
                              <span className="t_fav" onClick={() => {
                                handleWishList(item)
                              }}>
                                {item?.isFav ? (
                                  <FavoriteIcon />
                                ) : (
                                  <FavoriteBorderIcon />
                                )}
                              </span>
                            </figure>
                            <div
                              className="tutor_info"
                              onClick={() =>
                                navigate(`/parent/tutor-detail/${item?._id}`)
                              }
                            >
                              <h2>{item?.name || ""}</h2>
                              <p>
                                {item?.classCount > 99
                                  ? "99+ classes"
                                  : `${item?.classCount} ${item?.classCount > 1 ? "classes" : "class"}` ||
                                  ""}
                              </p>
                              <p>{item?.subjects && item?.subjects?.join(",") || ""}</p>
                              <ins>${item?.price || ""}/hour</ins>
                            </div>
                          </div>
                        ))}
                    </div>

                    <div className="dash_title">
                      <h2>Popular Tutors</h2>
                      <Box
                        component="a"
                        onClick={() => navigate("/parent/popular-tutor")}
                      >
                        View more <ArrowForwardIosIcon />
                      </Box>
                    </div>
                    <div className="tutor_list gap_m">
                      {loading
                        ? Array.from(new Array(4)).map((item, index) => (
                          <Skeleton
                            variant="rounded"
                            animation="wave"
                            width={210}
                            height={220}
                            key={index}
                            sx={{
                              bgcolor: "#FCFDFFEF",
                              borderRadius: "8px",
                            }}
                          />
                        ))
                        : popularTutor?.map((item, index) => (
                          <div className="tutor_item" key={item?._id}>
                            <figure>
                              <img
                                src={item?.image || "static/images/card1.png"}
                                alt="tutor image"
                              />
                              {item?.avgRating && (
                                <span className="t_rating">
                                  <StarIcon />{" "}
                                  {item?.avgRating?.toFixed(1) || ""}
                                </span>
                              )}
                              <span className="t_fav" onClick={() => {
                                handleWishList(item)
                              }}>
                                {item?.isFav ? (
                                  <FavoriteIcon />
                                ) : (
                                  <FavoriteBorderIcon />
                                )}
                              </span>
                            </figure>
                            <div
                              className="tutor_info"
                              onClick={() =>
                                navigate(`/parent/tutor-detail/${item?._id}`)
                              }
                            >
                              <h2>{item?.name || ""}</h2>
                              <p>
                                {item?.classCount > 99
                                  ? "99+ classes"
                                  : `${item?.classCount ? item?.classCount : ""} ${item?.classCount > 1 ? "classes" : "class"}` ||
                                  ""}
                              </p>
                              <p>{item?.subjects && item?.subjects?.join(",") || ""}</p>
                              <ins>${item?.price || ""}/hour</ins>
                            </div>
                          </div>
                        ))}
                    </div>

                    <div className="dash_title">
                      <h2>Recomended Tutors</h2>
                      <Box
                        component="a"
                        onClick={() => navigate("/parent/recomended-tutor")}
                      >
                        View more <ArrowForwardIosIcon />
                      </Box>
                    </div>
                    <div className="tutor_list gap_m">
                      {loading
                        ? Array.from(new Array(4)).map((item, index) => (
                          <Skeleton
                            variant="rounded"
                            animation="wave"
                            width={210}
                            height={220}
                            key={index}
                            sx={{
                              bgcolor: "#FCFDFFEF",
                              borderRadius: "8px",
                            }}
                          />
                        ))
                        : recommended?.map((item, index) => (
                          <div className="tutor_item" key={item?._id}>
                            <figure>
                              <img
                                src={item?.image || "static/images/card1.png"}
                                alt="tutor image"
                              />
                              {item?.avgRating && (
                                <span className="t_rating">
                                  <StarIcon />{" "}
                                  {item?.avgRating?.toFixed(1) || ""}
                                </span>
                              )}
                              <span className="t_fav" onClick={() => {
                                handleWishList(item)
                              }}>
                                {item?.isFav ? (
                                  <FavoriteIcon />
                                ) : (
                                  <FavoriteBorderIcon />
                                )}
                              </span>
                            </figure>
                            <div
                              className="tutor_info"
                              onClick={() =>
                                navigate(`/parent/tutor-detail/${item?._id}`)
                              }
                            >
                              <h2>{item?.name || ""}</h2>
                              <p>
                                {item?.classCount > 99
                                  ? "99+ classes"
                                  : `${item?.classCount} ${item?.classCount > 1 ? "classes" : "class"}` ||
                                  ""}
                              </p>
                              <p>{item?.subjects && item?.subjects?.join(",") || ""}</p>
                              <ins>${item?.price || ""}/hour</ins>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </ParentLayout>

      <Drawer
        className="location_aside"
        anchor="right"
        open={open}
        onClose={toggleDrawer(false)}
      >
        <LocationDrawer toggleDrawer={toggleDrawer} />
      </Drawer>
    </>
  );
}
