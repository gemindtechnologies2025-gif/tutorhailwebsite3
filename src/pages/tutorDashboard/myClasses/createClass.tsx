import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Input,
  InputAdornment,
  MenuItem,
  Radio,
  Select,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import MuiAutoComplete from "@mui/material/Autocomplete";

import React, { useEffect, useState } from "react";
import EditText from "../../../components/EditText";
import CustomSelector from "../../../components/CustomSelector";
import SelectDateModal from "../../../Modals/selectDate";
import SelectTimeSlotModal from "../../../Modals/SelectTimeSimple";
import { useLazyGetSubjectsAndCategoryQuery } from "../../../service/auth";
import {
  useGetClassListQuery,
  useGetTutorListQuery,
} from "../../../service/tutorApi";
import {
  useAddClassMutation,
  useGetClassesByIdQuery,
  useUpdateClassByIdMutation,
} from "../../../service/class";
import dayjs, { Dayjs } from "dayjs";
import { TutorLayout } from "../../../layout/tutorLayout";
import {
  CLASS_PAYMENT,
  CLASS_SETTING,
  CLASS_TYPE,
  CLASS_TYPE2,
  Class_Variables,
  ClassMode,
  GRADE_TYPE,
  GRADE_TYPE_NAME,
  RECURRENCE_TYPE,
  TYPE_SUBJECT_LISTING,
} from "../../../constants/enums";
import { useFormik } from "formik"; // ✅ Added Formik
import * as Yup from "yup"; // ✅ Added Yup
import CloseIcon from "@mui/icons-material/Close";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import {
  UploadMedia,
  Uploadpdf,
  UploadVideo,
} from "../../../utils/mediaUpload";
import { showError, showToast } from "../../../constants/toast";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import CancelIcon from "@mui/icons-material/Cancel";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import moment, { duration } from "moment";
import timezone from "../../../constants/TimeZone";
import { Autocomplete } from "@react-google-maps/api";
import NewSideBarTutor from "../../../components/NewSideBarTutor";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { useGetPromoCodeListWithoutPaginationQuery } from "../../../service/promoCode";
import currency from "../../../constants/Currency";
import { convertCurrencyNew } from "../../../utils/currency";
import { isValidInput } from "../../../utils/validations";
type PromoItem = {
  _id: string;
  name: string;
};
type TimezoneItem = {
  value: string;
  label: string;
};

const CreateClassTutor = () => {
  const { id } = useParams();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [getSubjects] = useLazyGetSubjectsAndCategoryQuery();
  const [openDate, setOpenDate] = React.useState(false);
  const [autocomplete, setAutocomplete] = useState(null);
  const [slots, setSlots] = useState<any>([]);
  const navigate = useNavigate();
  const [setting, setSetting] = useState<any>();
  const { data: tutorList } = useGetTutorListQuery({});
  const [createClass] = useAddClassMutation();
  const [editClass] = useUpdateClassByIdMutation();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { data: byIdData, isSuccess } = useGetClassesByIdQuery(
    { id: id },
    { skip: !id }
  );
  const { data: promoCode } = useGetPromoCodeListWithoutPaginationQuery({});

  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [times, setTimes] = useState<any[]>([]);
  const gradeOptions = Object.values(GRADE_TYPE);
  // CustomSelector state variables
  const [slotDates, setSlotDates] = useState<string[]>([]);

  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [repeatEveryWeeks, setRepeatEveryWeeks] = useState(1);
  const [continueForWeeks, setContinueForWeeks] = useState(1);
  const [slotTime, setSlotTime] = useState<{ [dayIndex: number]: { start: string; end: string }[] }>({});
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [slotDuration, setSlotDuration] = useState<number>(60);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const [selectedTimeOld, setSelectedTimeOld] = useState<Dayjs | null>(null);
  const [openTime, setOpenTime] = React.useState(false);
  const [value, setValue] = useState<Date[]>([]);
  const [videoLoading, setVideoLoading] = useState<boolean>(false);
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const [pdfLoading, setPdfLoading] = useState<boolean>(false);
  const handlePdfChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPdfLoading(true)
    try {
      const res = await Uploadpdf(file); // assuming this uploads and returns { data: { image: string } }
      const uploadedUrl = res.data?.image;

      if (uploadedUrl) {
        formik.setFieldValue("material", uploadedUrl);
      }
      setPdfLoading(false)
    } catch (error) {
      setPdfLoading(false)
      console.error("Pdf upload failed:", error);
    }
  };

  const handleVideoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setVideoLoading(true)
    try {
      const res = await UploadVideo(file); // assuming this uploads and returns { data: { image: string } }
      const uploadedUrl = res.data?.image;
      if (uploadedUrl) {
        formik.setFieldValue("teaserVideo", uploadedUrl);
      }
      setVideoLoading(false)
    } catch (error) {
      setVideoLoading(false)
      console.error("Image upload failed:", error);
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await getSubjects({
        type: TYPE_SUBJECT_LISTING.TUTOR_SUBJECT,
      }).unwrap();
      if (res?.statusCode == 200) {
        setSubjects(res?.data);
      }
    } catch (error: any) { }
  };

  const onLoad = (autocompleteObj: any) => {
    setAutocomplete(autocompleteObj);
  };
  const onPlaceChanged = async () => {
    if (autocomplete) {
      let place = await (autocomplete as any).getPlace();

      if (place && place.address_components) {
        let address = place.address_components;

        let state,
          city,
          country,
          zip = "";

        address.forEach(function (component: any) {
          let types = component.types;

          if (
            types.indexOf("locality") > -1 ||
            types.indexOf("administrative_area_level_3") > -1
          ) {
            city = component.long_name;
          }
          if (types.indexOf("postal_code") > -1) {
            zip = component.long_name;
          }
          if (types.indexOf("administrative_area_level_1") > -1) {
            state = component?.long_name || "";
          }
          if (types.indexOf("country") > -1) {
            country = component?.long_name || "";
          }
        });
        var lat = place.geometry.location.lat();
        var lng = place.geometry.location.lng();
        // captureSatelliteView(lat, lng);
        formik.setFieldValue("address", city + "," + country);
        formik.setFieldValue("latitude", lat || "");
        formik.setFieldValue("longitude", lng || "");
      }
    }
  };



  const minimalValidationSchema = Yup.object({
    subject: Yup.string().required("Subject is required"),
    topic: Yup.string().required("Topic is required"),
    description: Yup.string().min(10).required("Description is required"),
  });

  const fullValidationSchema = Yup.object({
    subject: Yup.string().required("Subject is required"),
    topic: Yup.string().required("Topic is required"),
    description: Yup.string().min(10).required("Description is required"),
    learningObjects: Yup.string().required("Learning Objects is required"),
    learningOutcomesAll: Yup.string(),
    learningOutcomesMost: Yup.string(),
    learningOutcomesSome: Yup.string(),
    thumbnail: Yup.string().required("Thumbnail is required"),
    teaserVideo: Yup.string().required("Teaser Video is required"),
    timeZone: Yup.string().required("TimeZone is required"),
    gradeOption: Yup.array()
      .of(Yup.number()) // since your values are numbers from GRADE_TYPE
      .min(1, "Grade is required") // at least 1 grade must be selected
      .required("Grade is required"),
    classType2: Yup.string().required("Class type is required"),
    seatLimit: Yup.string().required("Seat Limit is required"),
    currency: Yup.string().required("Currency is required"),
    typeOfClass: Yup.string().required("Class type is required"),
    searchTags: Yup.string().required("Search Tags is required"),
    instructionLanguage: Yup.string().required(
      "Instruction Language is required"
    ),
  });

  const formik = useFormik({

    initialValues: {
      subject: "",
      topic: "",
      description: "",
      learningObjects: "",
      learningOutcomesAll: "",
      learningOutcomesMost: "",
      learningOutcomesSome: "",
      thumbnail: "",
      teaserVideo: "",
      selectedDates: "",
      selectedSlots: "",
      timeZone: "",
      gradeOption: [],
      feePerStudent: "",
      promoCode: [],
      seatLimit: "",
      typeOfClass: "",
      coTeacher: [],
      material: "",
      searchTags: "",
      instructionLanguage: "",
      customNotes: "",
      allowPrivateClass: false,
      latitude: 0,
      longitude: 0,
      address: "",
      setting: "",
      sessionDuration: "60",
      multiTimeSelect: false,
      daysOfWeek: [],
      repeatWeek: "1",
      continueWeek: "1",
      endDate: "",
      duration: "1",
      freeLesson: false,
      paymentType: CLASS_PAYMENT.SESSION,
      classType2: "",
      currency: ""
    },
    validationSchema:
      setting == CLASS_SETTING.DRAFT
        ? minimalValidationSchema
        : fullValidationSchema,


    onSubmit: async (values) => {
      setFormSubmitted(true);

      // Validate form fields (both formik and new state variables)
      if (setting === CLASS_SETTING.PUBLISH) {
        // Validate required formik fields
        if (!values.subject) {
          toast.error("Subject is required");
          return;
        }
        if (!values.topic) {
          toast.error("Topic is required");
          return;
        }
        if (!values.description || values.description.length < 10) {
          toast.error("Description must be at least 10 characters");
          return;
        }
        if (!values.learningObjects) {
          toast.error("Learning Objects is required");
          return;
        }
        if (!values.thumbnail) {
          toast.error("Thumbnail is required");
          return;
        }
        if (!values.teaserVideo) {
          toast.error("Teaser Video is required");
          return;
        }
        if (!values.timeZone) {
          toast.error("TimeZone is required");
          return;
        }
        if (!values.gradeOption || values.gradeOption.length === 0) {
          toast.error("Grade is required");
          return;
        }
        if (!values.classType2) {
          toast.error("Class type is required");
          return;
        }
        if (!values.seatLimit) {
          toast.error("Seat Limit is required");
          return;
        }
        if (!values.currency) {
          toast.error("Currency is required");
          return;
        }
        if (!values.typeOfClass) {
          toast.error("Class type is required");
          return;
        }

        if (!values.searchTags) {
          toast.error("Search Tags is required");
          return;
        }
        if (!values.instructionLanguage) {
          toast.error("Instruction Language is required");
          return;
        }

        // Validate new state variables (replacing old formik validations)
        if (!startDate) {
          toast.error("Start date is required");
          return;
        }
        if (!endDate) {
          toast.error("End date is required");
          return;
        }
        if (Object.keys(slotTime).length === 0) {
          toast.error("Please select at least one day and time slot");
          return;
        }
        if (slotDuration <= 0) {
          toast.error("Slot duration must be greater than 0");
          return;
        }
        if (repeatEveryWeeks <= 0) {
          toast.error("Repeat interval must be greater than 0");
          return;
        }
        if (continueForWeeks <= 0) {
          toast.error("Continue for weeks must be greater than 0");
          return;
        }

        // Validate date range
        const start = dayjs(startDate);
        const end = dayjs(endDate);
        if (end.isSameOrBefore(start)) {
          toast.error("End date must be after start date");
          return;
        }

        // Validate that we have slots for the selected days
        const selectedDays = Object.keys(slotTime).map(Number);
        if (selectedDays.length === 0) {
          toast.error("Please select at least one day");
          return;
        }
      } else {
        // Minimal validation for draft
        if (!values.subject) {
          toast.error("Subject is required");
          return;
        }
        if (!values.topic) {
          toast.error("Topic is required");
          return;
        }
        if (!values.description || values.description.length < 10) {
          toast.error("Description must be at least 10 characters");
          return;
        }
      }

      let usdPrice: any = formik.values.feePerStudent;
      if ((id && formik.values.feePerStudent !== byIdData?.data?.fees) || (!id && formik.values.feePerStudent)) {
        usdPrice = await getConverted();
      }

      // Format slot dates using the new CustomSelector format
      const formatDateSlots = (
        selectedDates: string[],
        slotTime: { [dayIndex: number]: { start: string; end: string }[] }
      ) => {
        const result: { date: string; startTime: string; endTime: string }[] = [];

        selectedDates.forEach((dateStr) => {
          const date = dayjs(dateStr);
          const dayOfWeek = date.day(); // 0 = Sunday, 1 = Monday, etc.

          // Get slots for this day of week
          const daySlots = slotTime[dayOfWeek] || [];

          daySlots.forEach((slot) => {
            const [startHour, startMin] = slot.start.split(":").map(Number);
            const [endHour, endMin] = slot.end.split(":").map(Number);

            const startTime = date.hour(startHour).minute(startMin);
            const endTime = date.hour(endHour).minute(endMin);

            result.push({
              date: date.toISOString(),
              startTime: startTime.toISOString(),
              endTime: endTime.toISOString(),
            });
          });
        });

        return result;
      };

      const classSlots = setting == CLASS_SETTING.PUBLISH ? formatDateSlots(slotDates, slotTime) : [];

      if (!classSlots?.length && setting == CLASS_SETTING.PUBLISH) {
        toast.error("Please select a valid schedule");
        return;
      }

      const body = {
        ...(values.subject ? { subjectId: values.subject } : {}),
        topic: values.topic,
        description: values.description,
        ...(values.currency ? { currency: values?.currency } : {}),
        ...(values.gradeOption?.length ? { grades: values.gradeOption } : {}),
        ...(values.learningObjects
          ? { objective: values.learningObjects }
          : {}),
        ...(values.learningOutcomesSome
          ? { someOutcome: values.learningOutcomesSome }
          : {}),
        ...(values.learningOutcomesAll
          ? { allOutcome: values.learningOutcomesAll }
          : {}),
        ...(values.learningOutcomesMost
          ? { mostOutcome: values.learningOutcomesMost }
          : {}),
        ...(values.thumbnail ? { thumbnail: values.thumbnail } : {}),
        ...(values.teaserVideo ? { teaser: values.teaserVideo } : {}),
        ...(values.feePerStudent ? { fees: values.feePerStudent } : {}),
        ...(values.feePerStudent ? { usdPrice: Number(usdPrice?.converted) || values.feePerStudent } : {}),
        ...(values.seatLimit ? { seats: values.seatLimit } : {}),
        ...(values.coTeacher?.length ? { coTutorId: values.coTeacher } : {}),
        ...(values.searchTags?.length
          ? { searchTags: values.searchTags?.split(",") }
          : {}),
        ...(values.instructionLanguage
          ? { language: Number(values.instructionLanguage) }
          : {}),
        ...(values.customNotes ? { notes: values.customNotes } : {}),
        ...(values.typeOfClass ? { classMode: values.typeOfClass } : {}),
        ...(values.timeZone ? { timezone: values.timeZone } : {}),
        ...(values.material ? { material: [values.material] } : {}),
        canBePrivate: values.allowPrivateClass,
        ...(classSlots?.length ? { classSlots: classSlots } : {}),
        ...(values?.promoCode?.length ? { promoCodeId: values.promoCode } : {}),
        ...(formik.values.address &&
          (Number(formik.values.typeOfClass) == ClassMode.OFFLINE ||
            Number(formik.values.typeOfClass) === ClassMode.HYBRID)
          ? { address: formik.values.address }
          : {}),
        ...(formik.values.longitude &&
          (Number(formik.values.typeOfClass) == ClassMode.OFFLINE ||
            Number(formik.values.typeOfClass) === ClassMode.HYBRID)
          ? { longitude: formik.values.longitude }
          : {}),
        ...(formik.values.latitude &&
          (Number(formik.values.typeOfClass) == ClassMode.OFFLINE ||
            Number(formik.values.typeOfClass) === ClassMode.HYBRID)
          ? { latitude: formik.values.latitude }
          : {}),

        setting: setting,
        repeatEvery: repeatEveryWeeks,
        duration: slotDuration,
        continueFor: continueForWeeks,
        isFreeLesson: values.freeLesson,
        ...(values.freeLesson ? {} : { payment: Number(values.paymentType) }),

        ...(values.classType2
          ? { typeOfClass: Number(values.classType2) }
          : {}),

        ...(endDate
          ? {
            endDate: moment(endDate)
              .startOf("day")
              .utc()
              .toISOString(),
          }
          : {}),
        ...(startDate ? { startDate: moment(startDate).startOf("day").utc().toISOString() } : {}),
      };
      console.log(body, "body");
      try {
        setIsLoading(true)

        if (id) {
          const res = await editClass({ id: id, body: body }).unwrap();
          if (res?.statusCode === 200) {
            showToast("Class updated successfully");
            navigate("/tutor/classes");
          }
        } else {
          const res = await createClass(body).unwrap();
          if (res?.statusCode === 200) {
            if (setting == String(CLASS_SETTING.DRAFT)) {
              showToast("Class added in Draft successfully");
              navigate("/tutor/classes/drafts");
            } else {
              showToast("Class created successfully");
              navigate("/tutor/classes");
              formik.resetForm();
            }
          }
        }
        setIsLoading(false)

      } catch (error: any) {
        setIsLoading(false)

        showError(error?.data?.message || "")
      }
    },
  });

  // Old slot management functions removed - now using CustomSelector

  // Old formatDateSlots function removed - now using new one in onSubmit
  const handleCloseModal2 = () => {
    setOpenDate(false);
  };
  const handleCloseModal3 = () => {
    setOpenTime(false);
  };
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageLoading(true)
    try {
      const res = await UploadMedia(file); // assuming this uploads and returns { data: { image: string } }
      const uploadedUrl = res.data?.image;

      if (uploadedUrl) {
        formik.setFieldValue("thumbnail", uploadedUrl);
      }
      setImageLoading(false)
    } catch (error) {
      setImageLoading(false)
      console.error("Image upload failed:", error);
    }
  };

  const getConverted = async () => {
    const result = await convertCurrencyNew({
      baseCurrency: formik.values.currency,
      targetCurrency: 'USD',
      amount: Number(formik.values.feePerStudent),
    });

    if (result) {
      return result;
    } else {
      return (formik.values.feePerStudent);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      formik.setFieldValue("subject", byIdData?.data?.subjects?._id || "");


      formik.setFieldValue("topic", byIdData?.data?.topic || "");
      formik.setFieldValue("description", byIdData?.data?.description || "");
      formik.setFieldValue("learningObjects", byIdData?.data?.objective || "");
      formik.setFieldValue(
        "learningOutcomesAll",
        byIdData?.data?.allOutcome || ""
      );
      formik.setFieldValue(
        "learningOutcomesMost",
        byIdData?.data?.mostOutcome || ""
      );
      formik.setFieldValue(
        "learningOutcomesSome",
        byIdData?.data?.someOutcome || ""
      );
      formik.setFieldValue("thumbnail", byIdData?.data?.thumbnail || "");
      formik.setFieldValue("teaserVideo", byIdData?.data?.teaser || "");
      formik.setFieldValue("timeZone", byIdData?.data?.timeZone || "");
      formik.setFieldValue("gradeOption", byIdData?.data?.grades || "");
      formik.setFieldValue("feePerStudent", byIdData?.data?.fees || "");
      formik.setFieldValue("seatLimit", byIdData?.data?.seats || "");
      formik.setFieldValue("typeOfClass", byIdData?.data?.classMode || "");
      formik.setFieldValue("coTeacher", byIdData?.data?.coTutor?.map((item: any) => item?._id) || []);
      formik.setFieldValue("material", byIdData?.data?.material?.[0] || "");
      formik.setFieldValue(
        "instructionLanguage",
        byIdData?.data?.language || ""
      );
      formik.setFieldValue("customNotes", byIdData?.data?.notes || "");
      formik.setFieldValue(
        "allowPrivateClass",
        byIdData?.data?.canBePrivate || false
      );
      formik.setFieldValue("latitude", byIdData?.data?.latitude || "");
      formik.setFieldValue("longitude", byIdData?.data?.longitude || "");
      formik.setFieldValue("address", byIdData?.data?.address || "");
      formik.setFieldValue("classType2", byIdData?.data?.typeOfClass || "");
      formik.setFieldValue("repeatWeek", byIdData?.data?.duration || "");
      formik.setFieldValue("paymentType", byIdData?.data?.payment || "");
      formik.setFieldValue("currency", byIdData?.data?.currency || "");
      formik.setFieldValue("timeZone", byIdData?.data?.classslots?.[0]?.timezone || "");
      formik.setFieldValue(
        "searchTags",
        byIdData?.data?.searchTags?.join(",") || ""
      );

      // Set CustomSelector state values
      setSlotDuration(byIdData?.data?.duration || 60);
      setContinueForWeeks(byIdData?.data?.continueFor || 1);
      if (byIdData?.data?.endDate) setEndDate(byIdData?.data?.endDate);
      setRepeatEveryWeeks(byIdData?.data?.repeatEvery || 1);

      // Set class slots for CustomSelector
      if (byIdData?.data?.classslots && byIdData?.data?.classslots.length > 0) {
        const uniqueDates = Array.from(
          new Set(
            byIdData?.data?.classslots.map(
              (slot: any) => slot.date.split("T")[0]
            )
          )
        );
        setSlotDates(uniqueDates as string[]);

        // Derive startDate/endDate from classslots if not explicitly present
        const sortedSlots = [...byIdData?.data?.classslots].sort(
          (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        const firstDate = sortedSlots[0]?.date;
        const lastDate = sortedSlots[sortedSlots.length - 1]?.date;
        if (!byIdData?.data?.startDate && firstDate) {
          setStartDate(firstDate);
        }
        if (!byIdData?.data?.endDate && lastDate) {
          setEndDate(lastDate);
        }

        // Convert slots to the new format
        const timeSlotsByDay: {
          [dayIndex: number]: { start: string; end: string }[];
        } = {};

        byIdData?.data?.classslots.forEach((slot: any) => {
          const dayOfWeek = dayjs(slot.date).day();
          const timeSlot = {
            start: dayjs(slot.startTime).format("HH:mm"),
            end: dayjs(slot.endTime).format("HH:mm"),
          };

          if (!timeSlotsByDay[dayOfWeek]) {
            timeSlotsByDay[dayOfWeek] = [];
          }

          // Check for duplicates
          const isDuplicate = timeSlotsByDay[dayOfWeek].some(
            (existing) =>
              existing.start === timeSlot.start &&
              existing.end === timeSlot.end
          );

          if (!isDuplicate) {
            timeSlotsByDay[dayOfWeek].push(timeSlot);
          }
        });

        setSlotTime(timeSlotsByDay);
      }
    }
  }, [isSuccess]);



  useEffect(() => {
    fetchSubjects();
  }, []);

  return (
    <>
      <TutorLayout className="role-layout">
        <main className="content">
          <section className="uh_spc pSearchResult_sc home_wrp">
            <div className="conta_iner v2">
              <div className="gap_m grid_2">
                <NewSideBarTutor />
                <div className="role_body rt_v2 abt_profile_sc ">
                  <div
                    style={{ margin: "0" }}
                    className="card_box addvideo_upload form_class"
                  >
                    <form className="create_classes" onSubmit={formik.handleSubmit}>
                      <div className="title_md">
                        <h2>Create class</h2>
                      </div>
                      <div
                        className="control_group"
                        style={{ marginTop: "15px" }}
                      >
                        <label htmlFor="subject" className="form_label">Subject</label>
                        <Select id="subject"
                          name="subject"
                          value={formik.values.subject}
                          onChange={(e) => { if (isValidInput(e.target.value)) formik.handleChange(e) }}
                          onBlur={formik.handleBlur}
                          fullWidth
                          displayEmpty
                        >
                          <MenuItem value="" disabled>
                            Select Subject
                          </MenuItem>
                          {subjects?.map((item) => {
                            return (
                              <MenuItem key={item?._id} value={item?._id}>
                                {item?.name || "-"}
                              </MenuItem>
                            );
                          })}
                        </Select>
                        {formik.touched.subject && formik.errors.subject && (
                          <Typography color="error" fontSize={12}>
                            {formik.errors.subject as string}
                          </Typography>
                        )}
                      </div>

                      <div className="control_group" style={{ marginTop: "15px" }}>
                        <label htmlFor="topic" className="form_label">Topic</label>
                        <Input
                          id="topic"
                          fullWidth
                          placeholder="Enter Class Topic"
                          name="topic"
                          value={formik.values.topic}
                          onChange={(e) => { if (isValidInput(e.target.value)) formik.handleChange(e) }}
                          onBlur={formik.handleBlur}
                        />
                        {formik.touched.topic && formik.errors.topic && (
                          <Typography color="error" fontSize={12}>
                            {formik.errors.topic}
                          </Typography>
                        )}
                      </div>
                      <div
                        className="control_group"
                        style={{ marginTop: "15px" }}
                      >
                        <label>Description</label>
                        {formik.values.description || !id ? (
                          <EditText
                            content={formik.values.description}
                            setContent={(value) =>
                              formik.setFieldValue("description", value)
                            }
                          />
                        ) : null}

                        {formik.touched.description &&
                          formik.errors.description && (
                            <Typography color="error" fontSize={12}>
                              {formik.errors.description}
                            </Typography>
                          )}
                      </div>

                      <div
                        className="control_group"
                        style={{ marginTop: "15px" }}
                      >
                        <label htmlFor="learningObjects">
                          Learning Objectives
                        </label>
                        <Input
                          fullWidth
                          placeholder="What will students Learn"
                          name="learningObjects"
                          value={formik.values.learningObjects}
                          onChange={(e) => { if (isValidInput(e.target.value)) formik.handleChange(e) }}
                          onBlur={formik.handleBlur}
                          minRows={4}
                          multiline
                        />
                        {formik.touched.learningObjects &&
                          formik.errors.learningObjects && (
                            <Typography color="error" fontSize={12}>
                              {formik.errors.learningObjects}
                            </Typography>
                          )}
                      </div>

                      <div
                        className="control_group"
                        style={{ marginTop: "15px" }}
                      >
                        <label htmlFor="learningOutcomes">
                          Learning Outcomes
                        </label>

                        <Input
                          fullWidth
                          placeholder="All learners will be able to.."
                          name="learningOutcomesAll"
                          value={formik.values.learningOutcomesAll}
                          onChange={(e) => { if (isValidInput(e.target.value)) formik.handleChange(e) }}
                          onBlur={formik.handleBlur}
                          minRows={4}
                          multiline
                        />
                        {formik.touched.learningOutcomesAll &&
                          formik.errors.learningOutcomesAll && (
                            <Typography color="error" fontSize={12}>
                              {formik.errors.learningOutcomesAll}
                            </Typography>
                          )}
                      </div>
                      <div
                        className="control_group"
                        style={{ marginTop: "15px" }}
                      >
                        <label htmlFor="MostLearnersWillBeAbleTo">
                          Most learners
                        </label>
                        <Input
                          fullWidth
                          placeholder="Most learners will be able to.."
                          name="learningOutcomesMost"
                          value={formik.values.learningOutcomesMost}
                          onChange={(e) => { if (isValidInput(e.target.value)) formik.handleChange(e) }}
                          onBlur={formik.handleBlur}
                          minRows={4}
                          multiline
                        />
                        {formik.touched.learningOutcomesMost &&
                          formik.errors.learningOutcomesMost && (
                            <Typography color="error" fontSize={12}>
                              {formik.errors.learningOutcomesMost}
                            </Typography>
                          )}
                      </div>
                      <div
                        className="control_group"
                        style={{ marginTop: "15px" }}
                      >
                        <label htmlFor="SomeLearnersWillBeAbleTo">
                          Some learners
                        </label>

                        <Input
                          fullWidth
                          placeholder="Some learners will be able to.."
                          name="learningOutcomesSome"
                          value={formik.values.learningOutcomesSome}
                          onChange={(e) => { if (isValidInput(e.target.value)) formik.handleChange(e) }}
                          onBlur={formik.handleBlur}
                          minRows={4}
                          multiline
                        />
                        {formik.touched.learningOutcomesSome &&
                          formik.errors.learningOutcomesSome && (
                            <Typography color="error" fontSize={12}>
                              {formik.errors.learningOutcomesSome}
                            </Typography>
                          )}
                      </div>
                      {/* upload file */}
                      <div className="conrtol_group">
                        <label>Class Thumbnail (Png,JPG up to 10MB)</label>
                        {formik.values.thumbnail ? (
                          <div className="ovr_flow">
                            <div className="upload_file">
                              <figure>
                                <img
                                  src={
                                    formik.values.thumbnail ||
                                    `/static/images/emili.png`
                                  }
                                  alt="emili"
                                />
                                <figcaption
                                  onClick={() =>
                                    formik.setFieldValue("thumbnail", "")
                                  }
                                  style={{ cursor: "pointer" }}
                                >
                                  <CancelIcon />
                                </figcaption>
                              </figure>
                            </div>
                          </div>
                        ) : (
                          <div className="upload_file">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                            />
                            {imageLoading ? (<CircularProgress size={20} />) : (<DriveFolderUploadIcon />)}

                            <p>Upload Images</p>

                            {/* ✅ Image upload validation message */}
                            {formik.errors.thumbnail &&
                              typeof formik.errors.thumbnail === "string" && (
                                <Typography color="error" fontSize={12}>
                                  {formik.errors.thumbnail}
                                </Typography>
                              )}
                          </div>
                        )}
                      </div>
                      <div className="conrtol_group">
                        <label>Upload Video (MP4,MOV upto 100 MB)</label>
                        {formik.values.teaserVideo ? (
                          <div className="ovr_flow">
                            <div className="upload_file">
                              <figure>
                                <video
                                  controls
                                  src={
                                    formik.values.teaserVideo ||
                                    `/static/images/emili.png`
                                  }
                                />
                                <figcaption
                                  onClick={() =>
                                    formik.setFieldValue("teaserVideo", "")
                                  }
                                  style={{ cursor: "pointer" }}
                                >
                                  <CancelIcon />
                                </figcaption>
                              </figure>
                            </div>
                          </div>
                        ) : (
                          <div className="upload_file ">
                            {/* <label htmlFor="UploadTeaserVideo" className="form_label">Upload Teaser Video</label> */}
                            <input
                              id="UploadTeaserVideo"
                              type="file"
                              accept="video/*"
                              style={{ display: "none" }}
                              onChange={(e: any) => handleVideoChange(e)}
                            />
                            <label htmlFor="UploadTeaserVideo" className="btn_upload">
                              {videoLoading ? (<CircularProgress size={20} />) : (<DriveFolderUploadIcon />)}

                            </label>

                            {formik.errors.teaserVideo &&
                              typeof formik.errors.teaserVideo === "string" && (
                                <Typography color="error" fontSize={12}>
                                  {formik.errors.teaserVideo}
                                </Typography>
                              )}
                          </div>
                        )}
                      </div>

                      {formik.values.material ? (
                        <div className="ovr_flow">
                          <div className="upload_file">
                            {/* <figure> */}
                            <iframe
                              src={`https://docs.google.com/gview?url=${encodeURIComponent(
                                formik.values.material
                              )}&embedded=true`}
                              style={{
                                width: "100%",
                                height: "200px",
                                border: "1px solid #e0e0e0",
                                borderRadius: "4px",
                              }}
                              title={'PDF Document'}
                            />

                            <figcaption
                              onClick={() =>
                                formik.setFieldValue("material", "")
                              }
                              style={{ cursor: "pointer" }}
                            >
                              <CancelIcon />
                            </figcaption>
                            x
                          </div>
                        </div>
                      ) : (
                        <div className="upload_file">
                          <label htmlFor="UploadMaterial">
                            Upload material
                          </label>
                          <input
                            type="file"
                            accept="application/pdf"
                            onChange={handlePdfChange}
                          />
                          {pdfLoading ? <CircularProgress size={20} /> : <DriveFolderUploadIcon />}
                          <p>Upload Pdf</p>

                          {/* ✅ Image upload validation message */}
                          {formik.errors.material &&
                            typeof formik.errors.material === "string" && (
                              <Typography color="error" fontSize={12}>
                                {formik.errors.material}
                              </Typography>
                            )}
                        </div>
                      )}

                      <div className="control_group" style={{ marginTop: "15px" }}>
                        <label htmlFor="gradeOption" className="form_label">
                          Grades
                        </label>

                        <MuiAutoComplete
                          multiple
                          id="gradeOption"
                          options={gradeOptions}
                          getOptionLabel={(option) => GRADE_TYPE_NAME[option]}
                          value={formik.values.gradeOption || []}
                          onChange={(_, newValue) => {
                            formik.setFieldValue("gradeOption", newValue);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Select Grades"
                              onBlur={formik.handleBlur}
                              error={
                                formik.touched.gradeOption && Boolean(formik.errors.gradeOption)
                              }
                              helperText={
                                formik.touched.gradeOption && formik.errors.gradeOption
                                  ? (formik.errors.gradeOption as string)
                                  : ""
                              }
                            />
                          )}
                          disableCloseOnSelect
                          fullWidth
                        />
                      </div>
                      <div
                        className="control_group"
                        style={{ marginTop: "15px" }}
                      >
                        <label htmlFor="currency" className="form_label">Currency</label>
                        <Select id="currency"
                          name="currency"
                          value={formik.values.currency}
                          onChange={(e) => { if (isValidInput(e.target.value)) formik.handleChange(e) }}
                          onBlur={formik.handleBlur}
                          fullWidth
                          displayEmpty
                        >
                          <MenuItem value="" disabled>
                            Select Currency
                          </MenuItem>
                          {currency?.map((item: any) => {
                            return (
                              <MenuItem key={item?.id} value={item?.currency}>
                                {item?.title}
                              </MenuItem>
                            );
                          })}
                        </Select>
                        {formik.touched.currency &&
                          formik.errors.currency && (
                            <Typography color="error" fontSize={12}>
                              {formik.errors.currency}
                            </Typography>
                          )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Checkbox
                          name="freeLesson"
                          checked={formik.values.freeLesson}
                          onChange={(e) => { if (isValidInput(e.target.value)) formik.handleChange(e) }}
                        />
                        <label>Free session</label>
                      </div>


                      <div
                        className="control_group"
                        style={{ marginTop: "15px" }}
                      >
                        <Input
                          fullWidth
                          placeholder="fee per student.."
                          name="feePerStudent"
                          value={formik.values.feePerStudent}
                          onChange={(e) => { if (isValidInput(e.target.value)) formik.handleChange(e) }}
                          onBlur={formik.handleBlur}
                          disabled={formik.values.freeLesson ? true : false}
                        />
                        {formik.touched.feePerStudent &&
                          formik.errors.feePerStudent && (
                            <Typography color="error" fontSize={12}>
                              {formik.errors.feePerStudent}
                            </Typography>
                          )}
                      </div>

                      <div className='control_group'>
                        <label>Payment Type</label>
                        <div className='gap_p'>
                          <div style={{ display: 'flex', alignItems: 'center' }} className="control_group w_50">
                            <label>Per Hour</label>
                            <Radio
                              name="paymentType"
                              checked={
                                formik.values.paymentType === CLASS_PAYMENT.PER_HOUR
                              }
                              onChange={() =>
                                formik.setFieldValue(
                                  "paymentType",
                                  CLASS_PAYMENT.PER_HOUR
                                )
                              }
                            />
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center' }} className="control_group w_50">
                            <label>Per Session</label>
                            <Radio
                              name="paymentType"
                              checked={
                                formik.values.paymentType === CLASS_PAYMENT.SESSION
                              }
                              onChange={() =>
                                formik.setFieldValue(
                                  "paymentType",
                                  CLASS_PAYMENT.SESSION
                                )
                              }
                            />
                          </div>
                        </div>
                      </div>

                      <div className="control_group" style={{ marginTop: "15px" }}>
                        <label htmlFor="promoCode" className="form_label">Promo code</label>

                        <MuiAutoComplete<PromoItem, true, false, false>
                          multiple
                          id="promoCode"
                          options={promoCode?.data || []}
                          getOptionLabel={(option) => option?.name || ""}
                          value={
                            (promoCode?.data?.filter((p: PromoItem) =>
                              // @ts-ignores
                              (formik.values.promoCode || []).includes(p._id)
                            ) as PromoItem[]) || []
                          }
                          onChange={(_: React.SyntheticEvent, newValue: PromoItem[]) => {
                            // Store only IDs in Formik
                            formik.setFieldValue(
                              "promoCode",
                              newValue.map((p) => p._id)
                            );
                          }}
                          disableCloseOnSelect
                          fullWidth
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Select Promo code"
                              error={formik.touched.promoCode && Boolean(formik.errors.promoCode)}
                              helperText={
                                formik.touched.promoCode && formik.errors.promoCode
                                  ? String(formik.errors.promoCode)
                                  : ""
                              }
                            />
                          )}
                        />

                        {formik.touched.promoCode && formik.errors.promoCode && (
                          <Typography color="error" fontSize={12}>
                            {formik.errors.promoCode as string}
                          </Typography>
                        )}
                      </div>

                      <div
                        className="control_group"
                        style={{ marginTop: "15px" }}
                      >
                        <label htmlFor="seatLimit" className="form_label">Seat limit</label>
                        <Input
                          fullWidth
                          placeholder="Seat limit"
                          name="seatLimit"
                          value={formik.values.seatLimit}
                          onChange={(e) => { if (isValidInput(e.target.value)) formik.handleChange(e) }}
                          onBlur={formik.handleBlur}
                        />
                        {formik.touched.seatLimit &&
                          formik.errors.seatLimit && (
                            <Typography color="error" fontSize={12}>
                              {formik.errors.seatLimit}
                            </Typography>
                          )}
                      </div>

                      <div
                        className="control_group"
                        style={{ marginTop: "15px" }}
                      >
                        <label htmlFor="typeOfClass" className="form_label">Class type</label>
                        <Select id="typeOfClass"
                          name="typeOfClass"
                          value={formik.values.typeOfClass}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          fullWidth
                          displayEmpty
                        >
                          <MenuItem value="" disabled>
                            Select class type
                          </MenuItem>
                          <MenuItem value={ClassMode.ONLINE}>Online</MenuItem>
                          <MenuItem value={ClassMode.OFFLINE}>Offline</MenuItem>
                          <MenuItem value={ClassMode.HYBRID}>Hybrid</MenuItem>
                        </Select>
                        {formik.touched.typeOfClass &&
                          formik.errors.typeOfClass && (
                            <Typography color="error" fontSize={12}>
                              {formik.errors.typeOfClass}
                            </Typography>
                          )}
                      </div>
                      {formik.values.typeOfClass == String(ClassMode.OFFLINE) ||
                        formik.values.typeOfClass == String(ClassMode.HYBRID) ? (
                        <Autocomplete
                          onLoad={onLoad}
                          onPlaceChanged={() => onPlaceChanged()}
                        >
                          <div className="form_control">
                            <label>Address</label>
                            <TextField
                              id="standard-basic"
                              variant="standard"
                              name="address"
                              value={formik.values.address}
                              fullWidth
                              hiddenLabel
                              placeholder="Enter address "
                              onBlur={formik.handleBlur}
                              helperText={
                                formik.touched.address &&
                                (formik.errors.address as string)
                              }
                              onChange={(e) => { if (isValidInput(e.target.value)) formik.handleChange(e) }}
                            ></TextField>
                          </div>
                        </Autocomplete>
                      ) : null}

                      <div className="control_group" style={{ marginTop: "15px" }}>
                        <label htmlFor="coTeacher" className="form_label">Co-teacher</label>

                        <MuiAutoComplete
                          multiple
                          id="coTeacher"
                          options={tutorList?.data || []}
                          getOptionLabel={(option: any) => option?.name || ""}
                          value={
                            tutorList?.data?.filter((t: any) =>
                              // @ts-ignores
                              (formik.values.coTeacher || [])?.includes(t?._id)
                            ) || []
                          }
                          onChange={(_: React.SyntheticEvent, newValue: any[]) => {
                            // Store only IDs in formik
                            formik.setFieldValue(
                              "coTeacher",
                              newValue.map((t) => t._id)
                            );
                          }}
                          disableCloseOnSelect
                          fullWidth
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Select co-teacher"
                              error={formik.touched.coTeacher && Boolean(formik.errors.coTeacher)}
                              helperText={
                                formik.touched.coTeacher && formik.errors.coTeacher
                                  ? String(formik.errors.coTeacher)
                                  : ""
                              }
                            />
                          )}
                        />

                        {formik.touched.coTeacher && formik.errors.coTeacher && (
                          <Typography color="error" fontSize={12}>
                            {formik.errors.coTeacher as string}
                          </Typography>
                        )}
                      </div>



                      <div className="control_group" style={{ marginTop: "15px" }}>
                        <label htmlFor="timeZone" className="form_label">Time Zone</label>

                        <MuiAutoComplete<TimezoneItem, false, false, false>
                          id="timeZone"
                          options={timezone || []}
                          getOptionLabel={(option) => option?.label || ""}
                          value={
                            timezone?.find((t: TimezoneItem) => t.value === formik.values.timeZone) ||
                            null
                          }
                          onChange={(_: React.SyntheticEvent, newValue: TimezoneItem | null) => {
                            formik.setFieldValue("timeZone", newValue ? newValue.value : "");
                          }}
                          fullWidth
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Select timezone"
                              error={formik.touched.timeZone && Boolean(formik.errors.timeZone)}
                              helperText={
                                formik.touched.timeZone && formik.errors.timeZone
                                  ? String(formik.errors.timeZone)
                                  : ""
                              }
                            />
                          )}
                        />

                       
                      </div>

                      {/* CustomSelector Component */}
                      <div style={{ marginTop: "20px", width: "100%" }}>
                        <CustomSelector
                          slotDates={slotDates}
                          setSlotDates={setSlotDates}
                          slotTime={slotTime}
                          setSlotTime={setSlotTime}
                          startDate={startDate}
                          setStartDate={setStartDate}
                          endDate={endDate}
                          setEndDate={setEndDate}
                          repeatEveryWeeks={repeatEveryWeeks}
                          setRepeatEveryWeeks={setRepeatEveryWeeks}
                          continueForWeeks={continueForWeeks}
                          setContinueForWeeks={setContinueForWeeks}
                          slotDuration={slotDuration}
                          setSlotDuration={setSlotDuration}
                          selectedTime={selectedTime}
                          setSelectedTime={setSelectedTime}
                          formSubmitted={formSubmitted}
                        />
                      </div>


                      <div className="control_group" style={{ marginTop: "15px" }}>
                        <label htmlFor="searchTags" className="form_label">Searchable Tags</label>
                        <Input
                          id="searchTags"
                          fullWidth
                          placeholder="Searchable tags"
                          name="searchTags"
                          value={formik.values.searchTags}
                          onChange={(e) => { if (isValidInput(e.target.value)) formik.handleChange(e) }}
                          onBlur={formik.handleBlur}
                        />
                        {formik.touched.searchTags && formik.errors.searchTags && (
                          <Typography color="error" fontSize={12}>
                            {formik.errors.searchTags}
                          </Typography>
                        )}
                      </div>

                      <div className="control_group" style={{ marginTop: "15px" }}>
                        <label htmlFor="instructionLanguage" className="form_label">Instruction Language</label>
                        <Select
                          id="instructionLanguage"
                          name="instructionLanguage"
                          value={formik.values.instructionLanguage}
                          onChange={(e) => { if (isValidInput(e.target.value)) formik.handleChange(e) }}
                          onBlur={formik.handleBlur}
                          fullWidth
                          displayEmpty
                        >
                          <MenuItem value="" disabled>
                            Select Instruction Language
                          </MenuItem>
                          <MenuItem value="1">English</MenuItem>
                          <MenuItem value="2">Arabic</MenuItem>
                        </Select>
                        {formik.touched.instructionLanguage &&
                          formik.errors.instructionLanguage && (
                            <Typography color="error" fontSize={12}>
                              {formik.errors.instructionLanguage}
                            </Typography>
                          )}
                      </div>

                      <div
                        className="control_group"
                        style={{ marginTop: "15px" }}
                      >
                        <label>Custom notes</label>
                        {formik.values.customNotes || !id ? (
                          <EditText
                            content={formik.values.customNotes}
                            setContent={(value) =>
                              formik.setFieldValue("customNotes", value)
                            }
                          />
                        ) : null}

                        {formik.touched.customNotes &&
                          formik.errors.customNotes && (
                            <Typography color="error" fontSize={12}>
                              {formik.errors.customNotes}
                            </Typography>
                          )}
                      </div>

                      <div
                        className="control_group"
                        style={{ display: 'flex', alignItems: 'center', marginTop: "15px" }}
                      >
                        <label>Allow for private class</label>
                        <Checkbox
                          name="allowPrivateClass"
                          checked={formik.values.allowPrivateClass}
                          onChange={(e) => { if (isValidInput(e.target.value)) formik.handleChange(e) }}
                        />
                      </div>
                      <div className="control_group">
                        <label id="classType2-label">Class Type</label>
                        <FormControl fullWidth size="small">
                          <Select
                            labelId="classType2-label"
                            id="classType2"
                            name="classType2"
                            label="Class Type"
                            value={formik.values.classType2}
                            onChange={formik.handleChange}
                            displayEmpty
                          >
                            <MenuItem value="">Select class type</MenuItem>
                            <MenuItem value={CLASS_TYPE2.NORMAL}>Normal</MenuItem>
                            <MenuItem value={CLASS_TYPE2.MASTER}>Master</MenuItem>
                            <MenuItem value={CLASS_TYPE2.WORKSHOP}>Workshop</MenuItem>
                            <MenuItem value={CLASS_TYPE2.SEMINAR}>Seminar</MenuItem>
                          </Select>
                          {formik.touched.classType2 && formik.errors.classType2 && (
                            <Typography color="error" fontSize={12}>
                              {formik.errors.classType2}
                            </Typography>
                          )}
                        </FormControl>
                      </div>


                      <div className="btn_group">
                        <button
                          type="button"
                          className="btn primary"
                          onClick={async () => {
                            await setSetting(CLASS_SETTING.DRAFT);
                            formik.submitForm();
                          }}
                        >
                          {isLoading ? <CircularProgress size={15} /> : "Save as Draft"}
                        </button>

                        <button
                          type="button"
                          className="btn primary"
                          onClick={async () => {
                            await setSetting(CLASS_SETTING.PUBLISH);
                            formik.submitForm();
                          }}
                        >
                          {isLoading ? <CircularProgress size={15} /> : "Create Class"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
        <SelectDateModal
          open={openDate}
          onClose={handleCloseModal2}
          setOpen={setOpenDate}
          selectedDates={selectedDates}
          setSelectedDates={setSelectedDates}
          value={value}
          setValue={setValue}
        />
        <SelectTimeSlotModal
          open={openTime}
          onClose={handleCloseModal3}
          selectedDates={selectedDates}
          slots={slots}
          setSlots={setSlots}
        />
      </TutorLayout>
    </>
  );
};

export default CreateClassTutor;
