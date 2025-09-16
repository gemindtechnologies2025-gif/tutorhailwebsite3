/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect, useState } from "react";
import { Button } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthLeft from './authLeft';
import OTPInput from "react-otp-input";
import { usePostVerifyOtpMutation, useResendOtpMutation } from "../../../service/auth";
import { useAppDispatch } from "../../../hooks/store";
import { getFromStorage, removeFromStorage, setToStorage } from "../../../constants/storage";
import { STORAGE_KEYS } from "../../../constants/storageKeys";
import { getTempToken, setCredentials } from "../../../reducers/authSlice";
import { showError, showToast, showWarning } from "../../../constants/toast";
import Loader from "../../../constants/Loader";

const OtpVerify = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const [otp, setOtp] = useState<string>("");
    const dispatch = useAppDispatch();
    const [verifyOtp] = usePostVerifyOtpMutation();
    const [sendOtp] = useResendOtpMutation();
    const [countDown, setCountDown] = useState<number>(30);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const fcmtoken = getFromStorage(STORAGE_KEYS.fcmToken)


    // Resend OTP
    const handleResendOtp = async () => {
        setIsLoading(true)
        let body;
        if (location.state.from === "phone") {
            body = {
                phoneNo: location.state.phone,
                dialCode: location.state.dialCode,
                type: 4
            }
        } else {
            body = {
                email: location.state.email,
                type: 4,
            }
        }


        try {
            const response = await sendOtp(body).unwrap();
            setIsLoading(false)
            if (response?.statusCode === 200) {
                setCountDown(30);
            }
        } catch (error: any) {
            setIsLoading(false)
            showError(error?.data?.message || "");
        }

    };

    const formatTime = (time: any) => {
        return time < 10 ? `0${time}` : time;
    };

    const fetchOtp = async () => {

        removeFromStorage(
            STORAGE_KEYS.token
        );
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
                deviceDetails: [{ deviceToken: fcmtoken || "1234", deviceType: "WEB" }],
                type: 1,
                otp: otp
            }
        } else if (location.state.from === "login") {
            body = {
                phoneNo: location.state.phone,
                dialCode: location.state.dialCode,
                deviceDetails: [{ deviceToken: fcmtoken || "1234", deviceType: "WEB" }],
                type: 2,
                otp: otp
            }
        } else if (location.state.from === "forget") {
            body = {
                email: location.state.email,
                deviceDetails: [{ deviceToken: fcmtoken || "1234", deviceType: "WEB" }],
                type: 4,
                otp: otp
            }
        } else {
            body = {
                email: location.state.email,
                deviceDetails: [{ deviceToken: fcmtoken || "1234", deviceType: "WEB" }],
                type: 1,
                otp: otp
            }
        }
        if (otp?.length !== 4) {
            showWarning("Please enter a valid OTP")
            return;
        }

        try {
            setIsLoading(true)
            const response = await verifyOtp(body).unwrap();
            setIsLoading(false)
            if (response?.statusCode === 200) {

                showToast("Otp verified successfully")
                setToStorage(
                    STORAGE_KEYS.token, response?.data?.accessToken
                );
                dispatch(
                    setCredentials({
                        user: response?.data || null,
                        token: response?.data?.accessToken || null,
                    })
                );
                if (location.state.from === "login") {
                    if (response?.data?.isProfileComplete === true) {

                        navigate('/parent/search-result', { replace: true })
                        setToStorage(STORAGE_KEYS.roleName,'parent')
                        showToast("Logged in successfully")
                    } else {
                        navigate("/auth/as-parent/profile-setup", { replace: true })
                    }

                } else if (location.state.from === "forget") {
                    showToast("OTP verified successfully");
                    navigate('/auth/as-parent/reset-password', { replace: true });
                } else {
                    navigate("/auth/as-parent/profile-setup", {
                        replace: true,
                        state: {
                            from: location.state.from,
                            email: location.state.email,
                            phone: location.state.phone,
                            dialCode: location.state.dialCode,
                            phoneVerified: response.data.isPhoneVerified,
                            emailVerified: response.data.isEmailVerified,
                        },
                    });
                }
            }

        } catch (error: any) {
            setIsLoading(false)
            showError("Invalid OTP")
        }
    }


    useEffect(() => {
        if (countDown > 0) {
            setTimeout(() => {
                setCountDown(countDown - 1);
            }, 1000);
        } else {
            setCountDown(0);
        }
    }, [countDown]);

    const getTextContent = () => {
        switch (location.pathname) {
            case '/auth/as-parent/otp-verify':
                return {
                    header: 'Verify your Phone Number',
                    paragraph: 'To verify your account, please enter the code sent to your phone number. If you haven\'t received the code, click \'Resend\' to get a new one.',
                    link: '/parent/search-result'
                };
            case '/auth/as-parent/otp-verify-email':
                return {
                    header: 'Verify your Email Address',
                    paragraph: 'To verify your account, please enter the code sent to your email address. If you haven\'t received the code, click \'Resend\' to get a new one.',
                    link: '/auth/as-parent/reset-password'
                };
            case '/auth/as-parent/signup-otp-verify-phone':
                return {
                    header: 'Verify your Phone Number',
                    paragraph: 'To verify your account, please enter the code sent to your phone number. If you haven\'t received the code, click \'Resend\' to get a new one.',
                    link: '/auth/as-parent/profile-setup'
                };
            case '/auth/as-parent/signup-otp-verify-email':
                return {
                    header: 'Verify your Email Address',
                    paragraph: 'To verify your account, please enter the code sent to your email address. If you haven\'t received the code, click \'Resend\' to get a new one.',
                    link: '/auth/as-parent/profile-setup'
                };
            // Add more cases for different routes if needed
            default:
                return {
                    header: 'Verify your Phone Number',
                    paragraph: 'To verify your account, please enter the code sent to your phone number. If you haven\'t received the code, click \'Resend\' to get a new one.',
                    link: '/'
                };
        }
    };
    const textContent = getTextContent();

    return (
        <main className="content">
            <Loader isLoad={isLoading} />
            <section className="auth_sc">
                <AuthLeft />
                <div className="rt_s u_spc">
                    <div className="inner hd_5">
                        <h2>
                            <button className="back_arrow" onClick={() => navigate("/auth/as-parent/login")}>
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
                                    numInputs={4}
                                    shouldAutoFocus
                                    renderInput={(props) => <input {...props} />}
                                    inputType="tel"
                                />
                            </div>
                            <div className="form_btn">
                                <Button
                                    // onClick={() => navigate(textContent.link)}
                                    onClick={() => fetchOtp()}
                                // disabled={otp?.length !== 4}
                                >Verify</Button>
                            </div>
                        </form>
                        <div className="bottom_text">
                            {countDown === 0 ? (
                                <p><strong>Didn’t get the code? <a onClick={() => { handleResendOtp(); setOtp("") }}>Resend</a></strong></p>
                            ) : (
                                <p>The verification code will expire in{" "}
                                    <a style={{ margin: 0, marginLeft: 6 }}>
                                        00 :
                                    </a>
                                    <a style={{ margin: 0, marginLeft: 6 }}>
                                        {formatTime(countDown)}
                                    </a>
                                </p>
                            )
                            }
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default OtpVerify;