import {
  Modal,
  TextField,
  Select,
  SelectChangeEvent,
  MenuItem,
} from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import React from "react";
import OTPInput from "react-otp-input";
import {
  usePostVerifyOtpMutation,
  useResendOtpMutation,
} from "../service/auth";
import { showError, showToast } from "../constants/toast";
import {
  getFromStorage,
  removeFromStorage,
  setToStorage,
} from "../constants/storage";
import { STORAGE_KEYS } from "../constants/storageKeys";
import { getRole, setCredentials, setToken } from "../reducers/authSlice";
import { useAppDispatch, useAppSelector } from "../hooks/store";

interface CancelBookingProps {
  open: boolean;
  onClose: () => void;
  setOpen: Dispatch<SetStateAction<boolean>>;
  from: string;
  phone?: string;
  email?: string;
  dialCode?: string;
  setEmailVerfied: Dispatch<SetStateAction<boolean | undefined>>;
  setPhoneVerified: Dispatch<SetStateAction<boolean | undefined>>;
}

export default function VerifyOtpForSetup({
  open,
  onClose,
  setOpen,
  from,
  phone,
  email,
  dialCode,
  setEmailVerfied,
  setPhoneVerified,
}: CancelBookingProps) {
  const [otp, setOtp] = useState<string>("");
  const [verifyOtp] = usePostVerifyOtpMutation();
  const [sendOtp] = useResendOtpMutation();
  const [countDown, setCountDown] = useState<number>(30);
  const dispatch = useAppDispatch();
  const fcmToken = getFromStorage(STORAGE_KEYS.fcmToken);
  const roleName = getFromStorage(STORAGE_KEYS.roleName)

  // Resend OTP
  const handleResendOtp = async () => {
    let body;
    if (from === "phone") {
      body = {
        phoneNo: phone,
        dialCode: dialCode,
        type: 3,
      };
    } else {
      body = {
        email: email,
        type: 3,
      };
    }

    try {
      const response = await sendOtp(body).unwrap();
      if (response?.statusCode === 200) {
        showToast("OTP sent successfully");
        setCountDown(30);
      }
    } catch (error: any) {
      showError(error?.data?.message || "");
    }
  };

  const formatTime = (time: any) => {
    return time < 10 ? `0${time}` : time;
  };

  const fetchOtp = async () => {
    let body;
    if (from === "phone" && roleName === "parent") {
      body = {
        phoneNo: phone,
        dialCode: dialCode,
        deviceDetails: [{ deviceToken: fcmToken || "1234", deviceType: "WEB" }],
        type: 3,
        otp: otp,
      };
    } else if (from === "phone" && roleName === "tutor") {
      body = {
        phoneNo: phone,
        dialCode: dialCode,
        deviceDetails: [{ deviceToken: fcmToken || "1234", deviceType: "WEB" }],

        type: 3,
        otp: otp,
      };
    } else if (from === "email" && roleName === "parent") {
      body = {
        email: email,
        deviceDetails: [{ deviceToken: fcmToken || "1234", deviceType: "WEB" }],
        type: 3,
        otp: otp,
      };
    } else if (from === "email" && roleName === "tutor") {
      body = {
        email: email,
        deviceDetails: [{ deviceToken: fcmToken || "1234", deviceType: "WEB" }],

        type: 3,
        otp: otp,
      };
    } else {
      body = {};
    }

    try {
      const response = await verifyOtp(body).unwrap();
      if (response?.statusCode === 200) {
        showToast("Otp verified successfully");
        setToStorage(STORAGE_KEYS.token, response?.data?.accessToken);
        dispatch(
          setCredentials({
            user: response?.data || null,
            token: response?.data?.accessToken || null,
          })
        );
        if (from === "phone") {
          setPhoneVerified(true);
        } else {
          setEmailVerfied(true);
        }
        setOpen(false);
      }
      setOtp("");
    } catch (error: any) {
      showError(error?.data?.message);
      setOtp("");
    }
  };

  useEffect(() => {
    if (countDown > 0) {
      setTimeout(() => {
        setCountDown(countDown - 1);
      }, 1000);
    } else {
      setCountDown(0);
    }
  }, [countDown]);

  // useEffect(() => {
  //      setCountDown(30);
  // }, [open])

  return (
    <Modal
      className="modal cancel_modal"
      id="VerifyOtpForSetup"
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      open={open}
      onClose={onClose}
    >
      <div className="modal-dialog">
        <div className="modal-body">
          <div className="btn-close">
            <CloseIcon onClick={() => setOpen(false)} />
          </div>
          <h2 style={{ textAlign: "center" }}>
            Verify your {from === "phone" ? "Phone number" : "Email"}
          </h2>
          <p>
            To verify your account, please enter the code sent to your phone
            number. If you have not received the code, click 'Resend' to get a
            new one.
          </p>
          <form className="form">
            <div className="control_group opt_fields">
              <OTPInput
                value={otp}
                shouldAutoFocus
                onChange={setOtp}
                numInputs={4}
                renderInput={(props) => <input {...props} />}
                inputType="tel"
              />
            </div>
            <div className="form_btn">
              <Button
                // onClick={() => navigate(textContent.link)}
                onClick={() => fetchOtp()}
              >
                Verify
              </Button>
            </div>
          </form>
          <div className="bottom_text">
            {countDown === 0 ? (
              <p style={{ textAlign: "center" }}>
                <strong>
                  Didn’t get the code?{" "}
                  <a
                    style={{ cursor: "pointer" }}
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
              <p style={{ textAlign: "center" }}>
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
    </Modal>
  );
}
