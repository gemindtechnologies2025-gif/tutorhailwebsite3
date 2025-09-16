/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState } from "react";
import { TutorLayout } from "../../../layout/tutorLayout";
import {
  Box,
  Button,
  FormControlLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Switch,
} from "@mui/material";
import CancelBookingModal from "../../../Modals/cancelBooking";
import { useNavigate } from "react-router-dom";
import {
  useAcceptBookingMutation,
  useLazyGetBookingsQuery,
  useLazyGetTutorDashboardQuery,
} from "../../../service/tutorApi";
import { showError, showToast } from "../../../constants/toast";
import Loader from "../../../constants/Loader";
import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import { useUpdateProfileMutation } from "../../../service/auth";
import useAuth from "../../../hooks/useAuth";
import moment from "moment";
import NewSideBarTutor from "../../../components/NewSideBarTutor";
import TutorListing from "../../../components/TutorListing";
import { getFromStorage, setToStorage } from "../../../constants/storage";
import { STORAGE_KEYS } from "../../../constants/storageKeys";
import { useAppDispatch } from "../../../hooks/store";
import { setCredentials } from "../../../reducers/authSlice";

export default function TutorDashboard() {
  const navigate = useNavigate();

  const [open1, setOpen1] = useState(false);
  const handleCloseModal1 = () => {
    setOpen1(false);
  };
  const token = getFromStorage(STORAGE_KEYS.token);
  const [id, setId] = useState<string>("");
  const [dashboardApi] = useLazyGetTutorDashboardQuery();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dashData, setDashData] = useState<any>();
    const dispatch = useAppDispatch();
  const [yearType, setYearType] = React.useState<string>("daily");
  const handleChange = (event: SelectChangeEvent) => {
    setYearType(event.target.value as string);
  };
  const user = useAuth();
  const [graphData, setGraphData] = useState<any>([]);
  const [updateStatus] = useUpdateProfileMutation();
  const [active, setActive] = useState<boolean>(user?.isActive);
  const currentDate = new Date();
  const [bookings, setBookings] = useState<any>([]);
  const [acceptOffer] = useAcceptBookingMutation();

  const fetchDashboard = async () => {
    try {
      setIsLoading(true);
      const res = await dashboardApi({ type: yearType }).unwrap();
      setIsLoading(false);
      if (res?.statusCode === 200) {
        setDashData(res?.data);
        setGraphData(res?.data?.revenuesGraph);
        setBookings(res?.data?.booking?.data);
      }
    } catch (error: any) {
      setIsLoading(false);
      showError(error?.data?.message);
    }
  };

  const acceptOfferFun = async (item: any) => {
    let body = {
      bookingId: item?._id,
      pairingType:
        Number(item?.bookingStatus) === 2 || Number(item?.bookingStatus) === 1
          ? 1
          : 2,
      bookingDetailId: item?.bookingdetails?.[0]?._id,
    };

    try {
      const res = await acceptOffer(body).unwrap();
      if (res?.statusCode === 200) {
        showToast("Booking accepted successfully");
        navigate("/tutor/my-bookings");
      }
    } catch (error: any) {
      showError(error?.data?.message);
    }
  };

  const weekdays = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
  ];

  const processedGraphData = graphData?.map((item: any) => ({
    ...item,
    name: weekdays.includes(item.name) ? item.name.slice(0, 3) : item.name,
  }));

  const changeStatus = async (act: boolean) => {
    const body = {
      isActive: act,
    };
    //        console.log(body, "body of active");

    try {
      setIsLoading(true);
      const res = await updateStatus(body).unwrap();
      setIsLoading(false);
      setToStorage(STORAGE_KEYS.user, res?.data || null);
      
              dispatch(
                setCredentials({
                  user: res?.data || null,
                  token: token || null,
                })
              );
    } catch (error: any) {
      showError(error?.data?.message);
    }
  };



  function convertToInternationalCurrencySystem(labelValue: number) {
    return Math.abs(Number(labelValue)) >= 1.0e9
      ? (Math.abs(Number(labelValue)) / 1.0e9).toFixed(2) + " B"
      : // Ssix Zeroes for Millions
        Math.abs(Number(labelValue)) >= 1.0e6
        ? (Math.abs(Number(labelValue)) / 1.0e6).toFixed(2) + " M"
        : // Three Zeroes for Thousands
          Math.abs(Number(labelValue)) >= 1.0e3
          ? (Math.abs(Number(labelValue)) / 1.0e3).toFixed(2) + " K"
          : Math.abs(Number(labelValue));
  }



  const chartSetting = {
    yAxis: [
      {
        label: "Earnings($)",
        tickLabelVisible: false,
        tickVisible: false,
      },
    ],
    series: [
      {
        dataKey: "value",
        color: "url(#gradientColor)", // Apply the gradient here
        radius: 40, // Apply radius to the bars
        convertToInternationalCurrencySystem,
      },
    ],
    height: 300,
    sx: {
      // [`& .${axisClasses.directionY} .${axisClasses.label}`]: {
      //     transform: 'translateX(-10px)',
      // },
      [`& .${axisClasses.directionY} .${axisClasses.tickLabel}`]: {
        display: "none",
      },
      [`& .${axisClasses.directionY} .${axisClasses.tick}`]: {
        display: "none",
      },
    },
  };

  const navigationLink = (item: any): string => {
    switch (item?.bookingStatus) {
      case 1:
        return `/tutor/booking-detail/pending/${item?._id}`;
      case 2:
        return `/tutor/booking-detail/accepted/${item?._id}`;
      case 3:
        return `/tutor/booking-detail/completed/${item?._id}`;
      case 4:
        return `/tutor/booking-detail/cancelled/${item?._id}`;
      case 5:
        return `/tutor/booking-detail/cancelled/${item?._id}`;
      case 6:
        return `/tutor/booking-detail/ongoing/${item?._id}`;
      default:
        return `/tutor/booking-detail/ongoing/${item?._id}`;
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [yearType]);

  useEffect(() => {
    setActive(user?.isActive);
  }, [user]);


  return (
    <>
      <TutorLayout className="role-layout">
        <Loader isLoad={isLoading} />
        <main className="content">
          <section className="uh_spc tDashboard_sc home_wrp">
            <div className="conta_iner v2">
              <div className="mn_fdx">
                  <NewSideBarTutor/>
              <div className="mdl_cntnt">
              <div className="dashboard_flex ">
                <div className=" ">
                  <div className="white_box">
                    <div className="account_stat">
                      <figure>
                        <img
                          className="offline"
                          src={`/static/images/offline_icon.svg`}
                          alt="Icon"
                        />
                        <img
                          className="online"
                          src={`/static/images/online_icon.svg`}
                          alt="Icon"
                        />
                      </figure>
                      <p>
                        <strong>
                          {active ? "You are online" : "You are offline"}
                        </strong>
                        <span> Please look your order!</span>
                      </p>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={active}
                            onClick={() => {
                              setActive(!active);
                              changeStatus(!active);
                            }}
                          />
                        }
                        label=""
                      />
                    </div>
                    <ul className="stats gap_m">
                      {/* <li>
                        <strong>
                          {" "}
                          {dashData?.totalEarnings !== undefined
                            ? dashData?.totalEarnings >= 1000000
                              ? `$ ${(
                                  dashData?.totalEarnings / 1000000
                                ).toFixed(1)} m`
                              : "$" +
                                convertToInternationalCurrencySystem(
                                  dashData?.totalEarnings
                                ).toLocaleString()
                            : "0"}
                        </strong>
                        <span>Earning</span>
                      </li> */}
                      <li>
                        <strong>
                          {dashData?.totalBooking ? dashData?.totalBooking : 0}
                        </strong>
                        <span>Total Booking</span>
                      </li>
                      <li>
                        <strong>
                          {dashData?.newBookingCount ? dashData?.newBookingCount : 0}
                        </strong>
                        <span>New Booking</span>
                      </li>
                      <li>
                        <strong>
                          {dashData?.followers
                            ? dashData?.followers
                            : 0}
                        </strong>
                        <span>Followers</span>
                      </li>
                        <li>
                        <strong>
                        {dashData?.totalGifts !== undefined
                            ? dashData?.totalGifts >= 1000000
                              ? `$ ${(
                                  dashData?.totalGifts / 1000000
                                ).toFixed(1)} m`
                              : "$" +
                                convertToInternationalCurrencySystem(
                                  dashData?.totalGifts
                                ).toLocaleString()
                            : "0"}
                        </strong>
                        <span>Total Gifts</span>
                      </li>
                    </ul>
                  </div>
                  <div className="white_box">
                    <div className="head">
                      <div className="lt">
                        <h2>Revenue Report</h2>
                        <p>{moment(currentDate).format("ddd, Do MMM, YY")}</p>
                      </div>
                      <div className="rt">
                        <div className="control_group">
                          <Select
                            labelId="yearType-label"
                            id="yearType"
                            value={yearType}
                            onChange={handleChange}
                          >
                            <MenuItem value="daily">Daily</MenuItem>
                            <MenuItem value="weekly">Weekly</MenuItem>
                            <MenuItem value="monthly">Monthly</MenuItem>
                            <MenuItem value="yearly">Yearly</MenuItem>
                          </Select>
                        </div>
                      </div>
                    </div>
                    <div style={{ width: "100%", display: "flex" }}>
                      <svg width="0" height="0">
                        <defs>
                          <linearGradient
                            id="gradientColor"
                            x1="0%"
                            y1="100%"
                            x2="0%"
                            y2="0%"
                          >
                            <stop
                              offset="0%"
                              style={{ stopColor: "#076221", stopOpacity: 1 }}
                            />
                            <stop
                              offset="100%"
                              style={{ stopColor: "#05A633", stopOpacity: 1 }}
                            />
                          </linearGradient>
                        </defs>
                      </svg>
                      <BarChart
                        dataset={processedGraphData ? processedGraphData : []}
                        xAxis={[
                          {
                            scaleType: "band",
                            dataKey: "name",
                            tickPlacement: "middle",
                            tickLabelPlacement: "tick",
                          },
                        ]}
                        {...chartSetting}
                      />
                    </div>
                  </div>
                </div>
              </div>
              </div>

              <div className="sidebar_rt">
                  <TutorListing tutor={true}/>
              </div>
              </div>
              {/* <div className="location_bar">
                                <figure><img src={`/static/images/address_icon.svg`} alt="Icon" /></figure>
                                <h1>New York, United States</h1>
                                <Box component="a">Change</Box>
                            </div> */}
              
                {/* <div className="rt_s">
                  <div className="white_box">
                    <div className="head">
                      <div className="lt">
                        <h2>Recent Bookings</h2>
                      </div>
                      {bookings?.length ? (
                        <div className="rt">
                          <Box
                            component="a"
                            onClick={() => navigate("/tutor/my-bookings")}
                          >
                            View all
                          </Box>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="book_list">
                      {bookings?.length
                        ? bookings
                            .slice(0, 5)
                            .map((item: any, index: number) => {
                              return (
                                <div
                                  className="single"
                                  onClick={() =>
                                    navigate(navigationLink(item), {
                                      state: { page: "home" },
                                    })
                                  }
                                >
                                  <span className="tag pending">PENDING</span>
                                  <figure>
                                    <img
                                      src={
                                        item?.parents?.image
                                          ? item?.parents?.image
                                          : `/static/images/user.png`
                                      }
                                      alt="Image"
                                    />
                                  </figure>
                                  <div className="info">
                                    <h3>{item?.parents?.name || "-"}</h3>
                                    <p>
                                      {item?.subjectspecializations[0]?.name ||
                                        "-"}
                                    </p>
                                    <p>
                                      <strong>
                                        {moment(
                                          item?.bookingdetails[0]?.startTime
                                        ).format("h:mm A") +
                                          " - " +
                                          moment(
                                            item?.bookingdetails[0]?.endTime
                                          ).format("h:mm A") || "-"}
                                      </strong>
                                    </p>

                                    <div className="flex_btn">
                                      <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setOpen1(true);
                                          setId(item?._id);
                                        }}
                                      >
                                        Reject Booking
                                      </Button>
                                      <Button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          acceptOfferFun(item);
                                        }}
                                      >
                                        Accept Booking
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                        : ""}
                    </div>
                  </div>
                </div> */}
            </div>
          </section>
        </main>
      </TutorLayout>

      <CancelBookingModal
        open={open1}
        onClose={handleCloseModal1}
        setOpen={setOpen1}
        id={id}
        fetchBookings={fetchDashboard}
        status={4}
      />
    </>
  );
}
