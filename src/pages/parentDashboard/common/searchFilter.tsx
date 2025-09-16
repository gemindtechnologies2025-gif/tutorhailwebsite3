import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Slider,
  Button,
  Select,
  MenuItem,
  SelectChangeEvent,
  IconButton,
  Checkbox,
  ListItemText,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { useFilters } from "../../../context/filterContext";
import dayjs from "dayjs";
import ClearIcon from '@mui/icons-material/Clear';
import utc from "dayjs/plugin/utc";
import useGetSubject from "../../../apiHooks/getSubject";
import { Autocomplete } from "@react-google-maps/api";
dayjs.extend(utc);
function valuetext(value: number) {
  return `$${value.toString()}`;
}

type Grade = { name: string }

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

type props = {
  setPage: Dispatch<SetStateAction<number>>;
  setHasMore: Dispatch<SetStateAction<boolean>>;
  setShowSearchResult: Dispatch<SetStateAction<boolean>>;
  fetchData: () => void;
};
export default function SearchFilter({ setPage, setHasMore, setShowSearchResult, fetchData }: props) {
  const navigate = useNavigate();
  const {
    filters,
    setFilters,
    value,
    setValue,
    time,
    setTime,
    selectedSubjects,
    setSelectedSubjects,
    setFlag,
  } = useFilters();

  const [searchParams, setSearchParams] = useSearchParams(); // hook to the get the values from the searhcParams
  const [autocomplete, setAutocomplete] = useState(null); // state to store the autocomplete for the google places api
  // API hooks
  const { subject } = useGetSubject(); // custom api hook to fetch the subjects

  const updateSearchParams = (key: string, value: string) => {
    setSearchParams(
      (prevParams) => {
        const newParams = new URLSearchParams(prevParams);
        newParams.set(key, value);
        // Use replace to update the URL without adding a new entry in the history stack
        return newParams;
      },
      { replace: true }
    );
  };
  // loading fucntion for the google places api
  const onLoad = (autocompleteObj: any) => {
    setAutocomplete(autocompleteObj);
  };

  const onPlaceChanged = async () => {
    if (autocomplete) {
      let place = await (autocomplete as any).getPlace();

      if (place && place.address_components) {
        let address = place.address_components;

        let state: string,
          city: string,
          country: string,
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
          location: `${city ? city + "," : ""}${state ? state + "," : ""}${country ? country : ""}${zip ? "," + zip : ""}`,
          latitude: lat,
          longitude: lng,
        }));
      }
    }
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
  // onChange to handle the experience level
  const handleExperienceChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const val = event.target.value;
    setFilters((prev) => ({
      ...prev,
      experience: val,
    }));
    updateSearchParams("experience", val);
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

      updateSearchParams("teachingStyle", newTeachingStyle.join(','));

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
    updateSearchParams("verification", val);
  };

  // onChangeHandler for the language
  const handleLanguageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setFilters((prev) => ({
      ...prev,
      lang: value,
    }));
    updateSearchParams("lang", value);
  };

  // onChange Handler for the gender selection
  const handleGenderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setFilters((prev) => ({
      ...prev,
      gender: value,
    }));
    updateSearchParams("gender", value);
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
    updateSearchParams("time", value);
  };

  // onChange handler for the curriculam
  const handleCurriculamChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    value: number
  ) => {
    setFilters((prev) => {
      const newCurriculam = event.target.checked
        ? [...prev.curriculam, value]
        : prev.curriculam.filter((item) => item !== value);

      updateSearchParams("curriculam", newCurriculam.join(','));

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
    updateSearchParams("rating", value);
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
    const subjects = selectedSubjects.join(",");
    setSearchParams(
      (prevParams) => {
        const newParams = new URLSearchParams(prevParams);

        // Set or update the 'subjects' parameter
        newParams.set("subjects", subjects);

        return newParams;
      },
      { replace: true }
    );
  };

  // function to reset filters
  const handleResetFilter = () => {
    setShowSearchResult(false)
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
    setFlag((prev) => !prev);
    setPage(1);
    setHasMore(true);
    setSearchParams({});
  };

  // const gradeOptions: Grade[] = [
  //   { name: "Pre primary(Kg/Foundation)" },
  //   { name: "Primary" },
  //   { name: "Middle school (O-level)" },
  //   { name: "High school (A-level)" },
  //   { name: "College" },
  //   { name: "Other" },
  // ];

  const gradeOptions: any[] = [
    { name: "0", label: "Pre primary(Kg/Foundation)" },
    { name: "1", label: "Primary" },
    { name: "2", label: "Middle school (O-level)" },
    { name: "3", label: "High school (A-level)" },
    { name: "4", label: "College" },
    { name: "5", label: "Other" },
  ];

  const handleGradeChange = (event: SelectChangeEvent<Grade[]>) => {
    const value = event.target.value as Grade[];
    setFilters((prev) => ({
      ...prev,
      grade: value,
    }));
    updateSearchParams("grade", value.map((g) => g.name).join(',')); // Serialize for URL
  };

  const getLevelName = (item: string) => {
    switch (item) {
      case "0":
        return 'Pre primary(Kg/Foundation)';
      case "1":
        return 'Primary';
      case "2":
        return 'Middle school (O-level)';
      case "3":
        return 'High school (A-level)';
      case "4":
        return 'College';
      case "5":
        return 'Other';
      default:
        return '';
    }
  }


  useEffect(() => {
    handleResetFilter()
  }, [])


  return (
    <>
      <aside className="filter_aside v2">
        <div className="filterBox">
          <div className="head">
            <h2>Filter Your Choices</h2>
            <div className="btn_flex">
              <Button
                variant="outlined"
                color="primary"
                onClick={() => { handleResetFilter(); window.scrollTo({ top: 700, behavior: 'smooth' }); }}
              >
                Reset
              </Button>
              <Button
                onClick={() => {
                  setPage(1);
                  setHasMore(true);
                  setFlag((prev) => !prev);
                  fetchData()
                }}
              >
                Apply
              </Button>
            </div>
          </div>
          <div className="body">
            <div className="col">
              <div className="single">
                <h3>Experience Level</h3>
                <RadioGroup
                  className="checkbox_label flex"
                  value={filters.experience}
                  aria-labelledby="demo-radio-buttons-group-label"
                  name="radio-buttons-group"
                  onChange={handleExperienceChange}
                >
                  <FormControlLabel
                    value="1"
                    control={<Radio />}
                    label={<>1</>}
                  />
                  <FormControlLabel
                    value="2"
                    control={<Radio />}
                    label={<>2</>}
                  />
                  <FormControlLabel
                    value="3"
                    control={<Radio />}
                    label={<>3</>}
                  />
                  <FormControlLabel
                    value="4"
                    control={<Radio />}
                    label={<>4</>}
                  />
                  <FormControlLabel
                    value="5"
                    control={<Radio />}
                    label={<>5+</>}
                  />
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
                          onChange={(e: any) => handleTeachingStyleChange(e, option.value)}
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
                  <FormControlLabel
                    value="1"
                    control={<Radio />}
                    label="English"
                  />
                  <FormControlLabel
                    value="2"
                    control={<Radio />}
                    label="Arabic"
                  />
                  <FormControlLabel
                    value="3"
                    control={<Radio />}
                    label="Both"
                  />
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
                  <FormControlLabel
                    value="MALE"
                    control={<Radio />}
                    label="Male"
                  />
                  <FormControlLabel
                    value="FEMALE"
                    control={<Radio />}
                    label="Female"
                  />
                </RadioGroup>
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
                      selected.length ? selected.map((g) => {
                        return (
                          getLevelName(String(g))
                        )
                      }).join(', ') : 'Select grade'
                    }
                  >
                    <MenuItem value="" disabled>
                      Select grade
                    </MenuItem>
                    {gradeOptions?.map((grade: any) => (
                      <MenuItem key={grade.name} value={grade.name}>
                        <Checkbox checked={filters.grade.some((g: any) => {
                          return (g === grade.name)
                        })} />
                        <ListItemText primary={grade.label} />
                      </MenuItem>
                    ))}
                  </Select>
                </div>
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
            </div>
            <div className="col">
              <div className="single">
                <h3>Location</h3>
                <Autocomplete
                  onLoad={onLoad}
                  onPlaceChanged={() => onPlaceChanged()}
                  className="control_group"
                >
                  <TextField
                    className="language_field"
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
                    InputProps={{
                      endAdornment: (
                        <>
                          {filters.location && (
                            <IconButton
                              onClick={() => setFilters((prev) => ({ ...prev, latitude: '', longitude: '', location: "" }))} // Clear location
                              size="small" // Smaller size for the button
                              style={{
                                padding: 0, // No padding for the icon button
                              }}
                            >
                              <ClearIcon />
                            </IconButton>
                          )}
                        </>
                      ),
                    }}
                  ></TextField>
                </Autocomplete>
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
                <div className="checkbox_label flex">
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
                          onChange={(e: any) => handleCurriculamChange(e, option.value)}
                        />
                      }
                      label={option.label}
                    />
                  ))}
                </div>
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
                  step={1}
                  getAriaLabel={() => "Price range"}
                />
              </div>
              {/* <div className="single">
                <h3>Location</h3>
                <Autocomplete
                  onLoad={onLoad}
                  onPlaceChanged={() => onPlaceChanged()}
                >
                  <TextField
                    className="text_field"
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
                    InputProps={{
                      endAdornment: (
                        <>
                          {filters.location && (
                            <IconButton
                              onClick={() => setFilters((prev) => ({ ...prev, latitude: '',longitude:'',location:"" }))} // Clear location
                              size="small" // Smaller size for the button
                              style={{
                                padding: 0, // No padding for the icon button
                              }}
                            >
                              <ClearIcon />
                            </IconButton>
                          )}
                        </>
                      ),
                    }}
                  ></TextField>
                </Autocomplete>
              </div> */}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
