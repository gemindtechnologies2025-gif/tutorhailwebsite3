/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { Button, IconButton, TextField } from "@mui/material";
import { replace, useLocation, useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import InputAdornment from "@mui/material/InputAdornment";
import TutorAuthLeft from "./authLeft";
import {
  useGetLinkedInTokenMutation,
  usePostLogInMutation,
  usePostSocialLoginMutation,
} from "../../../service/auth";
import { useAppDispatch, useAppSelector } from "../../../hooks/store";
import * as Yup from "yup";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useFormik } from "formik";
import { getFromStorage, setToStorage } from "../../../constants/storage";
import { STORAGE_KEYS } from "../../../constants/storageKeys";
import { getRole, role, setCredentials } from "../../../reducers/authSlice";
import { showError, showToast } from "../../../constants/toast";
import Loader from "../../../constants/Loader";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../../utils/firebaseKeys";
import { Linkedin_clientId } from "../../../constants/url";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <>{children}</>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const TutorLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [login] = usePostLogInMutation();
  const [value, setValue] = React.useState(0);
  const dispatch = useAppDispatch();
  const [withPhone, setWithPhone] = useState<boolean>();
  const [linkedLogin] = useGetLinkedInTokenMutation();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const [socialLogin] = usePostSocialLoginMutation();
   const roleS=getFromStorage(STORAGE_KEYS.roleName);
  console.log(roleS,'role');
  
 const setRole = (roles: string) => {
    dispatch(role({ roleName: roles }));
  };
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      dialCode: "+1",
      phoneNo: "",
      countryName: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().when([], {
        is: () => !withPhone,
        then: (schema) =>
          schema
            .required("Email is required")
            .matches(
              /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i,
              "Enter a valid email address!"
            ),
        otherwise: (schema) => schema.notRequired(),
      }),
      phoneNo: Yup.string().when([], {
        is: () => withPhone,
        then: (schema) => schema.required("Phone number is required").min(8,'Minimum 8 digits are required'),

        otherwise: (schema) => schema.notRequired(),
      }),

      password: Yup.string().when("phoneNo", {
        is: () => !withPhone,
        then: (schema) =>
          schema
            .required("Password is required")
            .min(8, "Password should be at least 8 characters"),
        otherwise: (schema) => schema.notRequired(),
      }),
    }),

    onSubmit: async (values) => {
      formik.setSubmitting(true);
      let body;
      const fcmtoken = getFromStorage(STORAGE_KEYS.fcmToken);

      if (!withPhone) {
        body = {
          email: formik.values.email,
          password: formik.values.password,
          deviceDetails: [{ deviceToken: fcmtoken || "1234", deviceType: "WEB" }]
          // deviceToken: fcmtoken || "1234",
          // deviceType: "WEB",
        };
      } else {
        body = {
          phoneNo: formik.values.phoneNo,
          dialCode: formik.values.dialCode,
          countryISOCode: formik.values.countryName,
          deviceDetails: [{ deviceToken: fcmtoken || "1234", deviceType: "WEB" }]
          // deviceToken: fcmtoken || "1234",
          // deviceType: "WEB",
        };
      }

           console.log(body, "body for login");
      if (!withPhone) {
        try {
          setIsLoading(true);
          const response = await login(body).unwrap();
          if (response?.statusCode === 200) {
            setToStorage(
              STORAGE_KEYS.token,
              response?.data?.accessToken || null
            );
            setToStorage(STORAGE_KEYS.user, response?.data || null);
            dispatch(
              setCredentials({
                user: response?.data || null,
                token: response?.data?.accessToken || null,
              })
            );
            showToast(response?.message || "Logged in successfully");
            if (response?.data?.profileCompletedAt === 0) {
              navigate("/auth/as-tutor/profile-setup/step1/1", {
                state: withPhone
                  ? {
                    phone: values.phoneNo,
                    dialCode: values.dialCode,
                    from: "phone",
                  }
                  : {
                    email: values.email,
                    from: "email",
                  },
                  replace: true,
              });
            } else if (response?.data?.profileCompletedAt === 1) {
              navigate("/auth/as-tutor/profile-setup/step1/2");
            } else if (response?.data?.profileCompletedAt === 2) {
              navigate("/auth/as-tutor/profile-setup/step2");
            } else if (response?.data?.profileCompletedAt === 3) {
              navigate("/auth/as-tutor/profile-setup/step3");
            } else if (response?.data?.profileCompletedAt === 5) {
              navigate("/auth/as-tutor/profile-setup/step4");
            } else if (
              response?.data?.profileCompletedAt === 4 ||
              response?.data?.profileCompletedAt === 6
            ) {
              navigate("/tutor/dashboard");
               setToStorage(STORAGE_KEYS.roleName,'tutor')
            } else {
              navigate("/tutor/dashboard");
               setToStorage(STORAGE_KEYS.roleName,'tutor')
            }
          }
          setIsLoading(false);
        } catch (error: any) {
          setIsLoading(false);
          showError(error?.data?.message);
        } finally {
          setIsLoading(false);
          formik.setSubmitting(false);
        }
      } else {
        try {
          setIsLoading(true);
          const response = await login(body).unwrap();
          if (response?.statusCode === 200) {
            setToStorage(STORAGE_KEYS.token, response?.data?.accessToken);
            setToStorage(STORAGE_KEYS.user, response?.data || null);
            dispatch(
              setCredentials({
                user: response?.data || null,
                token: response?.data?.accessToken || null,
              })
            );
            navigate("/auth/as-tutor/otp-verify", {
              state: {
                from: "login",
                phone: formik.values.phoneNo,
                dialCode: formik.values.dialCode,
              },
            });
          }
          setIsLoading(false);
        } catch (error: any) {
          setIsLoading(false);
          showError(error?.data?.message);
        } finally {
          setIsLoading(false);
          formik.setSubmitting(false);
        }
      }
    },
  });

  const handleGoogleLogin = async () => {
    try {
      const response = await signInWithPopup(auth, googleProvider);
      const fcmtoken = getFromStorage(STORAGE_KEYS.fcmToken);
      if (response) {
        const user = response?.user;
        //        console.log(response, "res of google");

        let body = {
          googleId: user?.uid,
          email: user?.email,
          deviceDetails: [{ deviceToken: fcmtoken || "1234", deviceType: "WEB" }],
                    // deviceToken: fcmtoken ? fcmtoken : "1234",
          // deviceType: "WEB",
          name:user?.displayName
        };

        const res = await socialLogin(body).unwrap();
        if (res?.statusCode === 200) {
          showToast("Logged in successfuly");
          dispatch(
            setCredentials({
              user: res?.data || null,
              token: res?.data?.accessToken || null,
            })
          );
          setToStorage(STORAGE_KEYS.token, res?.data?.accessToken);
          setToStorage(STORAGE_KEYS.user, res?.data);
          if (res?.data?.profileCompletedAt === 0) {
            navigate("/auth/as-tutor/profile-setup/step1/1", {replace: true});
          } else if (res?.data?.profileCompletedAt === 1) {
            navigate("/auth/as-tutor/profile-setup/step1/2");
          } else if (res?.data?.profileCompletedAt === 2) {
            navigate("/auth/as-tutor/profile-setup/step2");
          } else if (res?.data?.profileCompletedAt === 3) {
            navigate("/auth/as-tutor/profile-setup/step3");
          } else if (res?.data?.profileCompletedAt === 5) {
            navigate("/auth/as-tutor/profile-setup/step4");
          } else if (
            res?.data?.profileCompletedAt === 4 ||
            res?.data?.profileCompletedAt === 6
          ) {
            navigate("/tutor/dashboard");
             setToStorage(STORAGE_KEYS.roleName,'tutor')
          } else {
            navigate("/tutor/dashboard");
             setToStorage(STORAGE_KEYS.roleName,'tutor')
          }
        }
      }
    } catch (error: any) {
      //      console.log(error);
    }
  };

  const handleLinkedinLogin = async () => {
    const linkedinAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${Linkedin_clientId}&redirect_uri=${window.location.origin}/auth/as-tutor/login/linkedin/callback&state=YF67HGT9WD&scope=profile%20email%20openid`;
    window.location.href = linkedinAuthUrl;
  };

  const handleLinkedinCallback = async (code: string) => {
    try {
      let body = {
        code: code,
        frontendUrl: `${window.location.origin}/auth/as-tutor/login/linkedin/callback`,
      };
      const res = await linkedLogin({ body }).unwrap();
      if (res?.data) {
        const fcmtoken = getFromStorage(STORAGE_KEYS.fcmToken);
        let body = {
          linkedInId: res?.data?.sub,
          email: res?.data?.email,
          deviceDetails: [{ deviceToken: fcmtoken || "1234", deviceType: "WEB" }]
          // deviceToken: fcmtoken ? fcmtoken : "1234",
          // deviceType: "WEB",
        };
        const response = await socialLogin(body).unwrap();
        //        console.log(response, "response social")
        dispatch(
          setCredentials({
            user: response?.data || null,
            token: response?.data?.accessToken || null,
          })
        );
        setToStorage(STORAGE_KEYS.token, response?.data?.accessToken);
        setToStorage(STORAGE_KEYS.user, response?.data);
        if (response?.data?.profileCompletedAt === 0) {
          navigate("/auth/as-tutor/profile-setup/step1/1",{replace: true});
        } else if (response.data?.profileCompletedAt === 1) {
          navigate("/auth/as-tutor/profile-setup/step1/2");
        } else if (response?.data?.profileCompletedAt === 2) {
          navigate("/auth/as-tutor/profile-setup/step2");
        } else if (response?.data?.profileCompletedAt === 3) {
          navigate("/auth/as-tutor/profile-setup/step3");
        } else if (response?.data?.profileCompletedAt === 5) {
          navigate("/auth/as-tutor/profile-setup/step4");
        } else if (
          response?.data?.profileCompletedAt === 4 ||
          response?.data?.profileCompletedAt === 6
        ) {
          navigate("/tutor/dashboard");
           setToStorage(STORAGE_KEYS.roleName,'tutor')
        } else {
          navigate("/tutor/dashboard");
           setToStorage(STORAGE_KEYS.roleName,'tutor')
        }
      }
    } catch (error) {
      console.error("Error exchanging code for token:", error);
    }
  };

  const handleChangePhone = (phone: any, country: any) => {
    formik.setFieldValue("phoneNo", phone?.replace(country.dialCode, ""));
    formik.setFieldValue(
      "dialCode",
      country?.dialCode.includes("+") ? "" : "+" + country?.dialCode
    );
    formik.setFieldValue("countryName", country?.name.toUpperCase());
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const code = urlParams.get("code");

    if (code) {
      handleLinkedinCallback(code);
    } else {
      console.error("No code found in URL");
    }
  }, [location]);


  useEffect(()=>{
    setRole("tutor")
  },[])

  return (
    <main className="content">
      <Loader isLoad={isLoading} />
      <section className="auth_sc tutorAuth_sc">
        <TutorAuthLeft />
        <div className="rt_s u_spc">
          <div className="inner hd_5">
            <p className="sub_title">WELCOME USER</p>
            <CustomTabPanel value={value} index={0}>
              <h2>
                <strong>Please Enter Your Phone Number To Continue</strong>
              </h2>
              <form onSubmit={formik.handleSubmit} className="form">
                <div className="control_group">
                  <PhoneInput
                    country={"us"}
                    value={formik.values.dialCode + formik.values.phoneNo}
                    placeholder="Enter Your Phone Number"
                    enableSearch={true}
                    // onlyCountries={["in", "sa"]}
                    onChange={(phone, country) =>
                      handleChangePhone(phone, country)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                      }
                    }}
                  />
                  {formik.touched.phoneNo &&
                    typeof formik.errors.phoneNo === "string" && (
                      <div style={{ color: "red", fontSize: "13px" }}>
                        {formik.errors.phoneNo}
                      </div>
                    )}
                </div>
                <p>
                  We will call or text you to confirm your number. You will get
                  a code. Please do not share the code with anyone.
                </p>
                <div className="form_btn">
                  <Button
                    // onClick={() => navigate('/auth/as-tutor/otp-verify')}
                    type="submit"
                    onClick={() => setWithPhone(true)}
                  >
                    Sign In
                  </Button>
                </div>
              </form>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              <h2>
                <strong>Please Enter Your Email Address To Continue</strong>
              </h2>
              <form onSubmit={formik.handleSubmit} className="form">
                <div className="control_group">
                  <TextField
                    hiddenLabel
                    className="text_field"
                    fullWidth
                    placeholder="Enter your Email ID"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MailOutlineIcon />
                        </InputAdornment>
                      ),
                    }}
                    value={formik.values.email}
                    variant="outlined"
                    name="email"
                    type="email"
                    id="email"
                    inputProps={{ maxLength: 80 }}
                    onChange={(val) => {
                      if (
                        val.target.value === " " ||
                        val.target.value === "."
                      ) {
                      } else {
                        formik.handleChange(val);
                      }
                    }}
                    onBlur={formik.handleBlur}
                    helperText={formik.touched.email && formik.errors.email}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                  ></TextField>
                </div>
                <div className="control_group">
                  <TextField
                    hiddenLabel
                    fullWidth
                    placeholder="Enter your Password"
                    variant="outlined"
                    name="password"
                    className="text_field"
                    type={showPassword ? "text" : "password"}
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.password && Boolean(formik.errors.password)
                    }
                    helperText={
                      formik.touched.password && formik.errors.password
                    }
                    inputProps={{ maxLength: 50 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlinedIcon />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment className="eye_btn" position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => handleClickShowPassword()}
                            edge="end"
                          >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  ></TextField>
                </div>
                <div className="control_group text_end">
                  <p>
                    <a
                      onClick={() => navigate("/auth/as-tutor/forgot-password")}
                    >
                      Forgot Password?
                    </a>
                  </p>
                </div>
                <p>
                  We will text you to confirm your email. You will get
                  a code. Please do not share the code with anyone.
                </p>
                <div className="form_btn">
                  <Button
                    //  onClick={() => navigate('/tutor/dashboard')}
                    type="submit"
                    onClick={() => setWithPhone(false)}
                  >
                    Sign In
                  </Button>
                </div>
              </form>
            </CustomTabPanel>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab label="Continue with Phone Number" {...a11yProps(0)} />
              <Tab label="Continue with Email" {...a11yProps(1)} />
            </Tabs>
            <div className="bottom_text">
              <p className="or">OR</p>
              <div className="other_logins">
                <button onClick={() => handleGoogleLogin()}>
                  <img src={`/static/images/google_icon.svg`} alt="Image" />{" "}
                  Google
                </button>
                <button onClick={handleLinkedinLogin}>
                  <img src={`/static/images/linkedin_icon.svg`} alt="Image" />{" "}
                  Linkedin
                </button>
                {/* <button>
                  <img src={`/static/images/microsoft_icon.svg`} alt="Image" />{" "}
                  Microsoft
                </button> */}
              </div>
              <p>
                By Logging, you agree to our{" "}
                <strong>
                  <a
                    className="c_black"
                    onClick={() =>
                      navigate("/terms-and-conditions", {
                        state: "loginT",
                      })
                    }
                  >
                    Terms & Conditions
                  </a>
                </strong>{" "}
                and{" "}
                <strong>
                  <a
                    className="c_black"
                    onClick={() =>
                      navigate("/privacy-policy", { state: "loginT" })
                    }
                  >
                    Privacy Policy
                  </a>
                </strong>
              </p>
              <p>
                <strong>
                  Not a member?{" "}
                  <a
                    onClick={() => {
                      setToStorage(STORAGE_KEYS.roleName,'tutor')
                      navigate("/auth/as-tutor/signup");
                      window.scroll(0, 0);
                    }}
                  >
                    Sign Up
                  </a>
                </strong>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default TutorLogin;
