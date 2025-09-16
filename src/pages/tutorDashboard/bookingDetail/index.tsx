/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState } from "react";
import { TutorLayout } from "../../../layout/tutorLayout";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Box, Button, Drawer } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CloseIcon from "@mui/icons-material/Close";
import CancelBookingModal from "../../../Modals/cancelBooking";
import StartJobModal from "../../../Modals/startJob";
import {
  useAcceptBookingMutation,
  useJobStatusMutation,
  useJoinVideoCallMutation,
  useLazyGetBookingByIdQuery,
} from "../../../service/tutorApi";
import { showError, showToast, showWarning } from "../../../constants/toast";
import Loader from "../../../constants/Loader";
import moment from "moment";
import { GoogleMap, MarkerF, PolylineF } from "@react-google-maps/api";
import useAuth from "../../../hooks/useAuth";
import { toast } from "sonner";
import { GRADE_TYPE_NAME } from "../../../constants/enums";

interface BookingDetails {
  _id: string; 
  date: string; 
  startTime: string;
  endTime: string; 
  distance: number; 
  bookingStatus: number;
  pairingType: number; 
  callJoinedByTutor: boolean;
  callJoinedByParent: boolean; 
}

export default function TutorBookingDetail() {
  const navigate = useNavigate();
  const user = useAuth();

  const location = useLocation();
  const { state } = location;

  const { id } = useParams();
  const [acceptOffer] = useAcceptBookingMutation();
  const [jobUpdate] = useJobStatusMutation();
  const [status, setStatus] = useState<number | null>(null);
  const [open1, setOpen1] = useState(false);
  const [otp, setOtp] = useState<string>("");
  const handleCloseModal1 = () => {
    setOpen1(false);
  };
  const [loading,setLoading] = useState(false)
  const [details, setDetails] = useState<any>();
  const [todayBookingObj,setTodayBookingObj] = useState<BookingDetails|null >(null);
  const [getById] = useLazyGetBookingByIdQuery();
  const [joinCallMethode]= useJoinVideoCallMutation()
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [open2, setOpen2] = useState(false);
  const handleCloseModal2 = () => {
    setOpen2(false);
  };
  
  
  const start = todayBookingObj?.startTime ? new Date(todayBookingObj.startTime).getTime() : 0;
  const end = todayBookingObj?.endTime ? new Date(todayBookingObj.endTime).getTime() : 0;
  const diffInMilliseconds = end - start;
  const minutes = Math.floor(diffInMilliseconds / (1000 * 60));

  const center = {
    lat: user?.latitude,
    lng: user?.longitude,
  };
  const locations = [
    { lat: user?.latitude, lng: user?.longitude }, // tutor point
    { lat: details?.address?.latitude, lng: details?.address?.longitude }, // parent point
  ];
  const path = [
    { lat: user?.latitude, lng: user?.longitude }, // tutor point
    { lat: details?.address?.latitude, lng: details?.address?.longitude }, // parent point
  ];
  
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await getById(id).unwrap();
      setIsLoading(false);
      if (res?.statusCode === 200) {
        setDetails(res?.data);
        const today = moment().format("YYYY-MM-DD");
        const matchingBookingDetail = res?.data?.bookingdetails?.find(
          (detail: any) => {
            if (detail?.bookingStatus !== 3) {
              const detailDate = moment(detail?.date).format('YYYY-MM-DD');
              console.log(detailDate,"detailDate");
              
              return detailDate === today;
            }
            // Match the date and the booking status
          },
        );
        setTodayBookingObj(matchingBookingDetail );
      }
    } catch (error: any) {
      showError(error?.data?.message);
    }
  };

  const statusCheck = (num: number): string => {
    switch (num) {
      case 1:
        return "PENDING";
      case 2:
        return "ACCEPTED";
      case 3:
        return "COMPLETED";
      case 4:
        return "REJECTED";
      case 5:
        return "CANCELLED";
      case 6:
        return "ONGOING";
      case 7:
        return "UPCOMING";
      default:
        return "UNKNOWN";
    }
  };

  const acceptOfferFun = async () => {
    let body = {
      bookingId: details?._id,
      pairingType:
        Number(details?.bookingStatus) === 2 ||
          Number(details?.bookingStatus) === 1
          ? 1
          : 2,
      bookingDetailId: details?.bookingdetails?.[0]?._id,
    };
    //    console.log(body, "body");

    try {
      const res = await acceptOffer(body).unwrap();
      if (res?.statusCode === 200) {
        showToast("Booking accepted");
        fetchData();
      }
    } catch (error: any) {
      showError(error?.data?.message);
    }
  };
 
  const getClassName = (item: any) => {
    //    console.log(item, "item in getClass");

    if (item === 1) {
      return "pending";
    } else if (item === 2) {
      return "accepted";
    } else if (item === 3) {
      return "completed";
    } else if (item === 5) {
      return "cancelled";
    } else if (item === 4) {
      return "cancelled";
    } else if (item === 6) {
      return "ongoing";
    } else {
      return "ongoing";
    }
  };

  const handleJoinOnlineClass = async (id:string) => {

    try {
      let body = {bookingDetailId: id};

      setLoading(true);
      const payload = await joinCallMethode(body).unwrap();   

      setLoading(false);
      if (payload?.statusCode === 200) {
        if(todayBookingObj?._id){
          navigate(`/zoom-call/${details?._id}?type=tutor`, {
            state: {
              data: {
                sessionName: todayBookingObj?._id,
                displayName: user?.name,
                roleType: "1",
                sessionIdleTimeoutMins: minutes ||"60",
              }
            }
          })
      }else{
        toast.warning("No bookings for today!")
      }
      }
    } catch (error: any) {
      setLoading(false);
      toast.error(error?.data?.message || '');
    }
  };

  const handleStartJob = () => {
    const today = moment().format("YYYY-MM-DD");

    const matchingBookingDetail = details?.bookingdetails?.find(
      (detail: any) => {
        if (detail?.bookingStatus !== 3) {
          const detailDate = moment(detail?.date).format("YYYY-MM-DD");
          return detailDate === today;
        }
        // Match the date and the booking status
      }
    );

    if (details?.bookingStatus === 6 || details?.bookingStatus === 2) {
      if (!matchingBookingDetail) {
        showWarning("No booking details match today's date");
        return;
      } else {
        setOpen2(true);
      }
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length < 4) {
      showWarning("Enter OTP");
      return;
    }
    const today = moment().format("YYYY-MM-DD");
    const matchingBookingDetail = details?.bookingdetails?.find(
      (detail: any) => {
        const detailDate = moment(detail?.date).format("YYYY-MM-DD");
        return detailDate === today;
      }
    );

    try {
      let body = {
        bookingId: details?._id,
        pairingType:
          Number(matchingBookingDetail?.bookingStatus) == 2 ||
            Number(matchingBookingDetail?.bookingStatus) == 1
            ? 1
            : 2,
        otp: otp,
        bookingDetailId: details?.bookingdetails?.[0]?._id,
      };

      const res = await jobUpdate({ body }).unwrap();
      if (res?.statusCode === 200) {
        if (
          Number(matchingBookingDetail?.bookingStatus) == 2 ||
          Number(matchingBookingDetail?.bookingStatus) == 1
        ) {
          if (details?.classModeOnline) {
            setOtp("");
            handleJoinOnlineClass(matchingBookingDetail?._id)
           
          } else {
            showToast(res?.message);
            setOtp("");
            navigate("/tutor/my-bookings", {
              state: {
                tab: 2,
              },
            });
          }
        } else {
          showToast(res?.message);
          setOtp("");
          navigate("/tutor/my-bookings", {
            state: {
              tab: 3,
            },
          });
        }
      }
    } catch (error: any) {
      //      console.log(error);
      showError(error?.data?.message || "");
    }
  };

  const renderHeadButtons = () => {
    switch (details?.bookingStatus) {
      case 2:
        return (
          <>
            <Button
              variant="outlined"
              style={{ backgroundColor: "#ffcccb" }}
              onClick={() => {
                setOpen1(true);
                setStatus(5);
              }}
            >
              Cancel Booking
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() =>
                navigate("/tutor/chat", {
                  state: {
                    bookingId: details?._id,
                    connectionId: details?.connectionId,
                    name: details?.parents?.name,
                    image: details?.parents?.image,
                    id: details?.data?.parents?._id,
                  },
                })
              }
            >
              <img src={`/static/images/chat_icon.svg`} alt="Icon" /> Chat
            </Button>
            <Button onClick={handleStartJob}>
              {details?.classModeOnline ? "Join Call" : "Start Job"}
            </Button>
            {details?.classModeOnline ? null : (
              <Button onClick={toggleDrawer(true)}>Track location</Button>
            )}
          </>
        );
      case 6:
        return (
          <>
            <Button
              variant="outlined"
              style={{ backgroundColor: "#ffcccb" }}
              onClick={() => {
                setOpen1(true);
                setStatus(5);
              }}
            >
              Cancel Booking
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() =>
                navigate("/tutor/chat", {
                  state: {
                    bookingId: details?._id,
                    connectionId: details?.connectionId,
                    name: details?.parents?.name,
                    image: details?.parents?.image,
                    // id:BookingDetails?.data?.tutors?._id
                  },
                })
              }
            >
              <img src={`/static/images/chat_icon.svg`} alt="Icon" /> Chat
            </Button>
            {details?.classModeOnline ? (
              <Button
                onClick={() => {
                  if(todayBookingObj?._id){
                  navigate(`/zoom-call/${details?._id}?type=tutor`, {
                    state: {
                      data: {
                        sessionName: todayBookingObj?._id,
                        displayName: user?.name,
                        roleType: "1",
                        sessionIdleTimeoutMins: minutes ||"60",
                      }
                    }
                  });
                }else{
                  toast.error("No booking available for today")
                }
                }}
              >
                Join Class
              </Button>
            ) : null}

            <Button onClick={handleStartJob}>
              {details?.classModeOnline ? "End Class" : "End Job"}
            </Button>
            {details?.classModeOnline ? null : (
              <Button onClick={toggleDrawer(true)}>Track location</Button>
            )}
          </>
        );
      case 1:
        return (
          <>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                setOpen1(true);
                setStatus(4);
              }}
            >
              Reject Booking
            </Button>
            <Button onClick={acceptOfferFun}> Accept Booking</Button>
          </>
        );
      default:
        return <></>;
    }
  };

  const [open, setOpen] = React.useState(false);
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };
  //  console.log(user, "useAuth");
  const DrawerList = (
    <Box className="location_inner" role="presentation">
      <div className="head">
        <button onClick={toggleDrawer(false)}>
          <CloseIcon />
        </button>
        <p>
          <strong>Current Location - 7958 Swift Village</strong>
          <span>EST : 10:00 AM</span>
        </p>
      </div>
      <div className="map">
        <GoogleMap
          mapContainerClassName="map_container"
          center={center}
          zoom={5}
          options={{
            fullscreenControl: false,
          }}
        >
          <PolylineF
            path={path}
            options={{
              strokeColor: "#0284c7", // Polyline color
              strokeOpacity: 1.0,
              strokeWeight: 5,
              geodesic: true,
              zIndex: 10000,
            }}
            visible={true}
            onLoad={() => {
              //              console.log("Polyline");
            }}
          />
          {locations.map((location, index) => (
            <MarkerF key={index} position={location} />
          ))}
        </GoogleMap>
      </div>
      <div className="info">
        <h2>
          <strong>Parent Detail</strong>
          {/* <Box component="a">
            View Details <ArrowForwardIosIcon />
          </Box> */}
        </h2>
        <div className="info_tutor">
          <figure>
            <img
              src={details?.parents?.image || `/static/images/userNew.png`}
              alt="Image"
            />
          </figure>
          <h3> {details?.parents?.name ? details?.parents?.name : "-"}</h3>
          <span>Subject</span>
          <strong>
            {details?.subjects?.[0]?.name
              ? details?.subjects?.[0]?.name
              : "-"}
          </strong>
        </div>
      </div>
    </Box>
  );

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <TutorLayout className="role-layout">
        <Loader isLoad={isLoading} />
        <main className="content">
          <section className="uhb_spc tBookingDetail_sc">
            <div className="conta_iner v2">
              <div className="role_head">
                <button
                  className="back_arrow"
                  onClick={() =>
                    state?.page === "home"
                      ? navigate("/tutor/dashboard")
                      : navigate("/tutor/my-bookings")
                  }
                >
                  <img src={`/static/images/back.png`} alt="Back" />
                </button>
                <h1 className="hd_3">Booking Detail</h1>
                <div className="rt_s">{renderHeadButtons()}</div>
              </div>
              <div className="role_body">
                <div className="detail_top gap_m">
                  <div
                    className={
                      `booking_item ` + getClassName(details?.bookingStatus)
                    }
                  >
                    <ul className="top">
                      <li>
                        <span>Date :</span>
                        <strong>
                          {moment(details?.bookingdetails?.[0]?.date).format(
                            "DD/MM/YYYY"
                          ) || "-"}
                        </strong>
                      </li>
                      <li>
                        <span>Mode :</span>
                        <strong>
                          {details?.classModeOnline ? "Online" : "Offline"}
                        </strong>
                      </li>
                      <li>
                        <span>Time :</span>
                        <strong>
                          {moment(
                            details?.bookingdetails?.[0]?.startTime
                          ).format("hh:mmA")}{" "}
                          -{" "}
                          {moment(details?.bookingdetails?.[0]?.endTime).format(
                            "hh:mmA"
                          ) || "-"}
                        </strong>
                      </li>
                    </ul>
                    <div className="infoBox">
                      <figure>
                        <img
                          src={
                            details?.parents?.image
                              ? details?.parents?.image
                              : `/static/images/user.png`
                          }
                          alt="Image"
                        />
                      </figure>
                      <h2>
                        {details?.parents?.name ? details?.parents?.name : "-"}
                      </h2>
                      <ul>
                        <li>
                          <span>Subject</span>
                          <strong>
                            {details?.subjects?.[0]?.name
                              ? details?.subjects?.[0]?.name
                              : "-"}
                          </strong>
                        </li>
                        {/* <li>
                                                    <span>Price</span>
                                                    <strong>$20/Hour</strong>
                                                </li> */}
                      </ul>
                      <p className="status">
                        {statusCheck(details?.bookingStatus)}
                      </p>
                    </div>
                  </div>
                  <div className="pay_detail">
                    <h2>Payment Details</h2>
                    <ul>
                      <li>
                        <strong>Class Price</strong>
                        <strong className="c_primary">
                          ${details?.totalPrice.toFixed(2) || "-"}
                        </strong>
                      </li>
                      <li>
                        <span>Transportation Fee</span>
                        <span>
                          {" "}
                          ${details?.totalTransportationFees.toFixed(2) || "0"}
                        </span>
                      </li>
                      <li>
                        <span>Service Tax Deduction</span>
                        <span>
                          {details?.serviceType === 1
                            ? `$${details?.serviceCharges || "0"}`
                            : `${details?.serviceCharges || "0"}%`}{" "}
                        </span>
                      </li>
                      <li>
                        <span>Tutor Fee</span>
                        <span> ${details?.tutorMoney?.toFixed(2) || "0"}</span>
                      </li>
                    </ul>
                    <p>
                      <DoneRoundedIcon /> Payment is completed
                    </p>
                  </div>
                </div>
                <div className="card_box">
                  <div className="cardBox_head">
                    <h2>Booking Details</h2>
                    <div className="rt_s">
                      <p>
                        Invoice Number -{" "}
                        <strong>#{details?.invoiceNo || "-"}</strong>
                      </p>
                    </div>
                  </div>
                  <div className="cardBox_body">
                    <ul
                      className="detail_list"
                      style={{ marginBottom: "10px" }}
                    >
                      {details?.bookingdetails?.length
                        ? details?.bookingdetails?.map((item: any) => {
                          return (
                            <>
                              <li>
                                <span>Date</span>
                                <strong>
                                  {moment(item?.date).format("DD/MM/YYYY") ||
                                    "-"}
                                </strong>
                              </li>
                              <li>
                                <span>Time</span>
                                <strong>
                                  {moment(item?.startTime).format("hh:mmA")} -{" "}
                                  {moment(details?.endTime).format("hh:mmA")}{" "}
                                </strong>
                              </li>
                              <li>
                                <span>Subjects</span>
                                <strong>
                                  {details?.subjects?.[0]?.name
                                    ? details?.subjects?.[0]
                                      ?.name
                                    : "-"}
                                </strong>
                              </li>
                              <li>
                                <span>Mode</span>
                                <strong>
                                  {details?.classModeOnline
                                    ? "Online"
                                    : "Offline"}
                                </strong>
                              </li>
                              <li>
                                <span>Level</span>
                                <strong>
                                  {details?.classId
                                    ? GRADE_TYPE_NAME[details?.classId]
                                    : "-"}
                                </strong>
                              </li>
                              <li>
                                <span>Hours</span>
                                <strong>
                                  {details?.totalNoOfHours
                                    ? details?.totalNoOfHours
                                    : "-"}
                                </strong>
                              </li>
                            </>
                          );
                        })
                        : ""}

                      {details?.classModeOnline ? null : (
                        <li>
                          <span>Address</span>
                          <strong>Home Address </strong>
                          <p>
                            {details?.address?.houseNumber
                              ? details?.address?.houseNumber
                              : "" + "," + details?.address?.country
                                ? details?.address?.country
                                : ""}
                          </p>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </TutorLayout>

      <Drawer
        className="location_aside"
        anchor="right"
        open={open}
        onClose={toggleDrawer(false)}
      >
        {DrawerList}
      </Drawer>

      <CancelBookingModal
        open={open1}
        onClose={handleCloseModal1}
        setOpen={setOpen1}
        id={details?._id}
        fetchBookings={fetchData}
        status={status}
      />

      <StartJobModal
        open={open2}
        onClose={handleCloseModal2}
        setOpen={setOpen2}
        otp={otp}
        setOtp={setOtp}
        handleVerifyOtp={handleVerifyOTP}
      />
    </>
  );
}
