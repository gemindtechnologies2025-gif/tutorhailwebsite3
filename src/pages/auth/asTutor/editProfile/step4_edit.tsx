/* eslint-disable jsx-a11y/anchor-is-valid */
import { Button, IconButton, InputAdornment, MenuItem, Select, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import { useEffect, useState } from "react";
import { UploadMedia, Uploadpdf } from "../../../../utils/mediaUpload";
import { useFormik } from "formik";
import * as Yup from "yup";
import { showError, showToast, showWarning } from "../../../../constants/toast";
import ClearIcon from "@mui/icons-material/Clear";
import {
  useLazyGetDocsQuery,
  usePostDocsMutation,
  useUpdateDocsMutation,
} from "../../../../service/tutorProfileSetup";
import { setCredentials } from "../../../../reducers/authSlice";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { isString } from "../../../../utils/validations";
import moment from "moment";
import { Autocomplete } from "@react-google-maps/api";
import Loader from "../../../../constants/Loader";
import { GOOGLE_API_KEY } from "../../../../constants/url";

type obj = {
  frontImage: string;
  description: string;
  documentName: number;
  documentType: number;
  startDate: string;
  endDate: string;
  fieldOfStudy: string;
  institutionName: string;
  _id?: string;
  latitude?: number;
  longitude?: number;
};

const TutorEducationBackgroundEdit = () => {
  const navigate = useNavigate();
  const [profilePicture, setProfilePicture] = useState<obj[]>([]);
  const [background, setBackground] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [updateProfile] = usePostDocsMutation();
  const [getDocs] = useLazyGetDocsQuery();
  const [image, setImage] = useState<string>("");
  const [id, setId] = useState<any>(null);
  const [showInput, setShowInput] = useState<boolean>(false);
  const [autocomplete, setAutocomplete] = useState(null)
  const [latlng, setLatlong] = useState({
    lat: 0,
    long: 0
  })


  const fetchDocs = async () => {
    try {
      const res = await getDocs({ documentType: 3 }).unwrap();
      if (res?.statusCode === 200) {
        setProfilePicture(res?.data?.document);
      }
    } catch (error: any) {
      showError(error?.data?.message);
//      console.log(error, "error in fetchdocs");
    }
  };

  const addInArray = async () => {
    if (
      formik.values.institutionName === "" ||
      formik.values.startDate === "" ||
      formik.values.endDate === "" ||
      background === "" ||
      formik.values.fieldOfStudy === ""
    ) {
      showWarning("Please fill all the details");
      return;
    }
    let arr;
    if (id) {
      arr = [
        {
          _id: id,
          frontImage: image,
          description: background,
          documentName: 1,
          documentType: 3,
          startDate: moment(formik.values.startDate)
            .utc()
            .format("YYYY-MM-DDTHH:mm:ss[Z]"),
          endDate: moment(formik.values.endDate)
            .utc()
            .format("YYYY-MM-DDTHH:mm:ss[Z]"),
          institutionName: formik.values.institutionName,
          fieldOfStudy: formik.values.fieldOfStudy,
          latitude: latlng?.lat,
          longitude: latlng?.long
        },
      ];
    } else {
      arr = [
        {
          frontImage: image,
          description: background,
          documentName: 1,
          documentType: 3,
          startDate: moment(formik.values.startDate)
            .utc()
            .format("YYYY-MM-DDTHH:mm:ss[Z]"),
          endDate: moment(formik.values.endDate)
            .utc()
            .format("YYYY-MM-DDTHH:mm:ss[Z]"),
          institutionName: formik.values.institutionName,
          fieldOfStudy: formik.values.fieldOfStudy,
          latitude: latlng?.lat,
          longitude: latlng?.long
        },
      ];
    }

    setProfilePicture([...profilePicture, ...arr]);

    //empty form
    setBackground("");
    setImage("");
    setShowInput(false)
    formik.setFieldValue("startDate", "");
    formik.setFieldValue("endDate", "");
    formik.setFieldValue("fieldOfStudy", "");
    formik.setFieldValue("institutionName", "");
    formik.setFieldValue("latitude", "");
    formik.setFieldValue("longitude", "");
    setId(null);
  };

  const handleEdit = async (item: obj, indexToRemove: number) => {
    setBackground(item?.description);
    setImage(item?.frontImage);
    formik.setFieldValue("startDate", item?.startDate);
    formik.setFieldValue("endDate", item?.endDate);
    formik.setFieldValue("institutionName", item?.institutionName);
    formik.setFieldValue("fieldOfStudy", item?.fieldOfStudy);
    formik.setFieldValue("latitude", item?.latitude);
    formik.setFieldValue("longitude", item?.longitude);
    setProfilePicture((prev: any) =>
      prev.filter((_: any, index: number) => index !== indexToRemove)
    );
  };
//console.log(background,"background");

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      frontImage: "",
      description: "",
      documentName: 1,
      documentType: 3,
      startDate: "",
      endDate: "",
      latitude: "",
      longitude: "",
      institutionName: "",
      fieldOfStudy: "",
    },

    onSubmit: async (values) => {
      formik.setSubmitting(true);

      if (profilePicture?.length === 0) {
        showWarning("Please upload documents");
        return;
      }

      let body = {
        documents: profilePicture,
      };

//      console.log("body for education", body);

      try {
        setIsLoading(true);
        const response = await updateProfile(body).unwrap();
        if (response?.statusCode === 200) {
          showToast("Education details updated successfully");
          navigate("/tutor/profile", { state: profilePicture[0] });
        }
        setIsLoading(false);
      } catch (errors: any) {
//        console.log(errors, "errrr");
        setIsLoading(false);
        showError(errors?.data?.message);
      }
    },
  });

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: string,
    id: string
  ) => {
    const files = event.target.files;
    if (!files) return;

    try {
      setIsLoading(true);

      const fileArray = Array.from(files); // Convert FileList to an array

      for (const file of fileArray) {
        let res: {
          statusCode: number;
          data: { image: string };
          message?: string;
        }; // Explicitly type 'res'

        if (file.type === "application/pdf") {
          res = await Uploadpdf(file);
        } else {
          res = await UploadMedia(file);
        }

        if (res?.statusCode === 200) {
          if (type === "profile_picture") {
            setImage(res?.data?.image);
          }
        } else {
          showError(res?.message || "Error uploading file");
        }
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error uploading file:", error);
      showError("Error uploading file. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setProfilePicture((prev: any) =>
      prev.filter((_: any, index: number) => index !== indexToRemove)
    );
  };

  const onLoad = (autocompleteObj: any) => {
    setAutocomplete(autocompleteObj);
  };




  const onPlaceChanged = async () => {
//    console.log("inside")
    if (autocomplete) {
      let place = await (autocomplete as any).getPlace()
      if (place && place.address_components) {
        let address = place.address_components;
        let state,
          city,
          country,
          zip = "",
          instituteName = place.name || "";
        address.forEach(function (component: any) {
          let types = component.types;
          if (types.indexOf("locality") > -1 || types.indexOf("administrative_area_level_3") > -1) {
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

        setLatlong({
          lat: lat,
          long: lng
        })

        formik.setFieldValue("institutionName", `${instituteName},${state}`);
        formik.setFieldValue("latitude", lat || "");
        formik.setFieldValue("longitude", lng || "");
      }
    }
  };


  const handleClear = () => {
    setLatlong({
      lat: 0,
      long: 0
    })
    formik.setFieldValue("institutionName", "");
  };


  useEffect(() => {
    fetchDocs();
  }, []);

  useEffect(() => {
    let googleMapsScript: HTMLScriptElement;

    const loadGoogleMaps = async () => {
      googleMapsScript = document.createElement("script");
      googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=drawing,places`;
      googleMapsScript.async = true;
      await new Promise((resolve, reject) => {
        googleMapsScript.onload = resolve;
        googleMapsScript.onerror = reject;
        document.body.appendChild(googleMapsScript);
      });
    };

    loadGoogleMaps();

    return () => {
      if (googleMapsScript && googleMapsScript.parentNode === document.body) {
        document.body.removeChild(googleMapsScript);
      }
    };
  }, []);

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
                <strong>Edit Education Background details</strong>
              </h2>
              <form className="form" onSubmit={formik.handleSubmit} onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}>
                <div className="gap_p">
                  <div className="control_group w_50">
                    {showInput ? (
                      <TextField
                        autoFocus
                        value={background}
                        onChange={(e) => setBackground(e.target.value)}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => {
                                  setBackground("");
                                  setShowInput(false);
                                }}
                              >
                                <ClearIcon />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    ) : (
                      <Select
                        labelId="language-label"
                        id="language"
                        value={background}
                        onChange={(e) => {
                          if (e.target.value === "other") {
                            setBackground("");
                            setShowInput(true);
                          } else {
                            setBackground(e.target.value as string);
                          }
                        }}
                        displayEmpty
                      >
                        <MenuItem value="" disabled>
                          Select Education Background Type
                        </MenuItem>
                        <MenuItem value="Bachelors">Bachelor’s</MenuItem>
                        <MenuItem value="Masters">Master’s</MenuItem>
                        <MenuItem value="Phd">PhD</MenuItem>
                        <MenuItem value="Diploma">Diploma</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                        {/* {
                        showInput && <MenuItem>
                        <TextField/>
                        </MenuItem>
                      } */}
                      </Select>
                    )}
                  </div>
                  <div className="control_group w_50">
                  <Autocomplete
                      onLoad={onLoad}
                      onPlaceChanged={() => onPlaceChanged()}
                    >
                    <TextField
                      hiddenLabel
                      fullWidth
                      className="text_field"
                      name="institutionName"
                      placeholder="Enter Institution Name"
                      value={formik.values.institutionName}
                      onChange={(val) => {
                        if (
                          val.target.value === " " ||
                          val.target.value === "."
                        ) {
                        } else if (isString(val.target.value)) {
                          formik.handleChange(val);
                        }
                      }}
                      onBlur={formik.handleBlur}
                      helperText={
                        formik.touched.institutionName &&
                          typeof formik.errors.institutionName === "string"
                          ? formik.errors.institutionName
                          : ""
                      }
                      InputProps={{
                        endAdornment: formik.values.institutionName ? (
                          <InputAdornment position="end">
                            <IconButton onClick={handleClear}>
                              <CloseIcon />
                            </IconButton>
                          </InputAdornment>
                        ) : null,
                      }}
                    ></TextField>
                      </Autocomplete>
                  </div>
                  <div className="control_group w_100">
                    <TextField
                      hiddenLabel
                      fullWidth
                      className="text_field"
                      name="fieldOfStudy"
                      placeholder="Enter field of study"
                      value={formik.values.fieldOfStudy}
                      onChange={(val) => {
                        if (
                          val.target.value === " " ||
                          val.target.value === "."
                        ) {
                        } else if (isString(val.target.value)) {
                          formik.handleChange(val);
                        }
                      }}
                      onBlur={formik.handleBlur}
                      helperText={
                        formik.touched.fieldOfStudy &&
                          typeof formik.errors.fieldOfStudy === "string"
                          ? formik.errors.fieldOfStudy
                          : ""
                      }
                    ></TextField>
                  </div>
                  <div className="control_group w_50">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Start date"
                        className="label_hidden"
                        views={['year', 'month']}
                        value={
                          formik.values.startDate
                            ? dayjs(formik.values.startDate)
                            : null
                        }
                        onChange={(value) => {
                          if (value) {
                            formik.setFieldValue(
                              "startDate",
                              value.toISOString()
                            );
                          } else {
                            formik.setFieldValue("startDate", null);
                          }
                        }}
                        maxDate={dayjs()}
                      />
                    </LocalizationProvider>
                  </div>
                  <div className="control_group w_50">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="End date"
                        className="label_hidden"
                        views={['year', 'month']}
                        value={
                          formik.values.endDate
                            ? dayjs(formik.values.endDate)
                            : null
                        }
                        onChange={(value) => {
                          if (value) {
                            formik.setFieldValue(
                              "endDate",
                              value.toISOString()
                            );
                          } else {
                            formik.setFieldValue("endDate", null);
                          }
                        }}
                        minDate={dayjs(formik.values.startDate)}
                      />
                    </LocalizationProvider>
                  </div>

                  <div className="control_group w_100">
                    <div className="upload_doc">
                      {image ? (
                        <span onClick={() => setImage("")} className="close">
                          <CloseIcon />
                        </span>
                      ) : (
                        ""
                      )}
                      <input
                        accept="image/png, image/jpeg, application/pdf"
                        type="file"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleImageUpload(e, "profile_picture", "")
                        }
                      />
                      <figure>
                        <img
                          src={
                            image && image.includes(".pdf")
                              ? `/static/images/pdf_icon.svg`
                              : image
                                ? image
                                : `/static/images/upload_icon.svg`
                          }
                          alt="Document"
                        />
                      </figure>
                      <h3>Education Documents</h3>
                      <p>
                        Please upload your government attested educational
                        documents
                      </p>
                    </div>
                    {image ? (
                      <div
                        style={{
                          margin: "10px",
                          padding: " 10px",
                          textAlign: "center",
                        }}
                      >
                        <button
                          style={{
                            padding: "10px",
                            borderRadius: "10px",
                            background: "#05A633",
                            color: "white",
                            border: "none",
                            cursor: "pointer",
                          }}
                          onClick={addInArray}
                          type="button"
                        >
                          Add more documents
                        </button>
                      </div>
                    ) : (
                      ""
                    )}

                    <div className="doc_preview">
                      {profilePicture?.length
                        ? profilePicture?.map((item: any, index: number) => {
                          return (
                            <div className="single">
                              <div>
                                <span
                                  onClick={() => {
                                    setId(item?._id);
                                    handleEdit(item, index);
                                  }}
                                  className="close v2"
                                >
                                  <EditIcon />
                                </span>
                                <span
                                  onClick={() => handleRemoveImage(index)}
                                  className="close"
                                >
                                  <CloseIcon />
                                </span>
                              </div>
                              <div key={index}>
                                <figure onClick={() => {
                                  if (item?.frontImage?.includes(".pdf")) {
                                    window.open(item?.frontImage)
                                  }
                                }}>
                                  <img
                                    src={
                                      item?.frontImage?.includes(".pdf")
                                        ? `/static/images/pdf_icon.svg`
                                        : item?.frontImage
                                    }
                                    alt="Icon"
                                  />
                                </figure>
                                <mark>
                                  {moment(item?.startDate).format("MMM, YYYY")}{" "}
                                  -{" "}
                                  {moment(item?.endDate).format("MMM, YYYY")}
                                </mark>
                              </div>
                              <p>
                                <strong>{item?.institutionName}</strong>
                                <span>{item?.fieldOfStudy}</span>
                                <span>{item?.description}</span>
                              </p>
                            </div>
                          );
                        })
                        : ""}
                    </div>
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
                  <Button type="submit">Continue</Button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default TutorEducationBackgroundEdit;
