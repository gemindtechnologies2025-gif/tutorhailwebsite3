/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ParentLayout } from "../../../layout/parentLayout";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Box, Button, Card, Drawer, Modal, Skeleton } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";
import CloseIcon from "@mui/icons-material/Close";
import RateNowModal from "../../../Modals/rateNow";
import LocationDrawer from "../common/locationDrawer";
import { useGetBookingDetailsQuery, useJoinVideoCallMutation } from "../../../service/booking";
import clsx from "clsx";
import moment from "moment";
import { showError, showToast } from "../../../constants/toast";
import CancelParentBooking from "../../../Modals/cancelParentBooking";
import { removeFromStorage } from "../../../constants/storage";
import { STORAGE_KEYS } from "../../../constants/storageKeys";
import { socket } from "../../../utils/socket";
import { BookingDetailsById } from "../../../types/General";
import { toast } from "sonner";
import useAuth from "../../../hooks/useAuth";
import { GRADE_TYPE_NAME } from "../../../constants/enums";

interface ParentBookingDetails {
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


export default function ParentBookingDetail() {
  const navigate = useNavigate(); // Hook for the navigation
  const location = useLocation();
  const { id } = useParams();
  const user = useAuth();

  // states
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState<boolean>(false);
  const [todayBookingObj, setTodayBookingObj] = useState<BookingDetailsById | null>(null);

  const [joinCallMethode] = useJoinVideoCallMutation()


  // API HOOKS
  const {
    data: BookingDetails,
    isError,
    isSuccess,
    isLoading,
  } = useGetBookingDetailsQuery({ Bookingid: id ? id : "" }); // api hook to fetch the booking details according to the id passed in the params


  const start = todayBookingObj?.startTime ? new Date(todayBookingObj.startTime).getTime() : 0;
  const end = todayBookingObj?.endTime ? new Date(todayBookingObj.endTime).getTime() : 0;
  const diffInMilliseconds = end - start;
  const minutes = Math.floor(diffInMilliseconds / (1000 * 60));

  const handleJoinOnlineClass = async (id: string) => {

    try {
      let body = { bookingDetailId: id };

      // setLoading(true);
      const payload = await joinCallMethode(body).unwrap();

      // setLoading(false);
      if (payload?.statusCode === 200) {
        if (todayBookingObj?._id) {
          navigate(`/zoom-call/${BookingDetails?.data?._id}?type=parent`, {
            state: {
              data: {
                sessionName: todayBookingObj?._id,
                displayName: user?.name,
                roleType: "0",
                sessionIdleTimeoutMins: minutes || "60",
              }
            }
          })
        } else {
          toast.warning("No bookings for today!")
        }
      }
    } catch (error: any) {
      // setLoading(false);
      toast.error(error?.data?.message || '');
    }
  };

  const handleCloseModal1 = () => {
    setOpen1(false);
  };

  const handleCloseModal2 = () => {
    setOpen2(false);
  };

  const getClassName = (classKey: any) => {
    switch (classKey.toString()) {
      case "0":
        return "Pre primary(Kg/Foundation)";
      case "1":
        return "Primary";
      case "2":
        return "Middle school (O-level)";
      case "3":
        return "High school (A-level)";
      case "4":
        return "College";
      case "5":
        return "Other";
      default:
        return "Unknown Class";
    }
  };
  const handleJoinCallByParent = () => {
    if (todayBookingObj?._id) {
      if (todayBookingObj?.callJoinedByParent) {
        navigate(`/zoom-call/${BookingDetails?.data?._id}?type=parent`, {
          state: {
            data: {
              sessionName: todayBookingObj?._id,
              displayName: user?.name,
              roleType: "0",
              sessionIdleTimeoutMins: minutes || "60",
            }
          }
        })
      } else {
        handleJoinOnlineClass(todayBookingObj?._id)
      }
    } else { toast.error("No booking available for today") }
  }

  const renderHeadButtons = (num: number) => {
    switch (num) {
      case 2:
        return (

          <>
            <Button
              onClick={() =>
                navigate("/parent/chat", {
                  state: {
                    bookingId: BookingDetails?.data?._id,
                    connectionId: BookingDetails?.data?.connectionId,
                    name: BookingDetails?.data?.tutors?.name,
                    image: BookingDetails?.data?.tutors?.image,
                    id: BookingDetails?.data?.tutors?._id,
                  },
                })
              }
            >
              <img src={`/static/images/chat_icon.svg`} alt="Icon" /> Chat
            </Button>
            {BookingDetails?.data?.classModeOnline ? (
              <Button
                onClick={() => {
                  navigate("/parent/pairing");
                  showToast(
                    "Please share OTP with the tutor to start call and try again"
                  );
                }}
              >
                Join Call
              </Button>
            ) : (
              <Button onClick={toggleDrawer(true)}>Track location</Button>
            )}
          </>
        );
      case 6:
        return (
          <>
            <Button
              variant="outlined"
              color="primary"
              onClick={() =>
                navigate("/parent/chat", {
                  state: {
                    bookingId: BookingDetails?.data?._id,
                    connectionId: BookingDetails?.data?.connectionId,
                    name: BookingDetails?.data?.tutors?.name,
                    image: BookingDetails?.data?.tutors?.image,
                  },
                })
              }
            >
              <img src={`/static/images/chat_icon.svg`} alt="Icon" /> Chat
            </Button>
            {BookingDetails?.data?.classModeOnline ? (
              <Button
                onClick={handleJoinCallByParent}

              >
                Join Call
              </Button>
            ) : (
              <Button onClick={toggleDrawer(true)}>Track location</Button>
            )}
          </>
        );
      //   case 1:
      //     return (
      //       <>
      //         <button
      //           className="iconText_btn"
      //           onClick={() => navigate("/parent/edit-booking")}
      //         >
      //           <EditOutlinedIcon /> Edit Booking
      //         </button>
      //       </>
      //     );
      case 3:
        return (
          <>
            <Button onClick={() => setOpen2(true)}>Rate Now</Button>
          </>
        );
      default:
        return <></>;
    }
  };

  const renderActionButtons = (num: number) => {
    switch (num) {
      case 1:
        return (
          <>
            <div className="action_btn">
              <Button
                variant="outlined"
                color="error"
                onClick={() => setOpen1(true)}
              >
                Cancel Booking and request refund
              </Button>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <div className="action_btn">
              <Button
                variant="outlined"
                color="error"
                onClick={() => setOpen1(true)}
              >
                Cancel Booking and request refund
              </Button>
            </div>
          </>
        );
      case 6:
        return (
          <>
            <div className="action_btn">
              <Button
                variant="outlined"
                color="error"
                onClick={() => setOpen1(true)}
              >
                Cancel Booking and request refund
              </Button>
            </div>
          </>
        );
      default:
        return <></>;
    }
  };

  // implementing switch case for the different cases which is for the booking
  const statusCheck = (num: number): string => {
    switch (num) {
      case 1:
        return "Pending";
      case 2:
        return "Accepted";
      case 3:
        return "Completed";
      case 4:
        return "Rejected";
      case 5:
        return "Cancelled";
      case 6:
        return "Ongoing";
      case 7:
        return "Upcoming";
      default:
        return "Unknown";
    }
  };

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const handleBookingClose = () => {
    setOpen3(false);
  };

  if (isError) {
    showError("Error occured");
  }

  useEffect(() => {
    removeFromStorage(STORAGE_KEYS.bookingDetails);
    removeFromStorage(STORAGE_KEYS.bookingSettings);
    removeFromStorage(STORAGE_KEYS.body);
  }, []);
  useEffect(() => {
    socket?.on("rating", () => {
      setOpen2(true);
    });
    return () => {
      // Clean up the socket listener when the component is unmounted
      socket?.off("rating", () => {
        setOpen2(false);
      });
    };
  }, []);

  useEffect(() => {
    if (isSuccess && BookingDetails) {
      const today = moment().format("YYYY-MM-DD");
      const matchingBookingDetail = BookingDetails?.data?.bookingdetails?.find(
        (detail: any) => {
          if (detail?.bookingStatus !== 3) {
            const detailDate = moment(detail?.date).format('YYYY-MM-DD');

            return detailDate === today;
          }
          // Match the date and the booking status
        },
      );
      setTodayBookingObj(matchingBookingDetail || null);
    }
  }, [isSuccess, BookingDetails]);

  return (
    <>
      <ParentLayout className="role-layout">
        <main className="content">
          <section className="uhb_spc pBookingDetail_sc">
            <div className="conta_iner v2">
              <div className="role_head">
                <button
                  className="back_arrow"
                  onClick={() => navigate("/parent/my-bookings")}
                >
                  <img src={`/static/images/back.png`} alt="Back" />
                </button>
                <h1 className="hd_3">Booking Detail</h1>
                <div className="rt_s">
                  {renderHeadButtons(BookingDetails?.data?.bookingStatus || 2)}
                </div>
              </div>
              <div className="role_body">
                <div className="detail_top gap_m">
                  {isLoading && <TutorCardSkeleton />}
                  {isSuccess && (
                    <div
                      className={clsx("booking_item", {
                        accepted: BookingDetails?.data?.bookingStatus === 2,
                        pending: BookingDetails?.data?.bookingStatus === 1,
                        completed: BookingDetails?.data?.bookingStatus === 3,
                        cancelled:
                          BookingDetails?.data?.bookingStatus === 5 ||
                          BookingDetails?.data?.bookingStatus === 4,
                        ongoing: BookingDetails?.data?.bookingStatus === 6,
                      })}
                    >
                      <ul className="top">
                        <li>
                          <span>Date :</span>
                          <strong>
                            {" "}
                            {moment(
                              BookingDetails?.data?.bookingdetails?.[0]?.date
                            ).format("DD/MM/YYYY") || "-"}
                          </strong>
                        </li>
                        <li>
                          <span>Mode :</span>
                          <strong>
                            {BookingDetails?.data?.classModeOnline ? "Online" : "Offline"}
                          </strong>
                        </li>
                        <li>
                          <span>Time :</span>
                          <strong>
                            {" "}
                            {moment(
                              BookingDetails?.data?.bookingdetails?.[0]?.startTime
                            ).format("hh:mmA")}{" "}
                            -{" "}
                            {moment(
                              BookingDetails?.data?.bookingdetails?.[0]?.endTime
                            ).format("hh:mmA") || "-"}
                          </strong>
                        </li>
                      </ul>
                      <div className="infoBox">
                        <figure>
                          <img
                            src={
                              BookingDetails?.data?.tutors?.image ||
                              `/static/images/userNew.png`
                            }
                            alt="Image"
                          />
                          <span>
                            {BookingDetails?.data?.tutors?.avgRating && (
                              <StarIcon />
                            )}
                            {BookingDetails?.data?.tutors?.avgRating?.toFixed(
                              1
                            ) || ""}
                            {BookingDetails?.data?.tutors?.classCount &&
                              `(${BookingDetails?.data?.tutors?.classCount})`}
                          </span>
                        </figure>
                        <h2>{BookingDetails?.data?.tutors?.name || ""}</h2>
                        <ul>
                          <li>
                            <span>Subject</span>
                            <strong>
                              {
                                BookingDetails?.data?.subjects?.[0]?.name
                                
                              }
                            </strong>
                          </li>

                          <li>
                            <span>Price</span>
                            <strong>
                              $
                              {BookingDetails?.data?.totalPrice ? BookingDetails?.data?.totalPrice?.toFixed(2):"0"} 
                              /Hour
                            </strong>
                          </li>
                        </ul>
                        <p className="status">
                          {statusCheck(
                            BookingDetails?.data?.bookingStatus || 0
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                  {isLoading && <PaymentDetailsSkeleton />}
                  {isSuccess && (
                    <div className="pay_detail">
                      <h2>Payment Details</h2>
                      <ul>
                        <li>
                          <span>Class Fees</span>
                          <span>
                            $
                            {BookingDetails?.data?.totalPrice?.toFixed(2) || ""}
                          </span>
                        </li>
                        <li>
                          <span>Service Fees</span>
                          <span>
                            $
                            {BookingDetails?.data?.serviceFees?.toFixed(2) ||
                              ""}
                          </span>
                        </li>
                        <li>
                          <span>Transport Fees</span>
                          <span>
                            $
                            {BookingDetails?.data?.totalTransportationFees
                              ? BookingDetails?.data?.totalTransportationFees >
                                0.01
                                ? BookingDetails?.data?.totalTransportationFees?.toFixed(
                                  2
                                )
                                : BookingDetails?.data?.totalTransportationFees?.toFixed(
                                  5
                                )
                              : "0"}
                          </span>
                        </li>
                        <li>
                          <strong>Total Price</strong>
                          <strong className="c_primary">
                            ${" "}
                            {BookingDetails?.data?.grandTotal?.toFixed(2) || ""}
                          </strong>
                        </li>
                      </ul>
                      <p>
                        <DoneRoundedIcon /> Paid via card
                      </p>
                    </div>
                  )}
                </div>
                {isLoading && <BookingDetailsSkeleton />}
                {isSuccess && (
                  <div className="card_box">
                    <div className="cardBox_head">
                      <h2>Booking Details</h2>
                    </div>
                    <div className="cardBox_body">
                      <ul className="detail_list">
                        <li>
                          <span>Date</span>
                          <strong>
                            {moment(
                              BookingDetails?.data?.bookingdetails?.[0]?.date
                            ).format("DD/MM/YYYY") || "-"}
                          </strong>
                        </li>
                        <li>
                          <span>Time</span>
                          <strong>
                            {moment(
                              BookingDetails?.data?.bookingdetails?.[0]?.startTime
                            ).format("hh:mmA")}{" "}
                            -{" "}
                            {moment(
                              BookingDetails?.data?.bookingdetails?.[0]?.endTime
                            ).format("hh:mmA") || "-"}
                          </strong>
                        </li>
                        <li>
                          <span>Subjects</span>
                          <strong>
                            {" "}
                            {
                              BookingDetails?.data?.subjects?.[0]?.name
                            }
                          </strong>
                        </li>
                        <li>
                          <span>Hours</span>
                          <strong>
                            {" "}
                            {BookingDetails?.data?.totalNoOfHours
                              ? BookingDetails?.data?.totalNoOfHours
                              : ""}
                          </strong>
                        </li>
                        <li>
                          <span> Mode</span>
                          <strong>
                            {" "}
                            {BookingDetails?.data?.classModeOnline
                              ? "Online"
                              : "Offline"}
                          </strong>
                        </li>

                        <li>
                          <span>Level</span>
                          <strong>
                            {" "}
                            {BookingDetails?.data?.classId
                              ? GRADE_TYPE_NAME[BookingDetails?.data?.classId]
                              : ""}
                          </strong>
                        </li>
                        {BookingDetails?.data?.classModeOnline ? null : (
                          <li>
                            <span>Address</span>
                            <strong>
                              {BookingDetails?.data?.parentAddress?.[0]
                                ?.addressType === 1
                                ? "Home address"
                                : BookingDetails?.data?.parentAddress?.[0]
                                  ?.addressType === 2
                                  ? "Office address"
                                  : "Other address"}
                            </strong>
                            <p>
                              {BookingDetails?.data?.parentAddress
                                ? `${BookingDetails?.data?.parentAddress?.[0]?.houseNumber},${BookingDetails?.data?.parentAddress[0]?.city},${BookingDetails?.data?.parentAddress[0]?.country}`
                                : ""}
                            </p>
                          </li>
                        )}
                      </ul>
                      {renderActionButtons(
                        BookingDetails?.data?.bookingStatus || 0
                      )}
                    </div>
                  </div>
                )}
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
        <LocationDrawer
          toggleDrawer={toggleDrawer}
          tutor={BookingDetails?.data?.tutors}
          price={BookingDetails?.data?.teachingdetails?.price}
        />
      </Drawer>

      <CancelBookingModalInside
        open={open1}
        onClose={handleCloseModal1}
        setOpen={setOpen1}
        status={
          BookingDetails?.data?.bookingStatus
            ? BookingDetails?.data?.bookingStatus
            : 0
        }
        setOpen1={setOpen3}
      />

      <CancelParentBooking
        open={open3}
        setOpen={setOpen3}
        id={BookingDetails?.data?._id}
        onClose={handleBookingClose}
      />

      <RateNowModal
        open={open2}
        onClose={handleCloseModal2}
        setOpen={setOpen2}
        id={id || ""}
        tutorId={BookingDetails?.data?.tutors?._id || ""}
      />
    </>
  );
}

function CancelBookingModalInside({
  open,
  onClose,
  setOpen,
  status,
  setOpen1,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setOpen1: Dispatch<SetStateAction<boolean>>;
  onClose: () => void;
  status: number;
}) {
  return (
    <Modal
      className="modal cancel_modal"
      id="cancelBookingModal"
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      open={open}
      onClose={onClose}
    >
      <div className="modal-dialog">
        <div className="modal-body">
          <div className="btn-close">
            <CloseIcon onClick={() => setOpen(false)} />
          </div>
          <h2>
            {status === 6
              ? " Are you sure you want to cancel this lesson"
              : " Are you sure you want to cancel this booking"}
          </h2>
          <Box
            display={"flex"}
            width={"100%"}
            alignItems={"center"}
            justifyContent={"space-evenly"}
            marginTop={"5px"}
          >
            <Button
              variant="outlined"
              color="error"
              onClick={onClose}
              sx={{
                width: "140px",
              }}
            >
              No
            </Button>
            <Button
              variant="outlined"
              color="primary"
              sx={{
                width: "140px",
              }}
              onClick={() => {
                onClose();
                setOpen1(true);
              }}
            >
              Yes
            </Button>
          </Box>
        </div>
      </div>
    </Modal>
  );
}

const TutorCardSkeleton = () => {
  return (
    <Card
      sx={{
        display: "flex",
        padding: 2,
        borderRadius: "12px",
        backgroundColor: "#f0f4f8",
        width: "45%",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Date and Time */}
          <Skeleton
            variant="rectangular"
            width={120}
            height={20}
            sx={{ borderRadius: "4px" }}
          />
          <Skeleton
            variant="rectangular"
            width={100}
            height={20}
            sx={{ borderRadius: "4px" }}
          />
        </Box>

        <Box sx={{ display: "flex", marginTop: 2 }}>
          {/* Image */}
          <Skeleton
            variant="rectangular"
            width={80}
            height={80}
            sx={{ borderRadius: "8px", marginRight: 2 }}
          />

          {/* Text Content */}
          <Box sx={{ flexGrow: 1 }}>
            <Skeleton variant="text" width="60%" height={25} />
            <Skeleton variant="text" width="40%" height={20} />
            <Skeleton variant="text" width="30%" height={20} />
          </Box>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
          {/* Status Button */}
          <Skeleton
            variant="rectangular"
            width={90}
            height={30}
            sx={{ borderRadius: "15px" }}
          />
        </Box>
      </Box>
    </Card>
  );
};

const PaymentDetailsSkeleton = () => {
  return (
    <Box
      sx={{
        padding: 3,
        backgroundColor: "#f0f4f8",
        borderRadius: "12px",
        width: "45%",
      }}
    >
      <Skeleton variant="text" width="40%" height={30} />

      {/* Horizontal Divider */}
      <Skeleton
        variant="rectangular"
        width="100%"
        height={1}
        sx={{ marginY: 2 }}
      />

      {/* Service Fees */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 2,
        }}
      >
        <Skeleton variant="text" width="30%" height={20} />
        <Skeleton variant="text" width="20%" height={20} />
      </Box>

      {/* Transport Fees */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 2,
        }}
      >
        <Skeleton variant="text" width="30%" height={20} />
        <Skeleton variant="text" width="20%" height={20} />
      </Box>

      {/* Total Price */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 2,
        }}
      >
        <Skeleton variant="text" width="40%" height={30} />
        <Skeleton variant="text" width="25%" height={30} />
      </Box>

      {/* Payment Status */}
      <Box sx={{ display: "flex", alignItems: "center", marginTop: 3 }}>
        <Skeleton
          variant="circular"
          width={24}
          height={24}
          sx={{ marginRight: 2 }}
        />
        <Skeleton variant="text" width="40%" height={20} />
      </Box>
    </Box>
  );
};

const BookingDetailsSkeleton = () => {
  return (
    <Box
      sx={{
        padding: 3,
        backgroundColor: "#f0f4f8",
        borderRadius: "12px",
        width: "100%",
        marginTop: "30px",
      }}
    >
      <Skeleton variant="text" width="30%" height={30} />

      {/* Horizontal Divider */}
      <Skeleton
        variant="rectangular"
        width="100%"
        height={1}
        sx={{ marginY: 2 }}
      />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 3,
        }}
      >
        {/* Date */}
        <Box>
          <Skeleton variant="text" width={60} height={20} />
          <Skeleton variant="text" width={120} height={25} />
        </Box>

        {/* Time */}
        <Box>
          <Skeleton variant="text" width={60} height={20} />
          <Skeleton variant="text" width={150} height={25} />
        </Box>

        {/* Subjects */}
        <Box>
          <Skeleton variant="text" width={60} height={20} />
          <Skeleton variant="text" width={60} height={25} />
        </Box>
      </Box>

      {/* Address */}
      <Box>
        <Skeleton variant="text" width={80} height={20} />
        <Skeleton variant="text" width="60%" height={25} />
        <Skeleton variant="text" width="50%" height={20} />
      </Box>

      {/* Cancel Button */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}>
        <Skeleton
          variant="rectangular"
          width={220}
          height={45}
          sx={{ borderRadius: "25px" }}
        />
      </Box>
    </Box>
  );
};
