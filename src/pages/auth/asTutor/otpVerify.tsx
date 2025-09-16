/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import TutorAuthLeft from "./authLeft";
import OTPInput from "react-otp-input";
import {
  usePostVerifyOtpMutation,
  useResendOtpMutation,
} from "../../../service/auth";
import { useAppDispatch } from "../../../hooks/store";
import {
  getFromStorage,
  removeFromStorage,
  setToStorage,
} from "../../../constants/storage";
import { STORAGE_KEYS } from "../../../constants/storageKeys";
import { setCredentials } from "../../../reducers/authSlice";
import { showError, showToast, showWarning } from "../../../constants/toast";
import Loader from "../../../constants/Loader";

const TutorOtpVerify = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState<string>("");
  const dispatch = useAppDispatch();
  const [verifyOtp] = usePostVerifyOtpMutation();
  const [sendOtp] = useResendOtpMutation();
  const [countDown, setCountDown] = useState<number>(30);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const fcmtoken = getFromStorage(STORAGE_KEYS.fcmToken);
  const roles=getFromStorage(STORAGE_KEYS.roleName)
  
  // Resend OTP
  const handleResendOtp = async () => {
    setIsLoading(true);
    let body;
    if (location.state.from === "phone") {
      body = {
        phoneNo: location.state.phone,
        dialCode: location.state.dialCode,
        type: 4,
      };
    } else {
      body = {
        email: location.state.email,
        type: 4,
      };
    }

    console.log(body, "body in resent otp");

    try {
      const response = await sendOtp(body).unwrap();
      setIsLoading(false);
      if (response?.statusCode === 200) {
        showToast(response?.message || "OTP resent successfully");
        setCountDown(30);
      }
    } catch (error: any) {
      setIsLoading(false);
      showError(error?.data?.message || "");
      //            console.log(error);
    }
  };

  const formatTime = (time: any) => {
    return time < 10 ? `0${time}` : time;
  };

  const fetchOtp = async () => {
    removeFromStorage(STORAGE_KEYS.token);
    dispatch(
      setCredentials({
        user: null,
        token: null,
      })
    );
    let body;
    if (location.state.from === "phone") {
      body = {
        phoneNo: location.state.phone,
        dialCode: location.state.dialCode,
       
        type: 1,
        otp: otp,
        deviceDetails: [{ deviceToken: fcmtoken || "1234", deviceType: "WEB" }]
      };
    } else if (location.state.from === "login") {
      body = {
        phoneNo: location.state.phone,
        dialCode: location.state.dialCode,
        type: 2,
        otp: otp,
        deviceDetails: [{ deviceToken: fcmtoken || "1234", deviceType: "WEB" }],
      };
    } else if (location.state.from === "forget") {
      body = {
        email: location.state.email,
        type: 4,
        otp: otp,
        deviceDetails: [{ deviceToken: fcmtoken || "1234", deviceType: "WEB" }],
      };
    } else {
      body = {
        email: location.state.email,
        type: 1,
        otp: otp,
        deviceDetails: [{ deviceToken: fcmtoken || "1234", deviceType: "WEB" }],
      };
    }

    console.log(body, "body in  otp");
    if (otp?.length !== 4) {
      showWarning("Please enter a valid OTP");
      return;
    }

    try {
      setIsLoading(true);
      const response = await verifyOtp(body).unwrap();
      setIsLoading(false);
      if (response?.statusCode === 200) {
        setToStorage(STORAGE_KEYS.token, response?.data?.accessToken);
        dispatch(
          setCredentials({
            user: response?.data || null,
            token: response?.data?.accessToken || null,
          })
        );
        if (location.state.from === "login") {
          if (response?.data?.profileCompletedAt === 0) {
            navigate("/auth/as-tutor/profile-setup/step1/1", {
              replace: true,
              state: {
                from: location.state.from,
                email: location.state.email,
                phone: location.state.phone,
                dialCode: location.state.dialCode,
                phoneVerified: response?.data?.isPhoneVerified,
                emailVerified: response?.data?.isEmailVerified,
              },
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
            navigate("/tutor/dashboard", { replace: true });
            setToStorage(STORAGE_KEYS.roleName, 'tutor')
          } else navigate("/tutor/dashboard", { replace: true });
          showToast("Logged in successfully");
          setToStorage(STORAGE_KEYS.roleName, 'tutor');
        } else if (location.state.from === "forget") {
          showToast("OTP verified successfully");
          navigate("/auth/as-tutor/reset-password", { replace: true });
        } else {
          navigate("/auth/as-tutor/profile-setup/step1/1", {
            replace: true,
            state: {
              from: location.state.from,
              email: location.state.email,
              phone: location.state.phone,
              dialCode: location.state.dialCode,
              phoneVerified: response?.data?.isPhoneVerified,
              emailVerified: response?.data?.isEmailVerified,
            },
          });
        }
      }
    } catch (error: any) {
      setIsLoading(false);
      showError("Invalid OTP");
      //            console.log(error);
    }
  };

  const getTextContent = () => {
    switch (location.pathname) {
      case "/auth/as-tutor/otp-verify":
        return {
          header: "Verify your Phone Number",
          paragraph:
            "To verify your account, please enter the code sent to your phone number. If you haven't received the code, click 'Resend' to get a new one.",
          link: "/tutor/dashboard",
        };
      case "/auth/as-tutor/otp-verify-email":
        return {
          header: "Verify your Email Address",
          paragraph:
            "To verify your account, please enter the code sent to your email address. If you haven't received the code, click 'Resend' to get a new one.",
          link: "/auth/as-tutor/reset-password",
        };
      case "/auth/as-tutor/signup-otp-verify-phone":
        return {
          header: "Verify your Phone Number",
          paragraph:
            "To verify your account, please enter the code sent to your phone number. If you haven't received the code, click 'Resend' to get a new one.",
          link: "/auth/as-tutor/profile-setup/step1/1",
        };
      case "/auth/as-tutor/signup-otp-verify-email":
        return {
          header: "Verify your Email Address",
          paragraph:
            "To verify your account, please enter the code sent to your email address. If you haven't received the code, click 'Resend' to get a new one.",
          link: "/auth/as-tutor/profile-setup/step1/1",
        };
      // Add more cases for different routes if needed
      default:
        return {
          header: "Verify your Phone Number",
          paragraph:
            "To verify your account, please enter the code sent to your phone number. If you haven't received the code, click 'Resend' to get a new one.",
          link: "/",
        };
    }
  };
  const textContent = getTextContent();

  useEffect(() => {
    if (countDown > 0) {
      setTimeout(() => {
        setCountDown(countDown - 1);
      }, 1000);
    } else {
      setCountDown(0);
    }
  }, [countDown]);

  return (
    <main className="content">
      <Loader isLoad={isLoading} />
      <section className="auth_sc tutorAuth_sc">
        <TutorAuthLeft />
        <div className="rt_s u_spc">
          <div className="inner hd_5">
            <h2>
              <button
                className="back_arrow"
                onClick={() => navigate("/auth/as-tutor/login")}
              >
                <img src={`/static/images/back.png`} alt="img" />
              </button>
              <strong>{textContent.header}</strong>
            </h2>
            <p>{textContent.paragraph}</p>
            <form className="form">
              <div className="control_group opt_fields">
                <OTPInput
                  value={otp}
                  onChange={setOtp}
                  shouldAutoFocus
                  numInputs={4}
                  renderInput={(props) => <input {...props} />}
                  inputType="tel"
                />
              </div>
              <div className="form_btn">
                <Button
                  //  onClick={() => navigate(textContent.link)}
                  onClick={() => fetchOtp()}
                // disabled={otp?.length !== 4}
                >
                  Verify
                </Button>
              </div>
            </form>
            <div className="bottom_text">
              {countDown === 0 ? (
                <p>
                  <strong>
                    Didn’t get the code?{" "}
                    <a
                      onClick={() => {
                        handleResendOtp();
                        setOtp("");
                      }}
                    >
                      Resend
                    </a>
                  </strong>
                </p>
              ) : (
                <p>
                  The verification code will expire in{" "}
                  <a style={{ margin: 0, marginLeft: 6 }}>00 :</a>
                  <a style={{ margin: 0, marginLeft: 6 }}>
                    {formatTime(countDown)}
                  </a>
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default TutorOtpVerify;
