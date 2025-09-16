/* eslint-disable jsx-a11y/img-redundant-alt */
import { ParentLayout } from "../../../layout/parentLayout";
import { useLocation, useNavigate } from "react-router-dom";
import StarIcon from "@mui/icons-material/Star";
import { Box, Button, CircularProgress, Skeleton } from "@mui/material";
import { useEffect, useState } from "react";
import { getFromStorage, removeFromStorage } from "../../../constants/storage";
import { STORAGE_KEYS } from "../../../constants/storageKeys";
import { useGetTutorByIdQuery } from "../../../service/tutorApi";
import clsx from "clsx";
import { BookingResponse, SettingResponse } from "../../../types/General";
import { useGetAddressQuery } from "../../../service/address";
import { useAddBookingCheckoutMutation } from "../../../service/booking";
import { showWarning } from "../../../constants/toast";
import { socket } from "../../../utils/socket";

interface TimeSlotBody {
  date: string; // ISO date string
  startTime: string; // ISO date string for start time
  endTime: string; // ISO date string for end time
  tutorId: string | undefined; // ID of the tutor
}

interface BookingBody {
  tutorId: string | undefined; // ID of the tutor
  subjectId: string[]; // ID of the subject
  parentAddressId?: string; // ID of the parent address
  distance: number; // Distance in kilometers
  latitude?: number | undefined; // Latitude of the location
  longitude?: number | undefined; // Longitude of the location
  timeSlots: TimeSlotBody[]; // Array of time slots
}

export default function ParentCheckout() {
  const navigate = useNavigate(); // hook for the navigation
  const location = useLocation();
  const { id } = location?.state;
  //  console.log(id, "state");

  // States
  const [bookingDetails, setBookingDetails] =
    useState<BookingResponse | null>();
  const [settings, setSettings] = useState<SettingResponse | null>();
  const [loading, setLoading] = useState<boolean>(false);

  // API hooks
  const { data, isSuccess, isError, isLoading } = useGetTutorByIdQuery(
    id ? { id } : { id: "" }
  ); // hook to fetch the tutor details

  const [addBooking] = useAddBookingCheckoutMutation();

  const addBookingMutation = async () => {
    try {
      setLoading(true);
      let body: BookingBody = getFromStorage(STORAGE_KEYS.body) as BookingBody;
      
      const res = await addBooking({
        isCartScreen: false,
        body: body,
      }).unwrap();
      if (res?.statusCode === 200) {
        setLoading(false);
        window.open(res?.data?.link?.redirect_url, "_self");
      }
    } catch (error: any) {
      //      console.log(error);
      setLoading(false);
      showWarning(error?.data?.message);
      navigate(`/parent/tutor-detail/${id}`);
    }
  };

  useEffect(() => {
    const bookingData = getFromStorage(STORAGE_KEYS.bookingDetails);
    const settingData = getFromStorage(STORAGE_KEYS.bookingSettings);
    if (bookingData) {
      setBookingDetails(bookingData as BookingResponse);
    } else {
      setBookingDetails(null);
    }

    if (settingData) {
      setSettings(settingData as SettingResponse);
    } else {
      setSettings(null);
    }
  }, []);

  const handlePaymentOk = (res: any) => {
    const paymentStatus =
      res?.data?.paymentDetails?.payment_status_description || "";
    //    console.log(res, "socket");
    if (paymentStatus === "Completed") {
      navigate("/parent/my-bookings");
    } else {
      navigate("/parent/schedule-booking/" + bookingDetails?.tutorId);
    }
  };
  useEffect(() => {
    socket?.on("payment_ok", handlePaymentOk);
    return () => {
      // Clean up the socket listener when the component is unmounted
      socket?.off("payment_ok", handlePaymentOk);
    };
  }, []);

  return (
    <>
      <ParentLayout className="role-layout">
        <main className="content">
          <section className="uhb_spc pCheckout_sc">
            <div className="conta_iner v2">
              <div className="role_head">
                <button
                  className="back_arrow"
                  onClick={() =>
                    navigate("/parent/tutor-detail/" + bookingDetails?.tutorId)
                  }
                >
                  <img src={`/static/images/back.png`} alt="Back" />
                </button>
                <h1 className="hd_3">Checkout</h1>
              </div>
              <div className="role_body">
                <div className="tutorDetail_box">
                  {isLoading ? (
                    <Skeleton
                      animation="wave"
                      width={340}
                      height={240}
                      variant="rounded"
                    />
                  ) : (
                    <figure className="lt_s">
                      <img
                        src={data?.data[0]?.image || `/static/images/userNew.png`}
                        alt="Image"
                      />
                      <span>
                        <StarIcon />
                        {data?.data[0]?.avgRating?.toFixed(1) || ""}{" "}
                        {`(${data?.data[0]?.ratingCount || ""})`}
                      </span>
                    </figure>
                  )}
                  <div className="rt_s">
                    {isLoading ? null : (
                      <span className="highlight">
                        <img
                          src={`/static/images/star_badge_icon.svg`}
                          alt="Image"
                        />{" "}
                        {
                          data?.data[0]?.teachingdetails
                            ?.totalTeachingExperience
                        }
                        + year Experience
                      </span>
                    )}
                    <h2>
                      {isLoading ? (
                        <Skeleton variant="text" width={150} height={50} />
                      ) : (
                        data?.data[0]?.name || ""
                      )}
                    </h2>
                    {isLoading ? (
                      <Skeleton variant="text" width={100} height={30} />
                    ) : (
                      <p>
                        <figure>
                          <img
                            src={`/static/images/address_icon.svg`}
                            alt="Icon"
                          />
                        </figure>{" "}
                        {data?.data[0]?.address || ""}
                      </p>
                    )}
                    <span
                      className={clsx({
                        cancelled: !data?.data[0]?.isActive && !isLoading,
                        tag: data?.data[0]?.isActive && !isLoading,
                      })}
                    >
                      {isLoading ? (
                        <Skeleton variant="text" width={150} height={60} />
                      ) : data?.data[0]?.isActive ? (
                        "Available"
                      ) : (
                        "Unavailable"
                      )}
                    </span>
                    <hr />
                    <div className="flex">
                      <p>
                        <span>Price</span>
                        {isLoading ? (
                          <Skeleton variant="text" width={150} height={60} />
                        ) : (
                          <strong>
                            ${data?.data[0]?.teachingdetails?.price || ""}/Hour
                          </strong>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="card_box v2">
                  <div className="cardBox_head">
                    <h2>Booking Detail</h2>
                    {/* <IconButton
                      className="roundIcon_btn"
                      onClick={() => navigate("/parent/schedule-booking")}
                    >
                      <EditOutlinedIcon />
                    </IconButton> */}
                  </div>
                  <div className="cardBox_body">
                    <ul className="detail_list">
                      <li>
                        <span>Class fee</span>
                        <strong>
                          {" "}
                          ${data?.data[0]?.teachingdetails?.price || ""}/Hour
                        </strong>
                      </li>
                      <li>
                        <span>
                          Service fee ({" "}
                          {settings?.serviceType === 1 ? "flat" : "%"})
                        </span>
                        <strong>{settings?.serviceFees || 0}</strong>
                      </li>
                      <li>
                        <span>Transportation fee</span>
                        <strong>
                          {(bookingDetails?.totalTransportationFees &&
                            (bookingDetails.totalTransportationFees > 0.01
                              ? `$${bookingDetails.totalTransportationFees.toFixed(2)}`
                              : `$${bookingDetails.totalTransportationFees.toFixed(5)}`)) ||
                            "-"}
                        </strong>
                      </li>
                      {/* <li>
                        <span>Address</span>
                        <strong>Home Address</strong>
                        <p>3711 Spring Downtown New York, United States </p>
                      </li> */}
                    </ul>
                    <div className="form_bottom">
                      <p>
                        <span>Total Charges</span>
                        <strong>
                          $
                          {Number(bookingDetails?.grandTotal)?.toFixed(2) || ""}
                        </strong>
                      </p>
                      <div className="form_btn">
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => navigate("/parent/search-result")}
                        >
                          Cancel
                        </Button>
                        <Button onClick={addBookingMutation} disabled={loading}>
                          {loading ? (
                            <Box display="flex" gap={2} alignItems="center">
                              <CircularProgress color="inherit" size={20} />
                              &nbsp;Loading
                            </Box>
                          ) : (
                            "Proceed to Pay"
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </ParentLayout>
    </>
  );
}
