import React, { useEffect, useState } from "react";
import { ParentLayout } from "../../../layout/parentLayout";
import SessionSummary from "../../../components/SessionSummary";
import { ProfileCard } from "../../../components/ProfileCard";
import BookingDateTime from "../../../components/BookingDateTime";
import RightBottomLinks from "../../../components/RightBottomLinks";
import { useNavigate, useParams } from "react-router-dom";
import { TutorDetailsById } from "../../../types/General";
import { TutorApi } from "../../../service/tutorApi";
import {
  Box,
  Input,
  InputAdornment,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import {
  DatePicker,
  LocalizationProvider,
  MobileTimePicker,
} from "@mui/x-date-pickers";
import { DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import AddIcon from "@mui/icons-material/Add";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { showError, showWarning } from "../../../constants/toast";
import SelectDateModal from "../../../Modals/selectDate";
import SelectTimeModal from "../../../Modals/selectTime";
import moment from "moment";
import CloseIcon from "@mui/icons-material/Close";
import { useLazyGetSubjectsAndCategoryQuery } from "../../../service/auth";
import {
  GRADE_TYPE_NAME,
  TYPE_SUBJECT_LISTING,
} from "../../../constants/enums";
import { useGetAddressQuery } from "../../../service/address";
import { useAddBookingMutation } from "../../../service/booking";
import { setToStorage } from "../../../constants/storage";
import { STORAGE_KEYS } from "../../../constants/storageKeys";
import { isValidInput } from "../../../utils/validations";

type PROMO = {
  code: string;
  _id: string;
  discount: number;
  grand: number;
};

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
export const ScheduleBookings = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [getById] = TutorApi.useLazyGetTutorByIdQuery();
  const [alignment, setAlignment] = React.useState("left");
  const [learning, setLearning] = useState<string>("");
  const [additional, setAdditional] = useState<string>("");
  const [open2, setOpen2] = React.useState(false);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState(-1);
  const [open3, setOpen3] = React.useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [subjectName, setSubjectName] = useState<string>("");
  const [selectedAddress, setSelectedAddress] = useState<string>(""); // state to store the selected address of the user
  const [addBooking] = useAddBookingMutation();
  const [addressObj, setAddressObj] = useState<any>({});
  const [promo, setPromo] = useState<PROMO>({
    code: "",
    _id: "",
    discount: 0,
    grand: 0,
  });

  const handleCloseModal2 = () => {
    setOpen2(false);
  };
  const [subjects, setSubjects] = useState<any[]>([]);
  const [getSubjects] = useLazyGetSubjectsAndCategoryQuery();
  const [selectedClass, setSelectedClass] = useState<number>(0);

  const [bookSlots, setBookSlots] = useState<any>();
  const [value, setValue] = useState<Date[]>([]);
  const [customStart, setCustomStart] = useState<string | null>(null);
  const [customEnd, setCustomEnd] = useState<string | null>(null);
  const [time, setTime] = useState<TimeType>({
    start: "",
    end: "",
  });
  const [teachingSlots, setTeachingSlots] = useState<
    { start: string; end: string }[]
  >([]);
  const handleCloseModal3 = () => {
    setOpen3(false);
  };

  const {
    data: address,
    isLoading: load,
    isSuccess: success,
    isError: error,
  } = useGetAddressQuery({ name: "" });

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

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string
  ) => {
    setAlignment(newAlignment);
  };
  const [loading, setLoading] = useState<boolean>(false);
  const [dataProfile, setDataProfile] = useState<TutorDetailsById>();

  const calculateCharges = () => {
    let totalCharges = 0;

    if (selectedTime !== -1 && selectedDates) {
      totalCharges =
        (selectedDates.length || 0) *
        (dataProfile?.teachingdetails?.usdPrice || 0);
    } else if (selectedTime === -1 && customStart && customEnd) {
      const start = dayjs(customStart);
      const end = dayjs(customEnd);
      const diffInMinutes = end.diff(start, "minute");
      const diffInHours = diffInMinutes / 60; // Convert minutes to hours
      const totalTime = diffInHours * (selectedDates?.length || 1); // Multiply by the number of dates
      totalCharges = totalTime * (dataProfile?.teachingdetails?.usdPrice || 0);
    }
    console.log(totalCharges, 'totalCharges');

    return totalCharges.toFixed(2);
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
  const children = [
    <ToggleButton value="left" key="left">
      Online
    </ToggleButton>,

    <ToggleButton value="right" key="right">
      Offline
    </ToggleButton>,
  ];
  const fetchById = async (id: string) => {
    setLoading(true);
    try {
      const res = await getById({ id }).unwrap();
      if (res?.statusCode === 200) {
        setDataProfile(res?.data[0]);
        setLoading(false);
      }
    } catch (error) {
      //      console.log(error);
      setLoading(false);
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await getSubjects({
        type: TYPE_SUBJECT_LISTING.TUTOR_SUBJECT,
        tutorId: id,
      }).unwrap();
      if (res?.statusCode == 200) {
        setSubjects(res?.data);
      }
    } catch (error: any) { }
  };

  const fetchTravelTime = ({
    parentLatitude,
    parentLongitude,
    tutorLatitude,
    tutorLongitude,
  }: Coordinates): Promise<number | undefined> => {
    return new Promise((resolve, reject) => {
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

  const addBookingMutation = async () => {
    try {
      if (!selectedAddress) {
        showWarning("Please select address");
        return;
      }
      if (!selectedSubject) {
        showWarning("Please select subject");
        return;
      }
      if (selectedClass == null || selectedClass == undefined) {
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

      let distance;
      if (alignment === "right") {
        distance = await fetchTravelTime({
          parentLatitude:
            address?.data?.address?.filter(
              (item) => item?.id === selectedAddress
            )[0]?.latitude ?? 0,
          parentLongitude:
            address?.data?.address?.filter(
              (item) => item?.id === selectedAddress
            )[0]?.longitude ?? 0,
          tutorLatitude: dataProfile?.latitude ? dataProfile?.latitude : 0,
          tutorLongitude: dataProfile?.longitude ? dataProfile?.longitude : 0,
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
          tutorId: dataProfile?._id,
          subjectName: subjectName,
          class: selectedClass,
        };
      });

      setLoading(true);
      let body = {
        tutorId: id,
        subjectId: [selectedSubject],
        distance: distance ? distance : 0,
        classId: selectedClass,
        timeSlots: sessionData,
        additionalInfo: additional,
        learnToday: learning,
        ...(promo?._id ? { promocodeId: promo?._id } : {}),
        classModeOnline: alignment === "left" ? true : false,
        // ...(alignment === "right" ? { distance: distance ? distance : 0 } : {}),
        ...(alignment === "right" ? { parentAddressId: selectedAddress } : {}),
        ...(alignment === "right"
          ? {
            latitude: address?.data?.address?.filter(
              (item) => item?.id === selectedAddress
            )[0]?.latitude,
          }
          : {}),
        ...(alignment === "right"
          ? {
            longitude: address?.data?.address?.filter(
              (item) => item?.id === selectedAddress
            )[0]?.longitude,
          }
          : {}),
      };
      console.log(body, "body");

      const res = await addBooking({ body, isCartScreen: true }).unwrap();
      setLoading(false);
      if (res?.statusCode === 200) {
        setToStorage(STORAGE_KEYS.bookingDetails, res?.data?.booking);
        setToStorage(STORAGE_KEYS.bookingSettings, res?.data?.setting);
        setToStorage(STORAGE_KEYS.body, body);
        const state = {
          id: id,
          dataProfile: dataProfile,
          selectedDates: selectedDates,
          time: `${moment(time?.start).format(
            "hh:mm A"
          )} - ${moment(time?.end).format("hh:mm A")}`,
          learning: learning,
          additional: additional,
          address: addressObj,
          subject: subjectName,
          class: selectedClass,
          mode: alignment,
        };
        navigate("/parent/checkout", {
          state: state,
        });
      }
    } catch (error: any) {
      setLoading(false);
      showError(error?.data?.message);
    }
  };

  const calculateTotalTime = () => {
    if (customStart && customEnd) {
      const start = moment(customStart);
      const end = moment(customEnd);
      const diffInMinutes = end.diff(start, "minutes");
      const totalMinutes = diffInMinutes * (selectedDates?.length || 1);
      const totalHours = Math.floor(totalMinutes / 60);
      const remainingMinutes = totalMinutes % 60;

      return `${totalHours}hours ${remainingMinutes}m`;
    }

    return "";
  };

  const control = {
    value: alignment,
    onChange: handleChange,
    exclusive: true,
  };
  useEffect(() => {
    if (id) {
      fetchById(id);
    }
  }, [id]);

  useEffect(() => {
    if (
      dataProfile &&
      dataProfile?.teachingdetails?.startTime &&
      dataProfile?.teachingdetails?.endTime
    ) {
      const teachingStartTime = moment(
        dataProfile.teachingdetails.startTime
      ).format("D/M/YYYY, h:mm:ss a");
      const teachingEndTime = moment(
        dataProfile.teachingdetails.endTime
      ).format("D/M/YYYY, h:mm:ss a");

      makeSlots(teachingStartTime, teachingEndTime);
    }
  }, [dataProfile]);

  useEffect(() => {
    fetchSubjects();
  }, []);
  return (
    <>
      <ParentLayout className="role-layout">
        <main className="content">
          <section className="uh_spc  home_wrp bkng_dtlss">
            <div className="conta_iner v2">
              <div className="tutor_profile gap_m">
                <div className="role_body rt_v2">
                  <div className="tutor_profile_details mn_booking_dtls">
                    <div className="card_inr">
                      <figure>
                        <img src={dataProfile?.bannerImg || "/static/images/profile_bg.png"} alt="" />
                        <figcaption>
                          <span className="dot"></span>{dataProfile?.isActive ? 'Online':"Offline"}
                        </figcaption>
                      </figure>
                      <ProfileCard data={dataProfile} />
                    </div>
                  </div>
                  <div className="bkng_mn_bg">
                    <div className="booking_scs">
                      <div className="title_fdx">
                        <h2>Booking Date & Time</h2>

                        <div className="btn_groups">
                          <ToggleButtonGroup
                            size="small"
                            {...control}
                            aria-label="Small sizes"
                          >
                            {children}
                          </ToggleButtonGroup>
                        </div>
                      </div>
                      <ul className="cal_fdx">
                        <li>
                          <div className="control_group ">
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
                        </li>
                        <li>
                          <div className="control_group ">
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
                        </li>
                        {/* <li>
                                                        <button className='btn primary'> <span><ControlPointIcon /></span> Add More</button>
                                                    </li> */}
                      </ul>
                      {selectedDates?.length > 0 && (
                        <ul className="cal_fdx">
                          <li>
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
                          </li>
                        </ul>
                      )}
                      {time?.start && (
                        <ul className="cal_fdx">
                          <li>
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
                          </li>
                        </ul>
                      )}
                    </div>

                    <div className=" sub_list ut_spc home_wrp ">
                      <div className="title_fdx">
                        <h2>Select Subject</h2>
                      </div>

                      <ul className="cstmm_tabs ">
                        {subjects?.map((item) => {
                          return (
                            <li
                              onClick={() => {
                                setSelectedSubject(item?._id);
                                setSubjectName(item?.name);
                              }}
                              className={
                                item?._id == selectedSubject
                                  ? "green"
                                  : "simple"
                              }
                            >
                              {item?.name || "-"}
                            </li>
                          );
                        })}
                      </ul>
                    </div>

                    <div className=" sub_list ut_spc home_wrp ">
                      <div className="title_fdx">
                        <h2>Select Level</h2>
                      </div>

                      <ul className="cstmm_tabs ">
                        {dataProfile?.teachingdetails?.classes?.length
                          ? dataProfile.teachingdetails.classes.map(
                            (item, index) =>
                              item >= 1 ? (
                                <li
                                  key={index}
                                  onClick={() => setSelectedClass(item)}
                                  className={
                                    item === selectedClass
                                      ? "green"
                                      : "simple"
                                  }
                                >
                                  {GRADE_TYPE_NAME[item]}
                                </li>
                              ) : null
                          )
                          : null}

                        {/* <li className="green">Primary</li>
                                                    <li className="simple">Middle School (O-Level) </li>
                                                    <li className="simple">High School (O-Level) </li> */}
                      </ul>
                    </div>
                    <div className=" sub_list ut_spc">
                      <div className="title_fdx">
                        <h2>What would you want to learn today?</h2>
                      </div>
                      <div className="input_group">
                        <Input
                          placeholder="Type here.."
                          className="form_control"
                          inputProps={{ maxLength: 80 }}
                          value={learning}
                          onChange={(e) => {
                            if (isValidInput(e.target.value)) {
                              setLearning(e.target.value);
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className=" sub_list ut_spc">
                      <div className="title_fdx">
                        <h2>Additional Information</h2>
                      </div>
                      <div className="input_group">
                        <Input
                          placeholder="Type here.."
                          className="form_control"
                          inputProps={{ maxLength: 80 }}
                          value={additional}
                          onChange={(e) => {
                            if (isValidInput(e.target.value)) {
                              setAdditional(e.target.value);
                            }
                          }}
                        />
                      </div>
                    </div>

                    <div className=" sub_list ut_spc">
                      <div className="title_fdx">
                        <h2>Select Address</h2>
                      </div>
                      <ul className="address_mn ut_spc">
                        {address?.data?.address?.length
                          ? address?.data?.address?.map((item) => {
                            return (
                              <li
                                style={
                                  selectedAddress == String(item?._id)
                                    ? { backgroundColor: "#65a442" }
                                    : {}
                                }
                                onClick={() => {
                                  setSelectedAddress(String(item?._id));
                                  setAddressObj(item);
                                }}
                              >
                                <h4>
                                  {item?.addressType === 1
                                    ? "Home Address"
                                    : item?.addressType === 2
                                      ? "Office Address"
                                      : "Other Address"}
                                </h4>
                                <p>
                                  {item?.houseNumber || ""}&nbsp;
                                  {item?.city || ""} {item?.country || ""}{" "}
                                </p>

                                <p>
                                  {" "}
                                  {item?.parentId?.phoneNo
                                    ? `${item?.parentId?.dialCode}-${item?.parentId?.phoneNo}`
                                    : null}
                                </p>
                              </li>
                            );
                          })
                          : null}

                        <li onClick={() => navigate("/parent/location")}>
                          <AddIcon />
                          <p>Add New Address</p>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="sidebar_rt">
                  <SessionSummary
                    selectedDate={selectedDates}
                    time={time}
                    hours={
                      selectedTime !== -1
                        ? `${selectedDates?.length} hour`
                        : calculateTotalTime()
                    }
                    price={calculateCharges}
                    subject={subjectName}
                    submit={addBookingMutation}
                    promo={promo}
                    setPromo={setPromo}
                  />
                  <RightBottomLinks />
                </div>
              </div>
            </div>
          </section>
        </main>
      </ParentLayout>
      <SelectDateModal
        open={open2}
        onClose={handleCloseModal2}
        setOpen={setOpen2}
        selectedDates={selectedDates}
        setSelectedDates={setSelectedDates}
        value={value}
        setValue={setValue}
      />

      <SelectTimeModal
        open={open3}
        customStart={customStart}
        customEnd={customEnd}
        setCustomStart={setCustomStart}
        setCustomEnd={setCustomEnd}
        onClose={handleCloseModal3}
        setOpen={setOpen3}
        teachingStartTime={dataProfile?.teachingdetails?.startTime || ""}
        teachingEndTime={dataProfile?.teachingdetails?.endTime || ""}
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
};

export default ScheduleBookings;
