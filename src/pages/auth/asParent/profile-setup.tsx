/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { ChangeEvent, useEffect, useState } from "react";
import {
  CardMedia,
  Input,
  Button,
  TextField,
  MenuItem,
  IconButton,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import { Autocomplete } from "@react-google-maps/api";
import "react-phone-input-2/lib/bootstrap.css";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import InputAdornment from "@mui/material/InputAdornment";
import CloseIcon from "@mui/icons-material/Close";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import MaleIcon from "@mui/icons-material/Male";
import { UploadMedia } from "../../../utils/mediaUpload";
import { useFormik } from "formik";
import * as Yup from "yup";
import { showError, showToast, showWarning } from "../../../constants/toast";
import { getToken, role, setCredentials } from "../../../reducers/authSlice";
import { useAppDispatch, useAppSelector } from "../../../hooks/store";
import {
  useLazyGetUserQuery,
  useResendOtpMutation,
  useUpdateProfileMutation,
} from "../../../service/auth";
import { getFromStorage, setToStorage } from "../../../constants/storage";
import { STORAGE_KEYS } from "../../../constants/storageKeys";
import { GOOGLE_API_KEY } from "../../../constants/url";
import { isString } from "../../../utils/validations";
import OtpVerify from "./otpVerify";
import VerifyOtpForSetup from "../../../Modals/verifyOtp";
import Loader from "../../../constants/Loader";

const ProfileSetup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const token = getFromStorage(STORAGE_KEYS?.token);
  const [gender, setGender] = useState<string>("MALE");
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [updateProfile] = useUpdateProfileMutation();
  const [autocomplete, setAutocomplete] = useState(null);
  const [latlng, setLatlong] = useState({
    lat: 0,
    long: 0,
  });
  const [getProfile] = useLazyGetUserQuery();
  const [profileData, setProfileData] = useState<any>();
  const [sendOtp] = useResendOtpMutation();
  const [emailVerifed, setEmailVerfied] = useState<boolean>();
  const [phoneVerified, setPhoneVerified] = useState<boolean>();
  const [open, setOpen] = useState<boolean>(false);
  const onClose = () => {
    setOpen(false);
  };

  const fetchUser = async () => {
    const token = getFromStorage(STORAGE_KEYS.token);

    try {
      const res = await getProfile({}).unwrap();
      if (res?.statusCode === 200) {
        dispatch(
          setCredentials({
            user: res?.data || null,
            token: token || null,
          })
        );
        setToStorage(STORAGE_KEYS.token, token)
        setProfileData(res?.data);
        setLatlong({
          lat: res?.data?.latitude,
          long: res?.data?.longitude
        })
        setEmailVerfied(
          res?.data?.isEmailVerified
            ? res?.data?.isEmailVerified
            : location.state?.emailVerified
        );
        setPhoneVerified(
          res?.data?.isPhoneVerified
            ? res?.data?.isPhoneVerified
            : location.state?.phoneVerified
        );
        setLatlong({
          lat: res?.data?.latitude ? res?.data?.latitude : 0,
          long: res?.data?.longitude ? res?.data?.longitude : 0
        })
      }
    } catch (error: any) {
      showError(error?.data?.message);
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target;
    const file = files?.files?.length ? files?.files[0] : "";
    if (file) {
      if (file.type.startsWith("image/")) {
        formik.setFieldValue("image", URL.createObjectURL(file));
        const res = await UploadMedia(file);
        if (res?.statusCode === 200) {
          showToast("Image uploaded successfully");
          formik.setFieldValue("image", res?.data?.image);
        } else {
          showError(res?.message);
        }
      } else {
        showError("Failed to upload image");
      }
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: profileData?.name || "",
      email: profileData?.email
        ? profileData?.email
        : location.state?.email || "",
      phoneNo: profileData?.phoneNo
        ? profileData?.phoneNo
        : location.state?.phone || "",
      dialCode: profileData?.dialCode
        ? profileData?.dialCode
        : location.state?.dialCode || "+1",
      image: profileData?.image || "",
      latitude: profileData?.latitude || "",
      longitude: profileData?.longitude || "",
      address: profileData?.address || "",
      countryName: profileData?.countryISOCode || "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required("Name is required")
        .min(2, "Minimum 2 characters are required")
        .max(50, "Maximum 50 characters are allowed")
        .matches(/^[A-Za-z\s'-]+$/, "Name must contain only alphabets"),
      email: Yup.string()
        .required("Email is required")
        .matches(
          /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i,
          "Enter a valid email address!"
        ),
      phoneNo: Yup.string()
        .required("Phone number is required")
        .min(8, "Minimum 8 digits are required")
        .max(16, "Maximum 16 digits are allowed"),
      // address: Yup.string().required("Address is required"),
    }),

    onSubmit: async (values) => {
      formik.setSubmitting(true);

      if (!gender) {
        showWarning("Please select a gender");
        return;
      }
      if (!formik.values.image) {
        showWarning("Please select an image");
        return;
      }
      if (!emailVerifed) {
        showWarning("Please Verify your Email");
        return;
      }
      if (!phoneVerified) {
        showWarning("Please Verify your Phone number");
        return;
      }
      
      // if (latlng.lat === 0 && latlng.long === 0) {
      //   showWarning("Please select a valid address");
      //   return;
      // }
      let body = {
        name: values.name,
        gender: gender,
        image: values.image,
        ...latlng?.lat && latlng?.long && { latitude: latlng?.lat, longitude: latlng?.long },
        ...values.address && { address: values.address },
      };

      //      console.log("body for setup", body);

      try {
        setIsLoading(true);
        const response = await updateProfile(body).unwrap();
        if (response?.statusCode === 200) {
          showToast(
            location.state === "edit"
              ? "Profile updated successfully"
              : "Profile setup completed successfully"
          );
          navigate(
            location.state === "edit"
              ? "/parent/profile"
              : "/auth/as-parent/congratulations"
          );
          dispatch(
            setCredentials({
              user: response?.data || null,
              token: token || null,
            })
          );
        }
        setIsLoading(false);
      } catch (errors: any) {
        //        console.log(errors, "errrr");
        setIsLoading(false);
        showError(errors?.data?.message);
      }
    },
  });

  const handleChangePhone = (phone: any, country: any) => {
    formik.setFieldValue("phoneNo", phone?.replace(country.dialCode, ""));
    formik.setFieldValue(
      "dialCode",
      country?.dialCode.includes("+") ? "" : "+" + country?.dialCode
    );
    formik.setFieldValue("countryName", country?.name.toUpperCase());
  };

  const onLoadG = (autocompleteObj: any) => {
    setAutocomplete(autocompleteObj);
  };

  // Resend OTP
  const handleResendOtp = async () => {
    let body;
    if (emailVerifed) {
      body = {
        phoneNo: formik.values.phoneNo,
        dialCode: formik.values.dialCode,
        type: 3,
      };
    } else {
      body = {
        email: formik.values.email,
        type: 3,
      };
    }
    //    console.log(body, "body in resent otp");
    try {
      const response = await sendOtp(body).unwrap();
      if (response?.statusCode === 200) {
        setOpen(true);
      }
    } catch (error: any) {
      showError(error?.data?.message || "");
      //      console.log(error);
    }
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

        setLatlong({
          lat: lat,
          long: lng,
        });
        formik.setFieldValue("address", `${place?.formatted_address}`);
        formik.setFieldValue("latitude", lat || "");
        formik.setFieldValue("longitude", lng || "");
      }
    }
  };

  const handleClear = () => {
    setLatlong({
      lat: 0,
      long: 0,
    });
    formik.setFieldValue("address", "");
  };

  useEffect(() => {
    fetchUser();
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



  useEffect(() => {
    if (formik.values.phoneNo === profileData?.phoneNo) {
      setPhoneVerified(true);
    }
  }, [formik.values.phoneNo]);

  useEffect(() => {
    if (formik.values.email === profileData?.email) {
      setEmailVerfied(true);
    }
  }, [formik.values.email]);

  //  console.log(emailVerifed, "emailvvv");
  //  console.log(phoneVerified, "phonevvv");

  useEffect(() => {
    dispatch(role({ roleName: "parent" }));
  }, []);
  //console.log(profileData,"profileData")
  return (
    <main className="content">
      <Loader isLoad={isLoading} />
      <section
        className={
          location.state === "edit"
            ? "auth_sc profileSetup_sc edit"
            : "auth_sc profileSetup_sc"
        }
      >
        {location.state !== "edit" ? (
          <div className="lt_s">
            <a onClick={() => navigate("/")} className="site_logo">
              <figure>
                <img src={`/static/images/logo.png`} alt="logo" />
              </figure>
            </a>
            <figure className="auth_vector2">
              <img src={`/static/images/auth_vector2.png`} alt="Image" />
            </figure>
          </div>
        ) : (
          ""
        )}

        <div className="rt_s u_spc">
          <div className="inner hd_6">
            <h2>
              <button
                className="back_arrow"
                onClick={() => {
                  location.state === "edit"
                    ? navigate("/parent/profile")
                    : navigate("/auth/as-parent/signup");
                }}
              >
                <img src={`/static/images/back.png`} alt="img" />
              </button>
              <strong>
                {location.state === "edit" ? "Edit Profile" : "Profile Setup"}
              </strong>
            </h2>
            <form onSubmit={formik.handleSubmit} className="form">
              <div className="control_group text_center">
                {formik.values.image ? (
                  <div className="upload_image">
                    <div className="upload_image_holder">
                      <figure>
                        <CardMedia
                          component="img"
                          image={formik.values.image}
                          alt="photo"
                        />
                      </figure>
                      <CloseIcon
                        onClick={() => {
                          formik.setFieldValue("image", "");
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <label className="upload_image" htmlFor="icon-button-file">
                    <Input
                      sx={{ display: "none" }}
                      id="icon-button-file"
                      type="file"
                      inputProps={{
                        accept: "image/png,image/jpeg",
                      }}
                      onChange={handleImageUpload}
                    />
                    <span className="upload_image_holder">
                      <figure>
                        <img src={`/static/images/add_icon.svg`} alt="" />
                      </figure>
                    </span>
                  </label>
                )}
              </div>
              <div className="control_group">
                <TextField
                  hiddenLabel
                  fullWidth
                  placeholder="Enter your Full Name"
                  className="text_field"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PermIdentityIcon />
                      </InputAdornment>
                    ),
                  }}
                  inputProps={{ maxLength: 100 }}
                  name="name"
                  onChange={(val) => {
                    if (val.target.value === " " || val.target.value === ".") {
                    } else if (isString(val.target.value)) {
                      formik.handleChange(val);
                    }
                  }}
                  onBlur={formik.handleBlur}
                  value={formik.values.name}
                  helperText={
                    formik.touched.name &&
                      typeof formik.errors.name === "string"
                      ? formik.errors.name
                      : ""
                  }
                ></TextField>
              </div>
              <div className="control_group">
                <TextField
                  hiddenLabel
                  fullWidth
                  className="text_field"
                  placeholder="Enter your Email ID"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MailOutlineIcon />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        {emailVerifed ||
                          (formik.values.email === profileData?.email &&
                            formik.values.email !== "") ? (
                          <p className="verify-link">Verified</p>
                        ) : (
                          <p
                            onClick={() => {
                              handleResendOtp();
                            }}
                            className="verify-link"
                          >
                            Verify
                          </p>
                        )}
                      </InputAdornment>
                    ),
                  }}
                  disabled={
                    location.state?.from === "email" ||
                      profileData?.isSocialLogin
                      ? true
                      : false
                  }
                  name="email"
                  value={
                    location.state?.email
                      ? location.state?.email
                      : formik.values.email
                  }
                  onChange={(val) => {
                    if (val.target.value === " " || val.target.value === ".") {
                    } else {
                      setEmailVerfied(false);
                      formik.handleChange(val);
                    }
                  }}
                  onBlur={formik.handleBlur}
                  helperText={
                    formik.touched.email &&
                      typeof formik.errors.email === "string"
                      ? formik.errors.email
                      : ""
                  }
                ></TextField>
              </div>

              <div className="control_group">
                <PhoneInput
                  country={"us"}
                  placeholder="Enter Your Phone Number"
                  enableSearch={true}
                  // onlyCountries={["in", "sa"]}
                  disabled={location.state?.from === "phone" ? true : false}
                  onChange={(phone, country) => {
                    handleChangePhone(phone, country);
                    setPhoneVerified(false);
                  }}
                  onBlur={formik.handleBlur}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault(); // Prevent default behavior (form submission)
                      formik.handleSubmit(); // Manually submit the form
                    }
                  }}
                  value={formik.values.dialCode + formik.values.phoneNo}
                />

                {formik.values.phoneNo ? (
                  <div className="verify_float">
                    <p
                      onClick={() => {
                        if (!phoneVerified) {
                          // setOpen(true);
                          handleResendOtp();
                        }
                      }}
                    >
                      {phoneVerified ||
                        (formik.values.phoneNo === profileData?.phoneNo &&
                          formik.values.phoneNo !== "")
                        ? "Verified"
                        : " Verify"}
                    </p>
                  </div>
                ) : (
                  ""
                )}
                {formik.touched.phoneNo &&
                  typeof formik.errors.phoneNo === "string" && (
                    <div style={{ color: "red", fontSize: "13px" }}>
                      {formik.errors.phoneNo}
                    </div>
                  )}
              </div>
              <div className="control_group">
                <TextField
                  select
                  value={gender}
                  onChange={(event) => setGender(event.target.value)}
                  label="Gender"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MaleIcon />
                        {/* <p style={{marginLeft:"20px"}}> Select Gender</p> */}
                      </InputAdornment>
                    ),
                  }}
                >
                  {/* <MenuItem value="" disabled>
                                        Select Gender
                                    </MenuItem> */}
                  <MenuItem value="MALE">Male</MenuItem>
                  <MenuItem value="FEMALE">Female</MenuItem>
                </TextField>
              </div>
              <div className="control_group">
                <Autocomplete
                  onLoad={onLoadG}
                  onPlaceChanged={() => onPlaceChanged()}
                >
                  <TextField
                    hiddenLabel
                    fullWidth
                    placeholder="Enter your Address"
                    className="text_field"
                    name="address"
                    onChange={formik.handleChange}
                    inputProps={{ maxLength: 500 }}
                    onBlur={formik.handleBlur}
                    value={formik.values.address}
                    helperText={
                      formik.touched.address &&
                        typeof formik.errors.address === "string"
                        ? formik.errors.address
                        : ""
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PlaceOutlinedIcon />
                        </InputAdornment>
                      ),
                      endAdornment: formik.values.address ? (
                        <InputAdornment position="end">
                          <IconButton onClick={handleClear}>
                            <CloseIcon />
                          </IconButton>
                        </InputAdornment>
                      ) : null,
                    }}
                  />
                </Autocomplete>
              </div>
              <div className="form_btn">
                <Button
                  // onClick={() => navigate('/auth/as-parent/congratulations')}
                  type="submit"
                >
                  Continue
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>
      {open ? (
        <VerifyOtpForSetup
          open={open}
          setOpen={setOpen}
          onClose={onClose}
          from={emailVerifed ? "phone" : "email"}
          phone={formik.values.phoneNo}
          email={formik.values.email}
          dialCode={
            location.state?.dialCode
              ? location.state?.dialCode
              : formik.values.dialCode
          }
          setEmailVerfied={setEmailVerfied}
          setPhoneVerified={setPhoneVerified}
        />
      ) : undefined}
    </main>
  );
};

export default ProfileSetup;
