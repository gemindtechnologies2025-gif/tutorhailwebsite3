/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  SelectChangeEvent,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import EducationLevelModal from "../../../../Modals/educationLevelModal";
import CurriculumModal from "../../../../Modals/curriculumModal";
import GradesModal from "../../../../Modals/gradesModal";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { isNumber, isString } from "../../../../utils/validations";
import dayjs, { Dayjs } from "dayjs";
import {
  useEditTeachingDetailsMutation,
  useLazyGetTeachingDetailsQuery,
  usePostTeachingDetailsMutation,
} from "../../../../service/tutorProfileSetup";
import { showError, showToast, showWarning } from "../../../../constants/toast";
import Loader from "../../../../constants/Loader";
import utc from "dayjs/plugin/utc";
import {
  Class_Variables,
  GRADE_TYPE_NAME,
  HIGHER_EDUCATION_TYPE,
  TYPE_SUBJECT_LISTING,
} from "../../../../constants/enums";
import { useGetSubjectListingMutation, useLazyGetSubjectsAndCategoryQuery } from "../../../../service/auth";
import CategoryModal from "../../../../Modals/categoryModel";
import SubjectsModal from "../../../../Modals/subjectsModal";
import { convertCurrencyNew } from "../../../../utils/currency";
import CURRENCY from "../../../../constants/Currency";

dayjs.extend(utc);

type Subjects = { name: string };
type Conversion = { name: string };

const TutorTeachingDetailEdit = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = React.useState("");
  const [otherCurriculam, setOtherCurriculam] = useState<string>("");
  const [experience, setExperience] = useState<string>("");
  const [currency, setCurrency] = React.useState("");
  const [startTime, setStartTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);
  const [price, setPrice] = useState<string>("");
  const [selectedCurriculam, setSelectedCurriculam] = useState<number[]>([]);
  const [selectedTeaching, setSelectedTeaching] = useState<number[]>([]);
  const [selectedlevel, setSelectedLevels] = useState<Conversion[]>([]);
  const [prevlevel, setPrevLevels] = useState<Conversion[]>([]);
  const [subject, setSubject] = useState<string>("");
  const [open1, setOpen1] = useState(false);
  const [postTeaching] = usePostTeachingDetailsMutation();
  const [higherEdu, setHigherEdu] = useState<string>("");
  const [getTeaching] = useLazyGetTeachingDetailsQuery();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [reqError, setReqError] = useState<string>("");
  const [getSubjects] = useLazyGetSubjectsAndCategoryQuery();
  const [category, setCategory] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [specialization, setSpecialization] = useState<string>("");
  const [achievement, setAchievement] = useState<string>("");
  const [converetdPrice, setConvertedPrice] = useState<number>();
  const [search, setSearch] = useState<string>('');
  const [debounce, setDebounce] = useState("");
  const [data, setData] = useState<any>();
  const [getSubjectsListingApi] = useGetSubjectListingMutation();

  const handleChangeCurrency = (event: SelectChangeEvent) => {
    setCurrency(event.target.value as string);
  };
  const validateForm = () => {
    // if (experience?.length === 0) {
    //   setReqError("Please select your experience.");
    //   return false;
    // }

    // if (selectedCurriculam?.length === 0 && !otherCurriculam) {
    //   setReqError("Please select a curriculum.");
    //   return false;
    // }
    if (selectedlevel?.length === 0) {
      setReqError("Please select at least one level.");
      return false;
    }
    if (selectedTeaching?.length === 0) {
      setReqError("Please select at least one teaching style.");
      return false;
    }
    if (!language) {
      setReqError("Please select a language.");
      return false;
    }
    if (!price) {
      setReqError("Please enter a Price.");
      return false;
    }
    if (!startTime) {
      setReqError("Please select a start time.");
      return false;
    }
    if (!endTime) {
      setReqError("Please select an end time.");
      return false;
    }
    return true;
  };

  const handleRemoveSubjects = (index: number) => {
    setSelectedSubjects((prev) => prev.filter((_, i) => i !== index));
  };

  const fetchTeaching = async () => {
    setIsLoading(true);
    try {
      const res = await getTeaching({}).unwrap();
      if (res?.statusCode === 200) {
        setData(res?.data[0])
        setSelectedLevels(res?.data[0]?.classes);
        setPrevLevels(res?.data[0]?.classes);
        setConvertedPrice(res?.data[0]?.usdPrice);
        setCurrency(res?.data[0]?.country)
        setSelectedCurriculam(res?.data[0]?.curriculum);
        setOtherCurriculam(res?.data[0]?.curriculumOther);
        setSelectedTeaching(res?.data[0]?.teachingStyle);
        setLanguage(
          res?.data[0]?.teachingLanguage ? res?.data[0]?.teachingLanguage : ""
        );
        setExperience(
          res?.data[0]?.totalTeachingExperience
            ? res?.data[0]?.totalTeachingExperience
            : ""
        );
        setStartTime(res?.data[0]?.startTime);
        setEndTime(res?.data[0]?.endTime);
        setPrice(res?.data[0]?.price);
        setSelectedCategory(res?.data[0]?.categoryId?.map((item: any) => item?._id));
        setSelectedSubjects(res?.data?.[0]?.subjectIds?.map((item: any) => item?._id) || []);
        setHigherEdu(res?.data[0]?.higherEdu)
        setSpecialization(res?.data[0]?.specialization)
        setAchievement(res?.data[0]?.achievement)
      }

      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      showError(error?.data?.message);
    }
  };
  //    console.log(subjectsArray, "subjets");
  //    console.log(prevlevel, "prevlevel");


  const getConverted = async () => {
    const result = await convertCurrencyNew({
      baseCurrency: currency,
      targetCurrency: 'USD',
      amount: Number(price),
    });

    if (result) {
      return result;
    } else {
      return (price);
    }
  };


  const fetchPostTeaching = async () => {
    setIsLoading(true);
    let usd: any = 0;
    if (data?.price !== price || converetdPrice == undefined) {
      usd = await getConverted();
    }
    console.log(usd, 'usd');


    const tempClass = prevlevel.map((item) => {
      if (selectedlevel.find((data: any) => data?.name === item?.name)) {
        return { ...item, isDelete: false };
      } else {
        return { ...item, isDelete: true };
      }
    });
    selectedlevel.map((item: any) => {
      if (!prevlevel.find((data: any) => data.name === item.name)) {
        tempClass.push(item);
      }
    });


    if (startTime === null) {
      showWarning("Please select start time");
    } else if (endTime === null) {
      showWarning("Please select end time");
    }

    const body = {
      totalTeachingExperience: Number(experience),
      higherEdu: higherEdu,
      categoryId: selectedCategory,
      specialization: specialization,
      achievement: achievement,
      curriculum: selectedCurriculam,
      ...(otherCurriculam ? { curriculumOther: otherCurriculam } : {}),
      classes: selectedlevel,
      teachingStyle: selectedTeaching,
      teachingLanguage: Number(language),
      price: Number(price),
      startTime: startTime,
      endTime: endTime,
      subjectIds: selectedSubjects,
      usdPrice: data?.price !== price || converetdPrice == undefined ? Number(usd?.converted) : Number(converetdPrice),
      country: currency || "USD"
    };

    // return;
    try {
      // const res = await postTeaching({body:body,id:data?._id}).unwrap();
      const res = await postTeaching(body).unwrap();
      setIsLoading(false);
      if (res?.statusCode === 200) {
        showToast("Teaching details updated successfully");
        navigate("/tutor/profile");
      }
    } catch (error: any) {
      setIsLoading(false);
      showError(error?.data?.message);
    }
  };

  const handleChangeExp = (event: SelectChangeEvent) => {
    setExperience(event.target.value as string);
  };
  const handleChange = (event: SelectChangeEvent) => {
    setLanguage(event.target.value as string);
  };
  const handleCloseModal1 = () => {
    setOpen1(false);
  };
  const [open2, setOpen2] = useState(false);
  const handleCloseModal2 = () => {
    setOpen2(false);
  };

  const [open3, setOpen3] = useState(false);
  const handleCloseModal3 = () => {
    setOpen3(false);
  };

  const [open4, setOpen4] = useState(false);
  const handleCloseModal4 = () => {
    setOpen4(false);
  };

  const [open5, setOpen5] = useState(false);
  const handleCloseModal5 = () => {
    setOpen5(false);
  };



  const handleRemoveCurr = (indexToRemove: any) => {
    setSelectedCurriculam(
      selectedCurriculam.filter((_, index) => index !== indexToRemove)
    );
  };
  const handleRemoveTeaching = (indexToRemove: any) => {
    setSelectedTeaching(
      selectedTeaching.filter((_, index) => index !== indexToRemove)
    );
  };
  const handleRemoveLevels = (indexToRemove: any) => {
    setSelectedLevels(
      selectedlevel.filter((_, index) => index !== indexToRemove)
    );
  };

  const getCurriculumName = (item: number) => {
    switch (item) {
      case 1:
        return "National Curriculum";
      case 2:
        return "Cambridge Curriculum";
      case 3:
        return "IB Curriculum";
      case 4:
        return "American Curriculum";
      default:
        return "";
    }
  };

  const getTeachingName = (item: number) => {
    switch (item) {
      case 1:
        return "Visual Learning";
      case 2:
        return "Auditory Learning";
      case 3:
        return "Reading and Writing";
      case 4:
        return "Integrated Approach";
      case 5:
        return "Other";
      default:
        return "";
    }
  };

  const fetchCategory = async () => {
    try {
      const res = await getSubjects({
        type: TYPE_SUBJECT_LISTING.CATEGORY,
      }).unwrap();
      if (res?.statusCode == 200) {
        setCategory(res?.data);
      }
    } catch (error: any) { }
  };

  const fetchSubjects = async () => {
    let body = {
      categoryId: selectedCategory,
    }
    try {
      const res = await getSubjectsListingApi({
        body:body,search: debounce
      }).unwrap();
      if (res?.statusCode == 200) {
        setSubjects(res?.data);
      }
    } catch (error: any) { }
  };

  const handleEduChange = (event: SelectChangeEvent) => {
    setHigherEdu(event.target.value);
  };


  const handleTimeChange = (time: Dayjs | null) => {
    if (time) {
      const utcTime = time.utc().format();
      setStartTime(utcTime);
    } else {
      setStartTime(null);
    }
    //        console.log(startTime, "start time");
  };

  const handleTimeChangeEnd = (time: Dayjs | null) => {
    if (time) {
      const utcTime = time.utc().format();
      setEndTime(utcTime);
    } else {
      setEndTime(null);
    }
  };

  const handleSubmit = () => {
    if (validateForm()) {
      fetchPostTeaching();
    } else {
      showError(reqError);
    }
  };

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebounce(search.trim());
      }, 1000);
  
      return () => {
        clearTimeout(handler);
      };
    }, [search]);

  useEffect(() => {
    fetchTeaching();
  }, []);

  useEffect(() => {
    fetchCategory();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchSubjects();
    }
  }, [selectedCategory]);

  return (
    <>
      <main className="content editTutor">
        <Loader isLoad={isLoading} />

        <section className="tutor_setup">
          <div className="conta_iner">
            <div className="rt_s">
              <h2>
                <button
                  className="back_arrow"
                  onClick={() => navigate("/tutor/profile")}
                >
                  <img src={`/static/images/back.png`} alt="img" />
                </button>
                <strong>Edit Teaching Details</strong>
              </h2>
              <form className="form">
                <div className="gap_p">
                  <div className="control_group w_100">
                    <Select
                      labelId="language-label"
                      id="language"
                      value={experience}
                      onChange={handleChangeExp}
                      displayEmpty
                      error={!experience}
                    >
                      <MenuItem value="" disabled>
                        Experience
                      </MenuItem>
                      <MenuItem value="1">1 Year</MenuItem>
                      <MenuItem value="2">2 Years</MenuItem>
                      <MenuItem value="3">3 Years</MenuItem>
                      <MenuItem value="4">4 Years</MenuItem>
                      <MenuItem value="5">5+ Years</MenuItem>
                    </Select>
                    {!experience && (
                      <span className="error">Experience is required</span>
                    )}
                  </div>

                  <div className="control_group w_100">
                    <Select
                      labelId="edu-label"
                      id="higherEdu"
                      value={higherEdu}
                      onChange={handleEduChange}
                      displayEmpty
                      error={!higherEdu}
                    >
                      <MenuItem value="" disabled>
                        Higher Education
                      </MenuItem>
                      <MenuItem value={HIGHER_EDUCATION_TYPE.BACHELORS}>
                        Bachelors
                      </MenuItem>
                      <MenuItem value={HIGHER_EDUCATION_TYPE.DIPLOMA}>
                        Diploma
                      </MenuItem>
                      <MenuItem value={HIGHER_EDUCATION_TYPE.MASTERS}>
                        Masters
                      </MenuItem>
                      <MenuItem value={HIGHER_EDUCATION_TYPE.PHD}>Phd</MenuItem>
                      {/* <MenuItem value={HIGHER_EDUCATION_TYPE.OTHERS}>
                        Other
                      </MenuItem> */}
                    </Select>
                    {!higherEdu && (
                      <span className="error">
                        Higher education is required
                      </span>
                    )}
                  </div>
                  <div className="control_group w_100">
                    <div className="addMore">
                      <p>
                        Select Category{" "}
                        <span onClick={() => setOpen4(true)}>
                          <AddIcon />
                        </span>
                      </p>
                      {!selectedCategory && (
                        <span className="error">Category is required</span>
                      )}
                      <ul>
                        {selectedCategory?.map((catId: string) => {
                          const categoryName = category?.find((item) => item?._id === catId)?.name;

                          return (
                            <li key={catId}>
                              {categoryName}
                              <span>
                                <CloseIcon
                                  onClick={() => {
                                    setSelectedCategory((prev: string[]) =>
                                      prev?.filter((id) => id !== catId)
                                    );
                                    setSelectedSubjects((prev: any[]) =>
                                      prev?.filter((subj) => subj.categoryId !== catId)
                                    );
                                  }}
                                />
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>

                  {selectedCategory ? (
                    <div className="control_group w_100">
                      <div className="addMore">
                        <p>
                          Select Subjects{" "}
                          <span onClick={() => setOpen5(true)}>
                            <AddIcon />
                          </span>
                        </p>
                        {selectedSubjects?.length == 0 && (
                          <span className="error">Subjects are required</span>
                        )}
                        <ul>
                          {selectedSubjects?.map((id, index) => {
                            const subject = subjects?.find(
                              (item) => item?._id === id
                            );
                            return subject ? (
                              <li key={id}>
                                {subject?.name}
                                <span>
                                  <CloseIcon
                                    onClick={() => handleRemoveSubjects(index)}
                                  />
                                </span>
                              </li>
                            ) : null;
                          })}
                        </ul>
                      </div>
                    </div>
                  ) : null}

                  <div className="control_group w_100">
                    <div className="addMore">
                      <p>
                        Select Curriculum{" "}
                        <span onClick={() => setOpen2(true)}>
                          <AddIcon />
                        </span>
                      </p>
                      <ul>
                        {selectedCurriculam?.map((item, index) => (
                          <li key={index}>
                            {getCurriculumName(item)}{" "}
                            <span>
                              <CloseIcon
                                onClick={() => handleRemoveCurr(index)}
                              />
                            </span>
                          </li>
                        ))}
                        {selectedCurriculam?.length === 0 &&
                          !otherCurriculam && (
                            <span className="error">
                              Curriculum is required
                            </span>
                          )}
                        {otherCurriculam?.length ? (
                          <li>
                            {otherCurriculam}{" "}
                            <span onClick={() => setOtherCurriculam("")}>
                              <CloseIcon />
                            </span>
                          </li>
                        ) : (
                          ""
                        )}
                      </ul>
                    </div>
                  </div>

                  <div className="control_group w_100">
                    <div className="addMore">
                      <p>
                        Select Level{" "}
                        <span onClick={() => setOpen3(true)}>
                          <AddIcon />
                        </span>
                      </p>
                      {selectedlevel?.length === 0 && (
                        <span className="error">
                          At least one level is required
                        </span>
                      )}
                      <ul>
                        {selectedlevel?.map((item: any, index) => (
                          <li key={index}>
                            {GRADE_TYPE_NAME[item]}{" "}
                            <span>
                              <CloseIcon
                                onClick={() => handleRemoveLevels(index)}
                              />
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="control_group w_100">
                    <div className="addMore">
                      <p>
                        Select Teaching Style{" "}
                        <span onClick={() => setOpen1(true)}>
                          <AddIcon />
                        </span>
                      </p>
                      {selectedTeaching?.length === 0 && (
                        <span className="error">
                          At least one teaching style is required
                        </span>
                      )}
                      <ul>
                        {selectedTeaching?.map((item, index) => (
                          <li key={index}>
                            {getTeachingName(item)}{" "}
                            <span>
                              <CloseIcon
                                onClick={() => handleRemoveTeaching(index)}
                              />
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="control_group w_50">
                    <TextField
                      hiddenLabel
                      fullWidth
                      placeholder="Enter Specialization"
                      value={specialization}
                      onChange={(val) => {
                        const value = val.target.value;
                        if (isString(value)) {
                          setSpecialization(value);
                        }
                      }}
                      inputProps={{ maxLength: 30 }}
                    ></TextField>
                    {!specialization && (
                      <span className="error">Specialization is required</span>
                    )}
                  </div>
                  <div className="control_group w_50">
                    <TextField
                      hiddenLabel
                      fullWidth
                      placeholder="Enter achievement"
                      value={achievement}
                      onChange={(val) => {
                        const value = val.target.value;
                        if (isString(value)) {
                          setAchievement(value);
                        }
                      }}
                      inputProps={{ maxLength: 30 }}
                    ></TextField>
                    {!achievement && (
                      <span className="error">Achievement is required</span>
                    )}
                  </div>
                  <div className="control_group w_50">
                    <Select
                      labelId="language-label"
                      id="language"
                      value={language}
                      onChange={handleChange}
                      displayEmpty
                      error={!language}
                    >
                      <MenuItem value="" disabled>
                        Select Language
                      </MenuItem>
                      <MenuItem value="1">English</MenuItem>
                      <MenuItem value="2">Arabic</MenuItem>
                      <MenuItem value="3">Both</MenuItem>
                    </Select>
                    {!language && (
                      <span className="error">Language is required</span>
                    )}
                  </div>
                  <div className="control_group w_50">
                    <Select
                      labelId="language-label"
                      id="currency"
                      value={currency}
                      onChange={handleChangeCurrency}
                      displayEmpty
                      error={!currency}
                    >
                      <MenuItem value="" disabled>
                        Select Currency
                      </MenuItem>
                      {CURRENCY?.map((item) => {
                        return (
                          <MenuItem value={item.currency}>{item.title}</MenuItem>
                        )
                      })}

                    </Select>
                    {!currency && (
                      <span className="error">Currency is required</span>
                    )}
                  </div>
                  <div className="control_group w_50">
                    <TextField
                      hiddenLabel
                      fullWidth
                      placeholder="Enter price"
                      value={price}
                      onChange={(val) => {
                        const value = val.target.value;
                        if (/^\d*\.?\d*$/.test(value)) {
                          setPrice(value);
                        }
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <MonetizationOnOutlinedIcon />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <button className="verify_btn">per hour</button>
                          </InputAdornment>
                        ),
                      }}
                    ></TextField>
                    {!price && <span className="error">Price is required</span>}
                  </div>
                  <div className="control_group w_50">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <TimePicker
                        className="label_hidden"
                        label="Teaching Start Time"
                        onChange={handleTimeChange}
                        value={dayjs(startTime)}
                      />
                    </LocalizationProvider>
                  </div>
                  <div className="control_group w_50">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <TimePicker
                        className="label_hidden"
                        label="Teaching End Time"
                        onChange={handleTimeChangeEnd}
                        value={dayjs(endTime)}
                      />
                    </LocalizationProvider>
                  </div>
                </div>
                <div className="form_btn">
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => navigate("/tutor/profile")}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                  // onClick={() => navigate('/auth/as-tutor/profile-setup/step3')}
                  >
                    Continue
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>

      <EducationLevelModal
        open={open1}
        onClose={handleCloseModal1}
        setOpen={setOpen1}
        setSelected={setSelectedTeaching}
        selected={selectedTeaching}
      />

      <CurriculumModal
        open={open2}
        onClose={handleCloseModal2}
        setOpen={setOpen2}
        setSelectedCurriculam={setSelectedCurriculam}
        other={otherCurriculam}
        setOther={setOtherCurriculam}
        selectedCurriculam={selectedCurriculam}
      />

      <GradesModal
        open={open3}
        onClose={handleCloseModal3}
        setOpen={setOpen3}
        setSelected={setSelectedLevels}
        selected={selectedlevel}
      />

      <CategoryModal
        open={open4}
        onClose={handleCloseModal4}
        setOpen={setOpen4}
        setSelected={setSelectedCategory}
        selected={selectedCategory}
        listing={category}
      />

      <SubjectsModal
        open={open5}
        onClose={handleCloseModal5}
        setOpen={setOpen5}
        setSelected={setSelectedSubjects}
        selected={selectedSubjects}
        listing={subjects}
         search={search}
        setSearch={setSearch}
      />
    </>
  );
};

export default TutorTeachingDetailEdit;
