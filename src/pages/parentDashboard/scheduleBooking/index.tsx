/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState } from "react";
import { ParentLayout } from "../../../layout/parentLayout";
import { useNavigate, useParams } from "react-router-dom";
import StarIcon from "@mui/icons-material/Star";
import {
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Button,
  Drawer,
  InputAdornment,
  Skeleton,
  Box,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AddressDrawer from "../common/addressDrawer";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import CloseIcon from "@mui/icons-material/Close";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SelectDateModal from "../../../Modals/selectDate";
import SelectTimeModal from "../../../Modals/selectTime";
import { useGetTutorByIdQuery } from "../../../service/tutorApi";
import clsx from "clsx";
import { useGetAddressQuery } from "../../../service/address";
import { showError, showWarning } from "../../../constants/toast";
import {
  useAddBookingMutation,
  useFetchTimeSlotsQuery,
} from "../../../service/booking";
import moment from "moment";
import useAuth from "../../../hooks/useAuth";
import { GOOGLE_API_KEY } from "../../../constants/url";
import { getFromStorage, setToStorage } from "../../../constants/storage";
import { STORAGE_KEYS } from "../../../constants/storageKeys";
import axios from "axios";
import { isString } from "formik";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import LoginAlertModal from "../../../Modals/LoginAlertModal";
import { skipToken } from "@reduxjs/toolkit/query";
import ChooseClassTypeModal from "../../../Modals/ChooseClassTypeModal";
type Coordinates = {
  parentLatitude: number;
  parentLongitude: number;
  tutorLatitude: number;
  tutorLongitude: number;
};
type TimeType = {
  start: string;
  end: string;
};
export default function ParentScheduleBooking() {
  const navigate = useNavigate(); // hook for the navigation
  const user = useAuth(); // hook to get the current user details from reducer
  //  console.log(user, "user");
  const { id } = useParams(); // fetching id from the params

  // states
  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [open3, setOpen3] = React.useState(false);

  const [teachingSlots, setTeachingSlots] = useState<
    { start: string; end: string }[]
  >([]);

  const [err, setErr] = useState<boolean>(false);
  const [err1, setErr1] = useState<boolean>(false);
  const [learning, setLearning] = useState<string>("");
  const [customStart, setCustomStart] = useState<string | null>(null);
  const [customEnd, setCustomEnd] = useState<string | null>(null);
  const [additional, setAdditional] = useState<string>("");
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState(-1);
  const token: string = getFromStorage(STORAGE_KEYS.token) as string;
  const [bookSlots, setBookSlots] = useState<any>();
  const [selectedAddress, setSelectedAddress] = useState<string>(""); // state to store the selected address of the user
  const [subject, setSubject] = useState<string>("");
  const [level, setLevel] = useState<string>("");
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [value, setValue] = useState<Date[]>([]);
  const [time, setTime] = useState<TimeType>({
    start: "",
    end: "",
  });
  const [loading, setLoading] = useState(false);
  const [skips, setSkips] = useState<boolean>(true);
  const [classMode, setClassMode] = useState<string>("1");
  // API hooks
  const { data, isSuccess, isError, isLoading } = useGetTutorByIdQuery(
    id ? { id } : { id: "" }
  ); // hook to fetch the tutor details

  useEffect(() => {
    if (token) {
      setSkips(false);
    }
  }, [token]);

  const {
    data: address,
    isLoading: load,
    isSuccess: success,
    isError: error,
  } = useGetAddressQuery({ name: "" }, { skip: skips });

  const handleClose = () => {
    setOpenAlert(false);
  };

  const {
    data: timeSlot,
    isSuccess: timeSuccess,
    isError: timeError,
    isLoading: timeLoad,
  } = useFetchTimeSlotsQuery(id ? { id } : { id: "" }); // hook to fetch the timeSlot of the tutor

  const [addBooking] = useAddBookingMutation();

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const handleCloseModal2 = () => {
    setOpen2(false);
  };

  const handleCloseModal3 = () => {
    setOpen3(false);
  };

  const makeSlots = (
    start: string,
    end: string,
    format: string = "D/M/YYYY, h:mm:ss a"
  ) => {
    // Parse the dates with the specified format
    const startTime = moment(start, format);
    const endTime = moment(end, format);

    if (!startTime.isValid() || !endTime.isValid()) {
      console.error("Invalid date format");
      setTeachingSlots([]);
      return;
    }

    // Check if endTime is before startTime
    if (endTime.isBefore(startTime)) {
      console.error("End time cannot be before start time");
      setTeachingSlots([]); // or handle it as per your requirement
      return;
    }

    // Calculate the difference in hours
    let hours = endTime.diff(startTime, "hours");

    let slots = [] as any;
    let slotStartTime = null as any;
    let slotEndTime = null as any;

    for (let hour = 0; hour < hours; hour++) {
      slotEndTime = slotStartTime
        ? moment(slotStartTime).add(1, "hour")
        : moment(startTime).add(1, "hour");

      if (moment(slotEndTime).isAfter(endTime)) {
        break;
      }

      slots.push({
        start: moment(slotStartTime || startTime),
        end: moment(slotEndTime),
      });
      slotStartTime = moment(slotEndTime).add(30, "minutes");
    }

    setTeachingSlots(slots);
  };

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedAddress(event.target.value);
  };
  const handleSubjectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSubject(event.target.value);
  };
  const handleModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setClassMode(event.target.value);
  };
  const handleLevelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLevel(event.target.value);
  };

  //  implementing distance calculation between tutor and parent
  const fetchTravelTime = ({
    parentLatitude,
    parentLongitude,
    tutorLatitude,
    tutorLongitude,
  }: Coordinates): Promise<number | undefined> => {
    return new Promise((resolve, reject) => {
      //      console.log(
      //   parentLatitude,
      //   parentLongitude,
      //   tutorLatitude,
      //   tutorLongitude
      // );
      const matrix = new google.maps.DistanceMatrixService();
      matrix.getDistanceMatrix(
        {
          origins: [new google.maps.LatLng(parentLatitude, parentLongitude)],
          destinations: [new google.maps.LatLng(tutorLatitude, tutorLongitude)],
          travelMode: google.maps.TravelMode.DRIVING,
        },
        function (response, status) {
          if (status === "OK") {
            const travelInfo = response?.rows[0]?.elements[0];
            //            console.log(travelInfo);
            const distanceInMetres = travelInfo?.distance?.value;
            //            console.log(distanceInMetres, "body");
            resolve(distanceInMetres);
          } else {
            reject(`Error fetching distance matrix: ${status}`);
          }
        }
      );
    });
  };

  const handleReset = () => {
    setSelectedAddress("");
    setSubject("");
    setSelectedDates([]);
    setSelectedTime(-1);
    setValue([]);
    setTime({
      start: "",
      end: "",
    });
  };
  //  console.log(time, "time");
  const addBookingMutation = async () => {
    try {
      if (!classMode) {
        showWarning("Please select class mode");
        return;
      }
      if (!selectedAddress) {
        showWarning("Please select address");
        return;
      }
      if (!subject) {
        showWarning("Please select subject");
        return;
      }
      if (!level) {
        showWarning("Please select class level");
        return;
      }

      if (!selectedDates?.length) {
        showWarning("Please select date");
        return;
      }
      if (selectedTime === -1 && customEnd === null && customStart === null) {
        showWarning("Please select time");
        return;
      }
      if (err) {
        return;
      }
      if (err1) {
        return;
      }
      let distance;
      if (classMode === "2") {
        distance = await fetchTravelTime({
          parentLatitude:
            address?.data?.address?.filter(
              (item) => item?.id === selectedAddress
            )[0]?.latitude ?? 0,
          parentLongitude:
            address?.data?.address?.filter(
              (item) => item?.id === selectedAddress
            )[0]?.longitude ?? 0,
          tutorLatitude: data?.data[0]?.latitude ? data?.data[0]?.latitude : 0,
          tutorLongitude: data?.data[0]?.longitude ? data?.data[0]?.longitude : 0,
        });
      }


      const sessionData = selectedDates?.map((date) => {
        const finalSlot = teachingSlots?.filter(
          (slot) =>
            !(
              selectedDates?.includes(moment().format("YYYY-MM-DD")) &&
              moment(slot?.start)
                .set({
                  date: moment().get("date"),
                  month: moment().get("month"),
                  year: moment().get("year"),
                })
                .isBefore(moment())
            )
        );
        const startT = finalSlot[selectedTime]?.start;
        const endT = finalSlot[selectedTime]?.end;

        let start_time = customStart
          ? moment(customStart)
            .set({
              date: moment(date).get("date"),
              month: moment(date).get("month"),
              year: moment(date).get("year"),
            })
            .toISOString()
          : moment(startT)
            .set({
              date: moment(date).get("date"),
              month: moment(date).get("month"),
              year: moment(date).get("year"),
            })
            .toISOString();

        let end_time = customEnd
          ? moment(customEnd)
            .set({
              date: moment(date).get("date"),
              month: moment(date).get("month"),
              year: moment(date).get("year"),
            })
            .toISOString()
          : moment(endT)
            .set({
              date: moment(date).get("date"),
              month: moment(date).get("month"),
              year: moment(date).get("year"),
            })
            .toISOString();

        return {
          date: new Date(date).toISOString(),
          startTime: start_time,
          endTime: end_time,
          tutorId: data?.data[0]?._id,
        };
      });

      setLoading(true);
      let body = {
        tutorId: data?.data[0]?._id,
        subjectId: [subject],
        distance: distance ? distance : 0,
        classId: level,
        timeSlots: sessionData,
        additionalInfo: additional,
        learnToday: learning,
        classModeOnline: classMode === "1" ? true : false,
        // ...(classMode === "2" ? { distance: distance ? distance : 0 }:{}),
        ...(classMode === "2" ? { parentAddressId: selectedAddress } : {}),
        ...(classMode === "2"
          ? {
            latitude: address?.data?.address?.filter(
              (item) => item?.id === selectedAddress
            )[0]?.latitude,
          }
          : {}),
        ...(classMode === "2"
          ? {
            longitude: address?.data?.address?.filter(
              (item) => item?.id === selectedAddress
            )[0]?.longitude,
          }
          : {}),
      };

      console.log(body, "body ji");

      const res = await addBooking({ body, isCartScreen: true }).unwrap();
      setLoading(false);
      if (res?.statusCode === 200) {
        //        console.log(res?.data?.booking);
        setToStorage(STORAGE_KEYS.bookingDetails, res?.data?.booking);
        setToStorage(STORAGE_KEYS.bookingSettings, res?.data?.setting);
        setToStorage(STORAGE_KEYS.body, body);
        navigate("/parent/checkout", {
          state: {
            id: id,
          },
        });
      }
    } catch (error: any) {
      setLoading(false);
      showError(error?.data?.message);
    }
  };

  if (isError || error) {
    showError("Error occured while fetching data");
  }

  const getLevelName = (item: string) => {
    switch (item) {
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
        return "Other";
    }
  };

  const resetTime = () => {
    setSelectedTime(-1);
    setTime({
      start: "",
      end: "",
    });
    setCustomEnd(null);
    setCustomStart(null);
  };

  const calculateCharges = () => {
    let totalCharges = 0;

    if (selectedTime !== -1 && selectedDates) {
      totalCharges =
        (selectedDates.length || 0) *
        (data?.data[0]?.teachingdetails?.price || 0);
    } else if (selectedTime === -1 && customStart && customEnd) {
      const start = dayjs(customStart);
      const end = dayjs(customEnd);
      const diffInMinutes = end.diff(start, "minute");
      const diffInHours = diffInMinutes / 60; // Convert minutes to hours
      const totalTime = diffInHours * (selectedDates?.length || 1); // Multiply by the number of dates
      totalCharges = totalTime * (data?.data[0]?.teachingdetails?.price || 0);
    }

    return totalCharges.toFixed(2);
  };

  useEffect(() => {
    if (
      data &&
      data.data[0]?.teachingdetails?.startTime &&
      data.data[0]?.teachingdetails?.endTime
    ) {
      const teachingStartTime = moment(
        data.data[0].teachingdetails.startTime
      ).format("D/M/YYYY, h:mm:ss a");
      const teachingEndTime = moment(
        data.data[0].teachingdetails.endTime
      ).format("D/M/YYYY, h:mm:ss a");

      makeSlots(teachingStartTime, teachingEndTime);
    }
  }, [data]);

  useEffect(() => {
    if (success && address.data.address?.length) {
      setSelectedAddress(address?.data?.address?.[0]?.id || "");
    }
  }, [success]);

  useEffect(() => {
    if (timeSlot && timeSuccess) {
      setBookSlots(timeSlot?.data);
    }
  }, [timeSlot]);

  useEffect(() => {
    if (learning === "") {
      setErr(true);
    } else {
      setErr(false);
    }
  }, [learning]);

  useEffect(() => {
    if (additional === "") {
      setErr1(true);
    } else {
      setErr1(false);
    }
  }, [additional]);
  //  console.log(teachingSlots, "teaching");
  //  console.log(selectedDates, "selectedDate");
  //  console.log(selectedTime, "timeee");
  //  console.log(address, "address");
  //  console.log(teachingSlots[selectedTime], "slott");

  return (
    <>
      <ParentLayout className="role-layout">
        <main className="content">
          <section className="uhb_spc pScheduleBooking_sc">
            <div className="conta_iner v2">
              <div className="role_head">
                <button
                  className="back_arrow"
                  onClick={() => navigate("/parent/tutor-detail/" + id)}
                >
                  <img src={`/static/images/back.png`} alt="Back" />
                </button>
                <h1 className="hd_3">Schedule Booking</h1>
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
                      <>
                        <p>
                          {" "}
                          Total classes taken :
                          {data?.data[0]?.classCount || "0"}
                        </p>

                        <p>
                          <figure>
                            <img
                              src={`/static/images/address_icon.svg`}
                              alt="Icon"
                            />
                          </figure>{" "}
                          {data?.data[0]?.address || ""}
                        </p>
                      </>
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
                    <h2>Select Booking Date & Time</h2>
                  </div>
                  <div className="cardBox_body">
                    <form className="form schedule_form">
                      <div className="gap_p">
                        <div className="control_group w_50">
                          <TextField
                            fullWidth
                            hiddenLabel
                            defaultValue="Select Date"
                            placeholder="Select Date"
                            InputProps={{
                              readOnly: true,
                              startAdornment: (
                                <InputAdornment position="end">
                                  <CalendarTodayOutlinedIcon />
                                </InputAdornment>
                              ),
                            }}
                            onClick={() => setOpen2(true)}
                          ></TextField>
                        </div>

                        <div className="control_group w_50">
                          <TextField
                            fullWidth
                            hiddenLabel
                            placeholder="Select Time"
                            defaultValue="Select Time"
                            InputProps={{
                              readOnly: true,
                              startAdornment: (
                                <InputAdornment position="end">
                                  <AccessTimeIcon />
                                </InputAdornment>
                              ),
                            }}
                            onClick={() => {
                              if (!selectedDates?.length) {
                                showWarning("Select Date first");
                              } else {
                                setOpen3(true);
                              }
                            }}
                          ></TextField>
                        </div>

                        {selectedDates?.length > 0 && (
                          <div className="control_group w_50">
                            <div>
                              <label> Selected Dates</label>
                              <div className="selected-dates-container">
                                {selectedDates?.map((item, index) => (
                                  <p className="available" key={index}>
                                    {item}
                                  </p>
                                ))}
                                <figure onClick={() => setSelectedDates([])}>
                                  <CloseIcon sx={{ fontSize: "17px" }} />
                                </figure>
                              </div>
                            </div>
                          </div>
                        )}
                        {time?.start && (
                          <div className="control_group w_50">
                            <div>
                              <label> Selected Time</label>
                              <div className="selected-dates-container">
                                <p className="available">
                                  {`${moment(time?.start).format(
                                    "hh:mm A"
                                  )} - ${moment(time?.end).format("hh:mm A")}`}
                                </p>
                                <figure
                                  onClick={() => {
                                    resetTime();
                                  }}
                                >
                                  <CloseIcon sx={{ fontSize: "17px" }} />
                                </figure>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="control_group w_100">
                          <label>Select Class Mode</label>
                          <RadioGroup
                            className="checkbox_label"
                            aria-labelledby="demo-radio-buttons-group-label"
                            name="radio-buttons-group"
                            value={classMode}
                            onChange={handleModeChange}
                          >
                            <FormControlLabel
                              value={"1"}
                              control={<Radio />}
                              label="Online"
                            />
                            <FormControlLabel
                              value={"2"}
                              control={<Radio />}
                              label="Offline"
                            />
                          </RadioGroup>
                        </div>
                        <div className="control_group w_100">
                          <label>Select Level</label>
                          <RadioGroup
                            className="checkbox_label"
                            aria-labelledby="demo-radio-buttons-group-label"
                            name="radio-buttons-group"
                            value={level}
                            onChange={handleLevelChange}
                          >
                            {data?.data[0]?.classes?.map((item, index) => (
                              <FormControlLabel
                                key={item?._id}
                                value={item?._id}
                                control={<Radio />}
                                label={getLevelName(item?.name) || ""}
                              />
                            ))}
                          </RadioGroup>
                        </div>
                        <div className="control_group w_100">
                          <label>Select Subject</label>
                          <RadioGroup
                            className="checkbox_label"
                            aria-labelledby="demo-radio-buttons-group-label"
                            name="radio-buttons-group"
                            value={subject}
                            onChange={handleSubjectChange}
                          >
                            {data?.data[0]?.subjects?.map((item, index) => (
                              <FormControlLabel
                                key={item?._id}
                                value={item?._id}
                                control={<Radio />}
                                label={item?.name || ""}
                              />
                            ))}
                          </RadioGroup>
                        </div>
                        <div className="control_group w_100">
                          <label>What would you want to learn today ?</label>
                          <TextField
                            hiddenLabel
                            fullWidth
                            placeholder="Type here"
                            className="text_field"
                            name="learnTody"
                            value={learning}
                            onChange={(e) => setLearning(e.target.value)}
                          ></TextField>
                          {err ? (
                            <p
                              style={{
                                fontSize: "13px",
                                color: "red",
                              }}
                            >
                              This field is required
                            </p>
                          ) : (
                            ""
                          )}
                        </div>
                        <div className="control_group w_100">
                          <label>Additional information (Learning needs)</label>
                          <TextField
                            hiddenLabel
                            fullWidth
                            placeholder="Type here"
                            className="text_field"
                            name="additionalInfo"
                            value={additional}
                            onChange={(e) => setAdditional(e.target.value)}
                          ></TextField>
                          {err1 ? (
                            <p
                              style={{
                                fontSize: "13px",
                                color: "red",
                              }}
                            >
                              This field is required
                            </p>
                          ) : (
                            ""
                          )}
                        </div>
                        {classMode === "2" ? (
                          <div className="control_group w_100">
                            <label>Address</label>
                            <RadioGroup
                              className="checkbox_label v2"
                              aria-labelledby="demo-radio-buttons-group-label"
                              name="radio-buttons-group"
                              value={selectedAddress}
                              onChange={handleAddressChange}
                            >
                              {load &&
                                Array.from(new Array(3)).map((item, index) => (
                                  <AddressCardSkeleton />
                                ))}
                              {success &&
                                address?.data?.address?.map((item, index) => (
                                  <FormControlLabel
                                    key={item?.id}
                                    value={item?.id}
                                    control={<Radio />}
                                    label={
                                      <>
                                        <strong>
                                          {" "}
                                          {item?.addressType === 1
                                            ? "Home address"
                                            : item?.addressType === 2
                                              ? "Office address"
                                              : "Other address"}
                                        </strong>
                                        <span>
                                          {item?.houseNumber || ""}&nbsp;
                                          {item?.city || ""}{" "}
                                          {item?.country || ""}
                                          <br />
                                          {item?.parentId?.phoneNo
                                            ? `${item?.parentId?.dialCode}-${item?.parentId?.phoneNo}`
                                            : null}
                                        </span>
                                      </>
                                    }
                                  />
                                ))}
                              <FormControlLabel
                                className="not_radio"
                                control={<></>}
                                label={
                                  <>
                                    <AddIcon /> Add New Address
                                  </>
                                }
                                onClick={toggleDrawer(true)}
                              />
                            </RadioGroup>
                          </div>
                        ) : null}
                      </div>
                      <div className="form_bottom">
                        <p>
                          <span>Total Charges</span>
                          <strong>
                            {" "}
                            {/* {selectedDates && selectedTime !== -1
                              ? `$${(selectedDates?.length || 0) * (data?.data[0]?.teachingdetails?.price || 0)}`
                              : "$00.00"} */}
                            ${calculateCharges() || "00:00"}
                          </strong>
                        </p>
                        <div className="form_btn">
                          <Button
                            variant="outlined"
                            color="primary"
                            onClick={handleReset}
                          >
                            Reset
                          </Button>
                          <Button
                            disabled={loading}
                            onClick={() =>
                              token ? addBookingMutation() : setOpenAlert(true)
                            }
                          >
                            {loading ? (
                              <Box display="flex" gap={2} alignItems="center">
                                <CircularProgress color="inherit" size={20} />
                                &nbsp;Loading
                              </Box>
                            ) : (
                              "Continue to Checkout"
                            )}
                          </Button>
                          {/* <Button
                            style={{ minWidth: "200px", minHeight: "40px" }}
                            disabled
                            onClick={() => navigate("/parent/checkout")}
                          >
                            <Box display="flex" gap={2} alignItems="center">
                              <CircularProgress color="inherit" size={20} />
                              &nbsp;Loading
                            </Box>
                          </Button> */}
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </ParentLayout>

      <Drawer
        className="address_aside"
        anchor="right"
        open={open}
        onClose={toggleDrawer(false)}
      >
        <AddressDrawer toggleDrawer={toggleDrawer} setOpen={setOpen} />
      </Drawer>

      <SelectDateModal
        open={open2}
        onClose={handleCloseModal2}
        setOpen={setOpen2}
        selectedDates={selectedDates}
        setSelectedDates={setSelectedDates}
        value={value}
        setValue={setValue}
      />
      <LoginAlertModal
        open={openAlert}
        setOpen={setOpenAlert}
        onClose={handleClose}
        msg="Please login before booking a class"
      />

      <SelectTimeModal
        open={open3}
        customStart={customStart}
        customEnd={customEnd}
        setCustomStart={setCustomStart}
        setCustomEnd={setCustomEnd}
        onClose={handleCloseModal3}
        setOpen={setOpen3}
        teachingStartTime={data?.data[0]?.teachingdetails?.startTime || ""}
        teachingEndTime={data?.data[0]?.teachingdetails?.endTime || ""}
        teachingSlots={teachingSlots}
        selectedDates={selectedDates}
        setSelectedDates={setSelectedDates}
        selectedTime={selectedTime}
        setSelectedTime={setSelectedTime}
        bookSlots={bookSlots}
        setBookSlots={setBookSlots}
        time={time}
        setTime={setTime}
      />
    </>
  );
}
const AddressCardSkeleton = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        padding: "16px",
        borderRadius: "8px",
        backgroundColor: "#f5f5f5",
        width: "24%",
      }}
    >
      {/* Circle Skeleton for the radio button */}
      <Skeleton
        variant="circular"
        width={24}
        height={24}
        sx={{ marginRight: "16px" }}
      />

      <Box>
        {/* Skeleton for the title */}
        <Skeleton variant="text" width={120} height={24} />

        {/* Skeleton for the address */}
        <Skeleton
          variant="text"
          width={180}
          height={20}
          sx={{ marginTop: "4px" }}
        />
      </Box>
    </Box>
  );
};
