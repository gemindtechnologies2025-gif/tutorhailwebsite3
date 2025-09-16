import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  RadioGroup,
  FormControlLabel,
  Radio,
  Slider,
  Button,
  IconButton,
  Backdrop,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Checkbox,
  ListItemText,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import CloseIcon from "@mui/icons-material/Close";
import useGetSubject from "../../../apiHooks/getSubject";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useFilters } from "../../../context/filterContext";
import { Autocomplete } from "@react-google-maps/api";
dayjs.extend(utc);
function valuetext(value: number) {
  return `$${value.toString()}`;
}
type Grade = { name: string };

type filtersType = {
  experience: string;
  teachingStyle: string;
  verification: string;
  lang: string;
  gender: string;
  time: string;
  curriculam: string;
  rating: string;
  grade: string;
  location: string;
  latitude: string;
  longitude: string;
};

type props = {
  fetchData: () => void;
  setPage: Dispatch<SetStateAction<number>>;
};

const timeOptions = [
  { value: "9-10", label: "9-10 AM" },
  { value: "10-11", label: "10-11 AM" },
  { value: "11-12", label: "11-12 PM" },
  { value: "12-13", label: "12-1 PM" },
  { value: "13-14", label: "1-2 PM" },
  { value: "14-15", label: "2-3 PM" },
  { value: "15-16", label: "3-4 PM" },
  { value: "16-17", label: "4-5 PM" },
  { value: "17-18", label: "5-6 PM" },
  { value: "18-19", label: "6-7 PM" },
  { value: "19-20", label: "7-8 PM" },
  { value: "20-21", label: "8-9 PM" },
  { value: "21-22", label: "9-10 PM" },
  { value: "22-23", label: "10-11 PM" },
];
let isFilter = false;
export default function FilterSidebar({ fetchData, setPage }: props) {
  const navigate = useNavigate(); // hook for the navigatgion
  const [applyTrue, setApplyTrue] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useSearchParams();
  // API hooks
  const { subject } = useGetSubject(); // custom api hook to fetch the subjects

  // States
  const [isActive, setIsActive] = useState(false);
  const [autocomplete, setAutocomplete] = useState(null); // state to store the autocomplete for the google places api

  const {
    filters,
    setFilters,
    value,
    setValue,
    time,
    setTime,
    selectedSubjects,
    setSelectedSubjects,
  } = useFilters();

  const handleClick = () => {
    setIsActive(!isActive);
  };

  // function to handle the subject selection
  const handleChangeSubject = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;

    setSelectedSubjects(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };
  console.log(selectedSubjects, "seleeeee");
  // onChange to handle the experience level
  const handleExperienceChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const val = event.target.value;
    setFilters((prev) => ({
      ...prev,
      experience: val,
    }));
  };

  // onchange handler for the teaching style
  const handleTeachingStyleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    value: number
  ) => {
    setFilters((prev) => {
      const newTeachingStyle = event.target.checked
        ? [...prev.teachingStyle, value]
        : prev.teachingStyle.filter((item) => item !== value);

      return {
        ...prev,
        teachingStyle: newTeachingStyle,
      };
    });
  };
  // onChange handler for the verification status
  const handleVerificationChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const val = event.target.value;
    setFilters((prev) => ({
      ...prev,
      verification: val,
    }));
  };

  // onChangeHandler for the language
  const handleLanguageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setFilters((prev) => ({
      ...prev,
      lang: value,
    }));
  };

  // onChange Handler for the gender selection
  const handleGenderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setFilters((prev) => ({
      ...prev,
      gender: value,
    }));
  };

  // onChangeHandler for the time
  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    const currentDate = dayjs().format("YYYY-MM-DD");
    const [startTime, endTime] = value?.split("-").map((str) => str.trim());

    const startTimeUTC = dayjs(`${currentDate} ${startTime}`).utc().format();
    const endTimeUTC = dayjs(`${currentDate} ${endTime}`).utc().format();
    setFilters((prev) => ({
      ...prev,
      time: value,
    }));
    setTime((prev) => ({
      startTime: startTimeUTC,
      endTime: endTimeUTC,
    }));
  };

  // onChange handler for the curriculam
  // onChange handler for the curriculam
  const handleCurriculamChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    value: number
  ) => {
    setFilters((prev) => {
      const newCurriculam = event.target.checked
        ? [...prev.curriculam, value]
        : prev.curriculam.filter((item) => item !== value);

      return {
        ...prev,
        curriculam: newCurriculam,
      };
    });
  };

  // onChange Handler for the rating
  const handleRatingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setFilters((prev) => ({
      ...prev,
      rating: value,
    }));
  };

  const handleGradeChange = (event: SelectChangeEvent<Grade[]>) => {
    const value = event.target.value as Grade[];
    setFilters((prev) => ({
      ...prev,
      grade: value,
    }));
  };

  // loading fucntion for the google places api
  const onLoad = (autocompleteObj: any) => {
    setAutocomplete(autocompleteObj);
  };

  const gradeOptions: any[] = [
    { name: "0", label: "Pre primary(Kg/Foundation)" },
    { name: "1", label: "Primary" },
    { name: "2", label: "Middle school (O-level)" },
    { name: "3", label: "High school (A-level)" },
    { name: "4", label: "College" },
    { name: "5", label: "Other" },
  ];
  const onPlaceChanged = async () => {
    if (autocomplete) {
      let place = await (autocomplete as any).getPlace();

      if (place && place.address_components) {
        let address = place.address_components;

        let state,
          city: string,
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

        setFilters((prev) => ({
          ...prev,
          location: city,
          latitude: lat,
          longitude: lng,
        }));
        // formik.setFieldValue("country", `${country}`);
        // formik.setFieldValue("city", city);
        // formik.setFieldValue("latitude", lat || "");
        // formik.setFieldValue("longitude", lng || "");
      }
    }
  };

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
        return "";
    }
  };

  // function to reset filters
  const handleResetFilter = () => {
    setApplyTrue(false);
    setSearchParams("");
    setPage(1);
    setFilters(() => ({
      experience: "",
      teachingStyle: [],
      verification: "",
      lang: "",
      gender: "",
      time: "",
      curriculam: [],
      rating: "",
      grade: [],
      location: "",
      latitude: "",
      longitude: "",
    }));
    setValue([0, 1000]);
    setSelectedSubjects([]);
    setTime(() => ({
      startTime: "",
      endTime: "",
    }));
    fetchData();

    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to the top after a brief delay
    }, 100);
  };

  const createSearchParams = (
    filters: filtersType,
    time: any,
    value: number[],
    selectedSubjects: string[]
  ) => {
    const params: Record<string, string> = {};

    const addIfNotEmpty = (key: string, value: any) => {
      if (value !== undefined && value !== null && value !== "") {
        params[key] = value.toString();
      }
    };

    addIfNotEmpty("experience", filters.experience);
    addIfNotEmpty("teachingStyle", filters.teachingStyle);
    addIfNotEmpty("verification", filters.verification);
    addIfNotEmpty("lang", filters.lang);
    addIfNotEmpty("gender", filters.gender);
    addIfNotEmpty("time", filters.time);
    addIfNotEmpty("curriculam", filters.curriculam);
    addIfNotEmpty("rating", filters.rating);
    addIfNotEmpty("grade", filters.grade);
    addIfNotEmpty("location", filters.location);
    addIfNotEmpty("latitude", filters.latitude);
    addIfNotEmpty("longitude", filters.longitude);
    addIfNotEmpty("startTime", time.startTime);
    addIfNotEmpty("endTime", time.endTime);
    addIfNotEmpty("fromPrice", value[0]);
    addIfNotEmpty("toPrice", value[1]);
    if (selectedSubjects.length > 0) {
      params["subjects"] = selectedSubjects.join(","); // Joining subjects with a comma
    }
    return new URLSearchParams(params);
  };
  // function to apply the filters and navigating on the other page

  const applyFilter = () => {
    // const hasEmptyValues =
    //   Object.values(filters).every((value) => value === "") &&
    //   selectedSubjects?.length === 0;
    // if (hasEmptyValues) return;

    setSearchParams("");
    setPage(1);
    fetchData();
    setApplyTrue(!applyFilter);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to the top after a brief delay
    }, 0);
    // const searchParams = createSearchParams(
    //   filters,
    //   time,
    //   value,
    //   selectedSubjects
    // );
    // navigate("/parent/search-result?" + searchParams.toString());
  };

  const handleChange = (
    event: Event,
    newValue: number | number[],
    activeThumb: number
  ) => {
    if (!Array.isArray(newValue)) {
      return;
    }
    const [min, max] = newValue;
    if (max - min >= 30) {
      setValue(newValue);
    }
  };

  // useEffect(() => {

  //     fetchData()

  // }, [applyTrue]);

  return (
    <>
      <div className="filter_btn">
        <Button onClick={handleClick}>
          <FilterAltIcon /> Filter
        </Button>
      </div>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isActive}
        onClick={handleClick}
      ></Backdrop>
      <aside className={isActive ? "filter_aside active" : "filter_aside"}>
        <IconButton className="roundIcon_btn" onClick={handleClick}>
          <CloseIcon />
        </IconButton>
        <div className="filterBox">
          <h2>FILTER YOUR CHOICES</h2>
          <div className="single">
            <h3>Experience Level</h3>
            <RadioGroup
              className="checkbox_label round"
              value={filters.experience}
              aria-labelledby="demo-radio-buttons-group-label"
              name="radio-buttons-group"
              onChange={handleExperienceChange}
            >
              <FormControlLabel value="1" control={<Radio />} label={<>1</>} />
              <FormControlLabel value="2" control={<Radio />} label={<>2</>} />
              <FormControlLabel value="3" control={<Radio />} label={<>3</>} />
              <FormControlLabel value="4" control={<Radio />} label={<>4</>} />
              <FormControlLabel value="5" control={<Radio />} label={<>5+</>} />
            </RadioGroup>
          </div>
          <div className="single">
            <h3>Teaching Style</h3>
            <div className="checkbox_label flex">
              {[
                { value: 1, label: "Visual Learning" },
                { value: 2, label: "Auditory Learning" },
                { value: 3, label: "Reading and Writing" },
                { value: 4, label: "Integrated Approach" },
                { value: 5, label: "Other" },
              ].map((option) => (
                <FormControlLabel
                  key={option.value}
                  control={
                    <Checkbox
                      checked={filters.teachingStyle.includes(option.value)}
                      onChange={(e: any) =>
                        handleTeachingStyleChange(e, option.value)
                      }
                    />
                  }
                  label={option.label}
                />
              ))}
            </div>
          </div>
          <div className="single">
            <h3>Verification status</h3>
            <RadioGroup
              className="checkbox_label"
              value={filters.verification}
              aria-labelledby="demo-radio-buttons-group-label"
              name="radio-buttons-group"
              onChange={handleVerificationChange}
            >
              <FormControlLabel
                value="1"
                control={<Radio />}
                label="Verified"
              />
              <FormControlLabel
                value="2"
                control={<Radio />}
                label="Unverified"
              />
            </RadioGroup>
          </div>
          <div className="single">
            <h3>Choose Language</h3>
            <RadioGroup
              className="checkbox_label flex"
              value={filters.lang}
              aria-labelledby="demo-radio-buttons-group-label"
              name="radio-buttons-group"
              onChange={handleLanguageChange}
            >
              <FormControlLabel value="1" control={<Radio />} label="English" />
              <FormControlLabel value="2" control={<Radio />} label="Arabic" />
              <FormControlLabel value="3" control={<Radio />} label="Both" />
            </RadioGroup>
          </div>
          <div className="single">
            <h3>Gender</h3>
            <RadioGroup
              className="checkbox_label flex"
              value={filters.gender}
              aria-labelledby="demo-radio-buttons-group-label"
              name="radio-buttons-group"
              onChange={handleGenderChange}
            >
              <FormControlLabel value="MALE" control={<Radio />} label="Male" />
              <FormControlLabel
                value="FEMALE"
                control={<Radio />}
                label="Female"
              />
            </RadioGroup>
          </div>
          <div className="single">
            <h3>Select Time</h3>

            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              name="radio-buttons-group"
              className="checkbox_label round"
              value={filters.time}
              onChange={handleTimeChange}
            >
              {timeOptions.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio />}
                  label={option.label}
                />
              ))}
            </RadioGroup>
          </div>
          <div className="single">
            <h3>Curriculum</h3>
            <div className="checkbox_label flex0">
              {[
                { value: 1, label: "National Curriculum" },
                { value: 2, label: "Cambridge Curriculum" },
                { value: 3, label: "IB Curriculum" },
                { value: 4, label: "American Curriculum" },
              ].map((option) => (
                <FormControlLabel
                  key={option.value}
                  control={
                    <Checkbox
                      checked={filters.curriculam.includes(option.value)}
                      onChange={(e: any) =>
                        handleCurriculamChange(e, option.value)
                      }
                    />
                  }
                  label={option.label}
                />
              ))}
            </div>
          </div>
          <div className="single">
            <h3>Class taught/grade or year</h3>
            <div className="control_group w_100">
              <Select
                labelId="language-label"
                id="grade"
                multiple
                value={filters.grade}
                onChange={handleGradeChange}
                displayEmpty
                renderValue={(selected) =>
                  selected.length
                    ? selected
                        .map((g) => {
                          return getLevelName(String(g));
                        })
                        .join(", ")
                    : "Select grade"
                }
              >
                <MenuItem value="" disabled>
                  Select grade
                </MenuItem>
                {gradeOptions?.map((grade: any) => (
                  <MenuItem key={grade.name} value={grade.name}>
                    <Checkbox
                      checked={filters.grade.some((g: any) => {
                        return g === grade.name;
                      })}
                    />
                    <ListItemText primary={grade.label} />
                  </MenuItem>
                ))}
              </Select>
            </div>
          </div>
          <div className="single">
            <h3>Location</h3>
            <Autocomplete
              onLoad={onLoad}
              onPlaceChanged={() => onPlaceChanged()}
            >
              <TextField
                // className="text_field"
                sx={{
                  height: "48px",
                }}
                name="location"
                value={filters.location}
                fullWidth
                hiddenLabel
                placeholder="Search location"
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    location: e.target.value,
                  }))
                }
                // onBlur={formik.handleBlur}
                // helperText={formik.touched.city && formik.errors.city}
                // onChange={formik.handleChange}
              ></TextField>
            </Autocomplete>
          </div>
          <div className="single">
            <h3>Select subject</h3>
            <div className="control_group w_100">
              <Select
                labelId="language-label"
                id="language"
                value={selectedSubjects}
                onChange={handleChangeSubject}
                multiple
                displayEmpty
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 250,
                    },
                  },
                }}
                renderValue={(selected) => {
                  if (selected.length === 0) {
                    return <span>Select subject</span>;
                  }

                  return selected
                    .map((value) => {
                      const item = subject.find((a) => a.name === value);
                      return item ? item.name : "";
                    })
                    .join(", ");
                }}
              >
                <MenuItem value="" disabled>
                  Select subject
                </MenuItem>
                {subject?.map((item, index) => (
                  <MenuItem key={item?._id} value={item?.name}>
                    {item?.name || ""}
                  </MenuItem>
                ))}
              </Select>
            </div>
          </div>
          <div className="single">
            <h3>Price Range</h3>
            <Slider
              min={0}
              max={1000}
              value={value}
              onChange={handleChange}
              getAriaValueText={valuetext}
              valueLabelFormat={valuetext}
              valueLabelDisplay="on"
              disableSwap
              step={10}
              getAriaLabel={() => "Price range"}
            />
          </div>
          <div className="single">
            <h3>Ratings</h3>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              value={filters.rating}
              name="radio-buttons-group"
              className="checkbox_label round"
              onChange={handleRatingChange}
            >
              <FormControlLabel
                value="1"
                control={<Radio />}
                label={
                  <>
                    1.0 <StarIcon />
                  </>
                }
              />
              <FormControlLabel
                value="2"
                control={<Radio />}
                label={
                  <>
                    2.0 <StarIcon />
                  </>
                }
              />
              <FormControlLabel
                value="3"
                control={<Radio />}
                label={
                  <>
                    3.0 <StarIcon />
                  </>
                }
              />
              <FormControlLabel
                value="4"
                control={<Radio />}
                label={
                  <>
                    4.0 <StarIcon />
                  </>
                }
              />
              <FormControlLabel
                value="5"
                control={<Radio />}
                label={
                  <>
                    5.0 <StarIcon />
                  </>
                }
              />
            </RadioGroup>
          </div>
          <div className="btn_flex">
            <Button
              variant="outlined"
              onClick={() => handleResetFilter()}
              color="primary"
            >
              Reset
            </Button>
            <Button onClick={() => applyFilter()}>Apply</Button>
          </div>
        </div>
        {/* <div className="filterBox">
          <h2>SORT YOUR CHOICES</h2>
          <div className="single">
            <RadioGroup
              className="checkbox_label"
              defaultValue="Price - Low to High"
              aria-labelledby="demo-radio-buttons-group-label"
              name="radio-buttons-group"
            >
              <FormControlLabel
                value="Popular"
                control={<Radio />}
                label="Popular"
              />
              <FormControlLabel
                value="Price - Low to High"
                control={<Radio />}
                label="Price - Low to High"
              />
              <FormControlLabel
                value="Price - High to Low"
                control={<Radio />}
                label="Price - High to Low"
              />
            </RadioGroup>
          </div>
        </div> */}
      </aside>
    </>
  );
}
