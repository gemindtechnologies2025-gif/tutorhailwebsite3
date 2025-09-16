/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import InputAdornment from '@mui/material/InputAdornment';
import TutorAuthLeft from './authLeft';
import { useForgotPasswordMutation } from '../../../service/auth';
import { showError, showToast } from '../../../constants/toast';
import Loader from '../../../constants/Loader';

const TutorForgotPassword = () => {

    const navigate = useNavigate();
    const [forgetpassword] = useForgotPasswordMutation();
    const [email, setEmail] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const fetchForgotPassword = async () => {
        setIsLoading(true)
        try {
            const res = await forgetpassword({ email: email, type: 4 }).unwrap();
            if (res?.statusCode === 200) {
                showToast(res?.message || "OTP sent successfully")
                navigate('/auth/as-tutor/otp-verify-email', { state: { from: "forget", email: email } });
            }
            setIsLoading(false)
        } catch (error: any) {
            setIsLoading(false)
            showError(error?.data?.message || "Something went wrong")
        }
    }

    return (
        <main className="content">
            <Loader isLoad={isLoading} />
            <section className="auth_sc tutorAuth_sc">
                <TutorAuthLeft />
                <div className="rt_s u_spc">
                    <div className="inner hd_5">
                        <h2>
                            <button className="back_arrow" onClick={() => navigate("/auth/as-tutor/login")}>
                                <img src={`/static/images/back.png`} alt="img" />
                            </button>
                            <strong>Forgot Password?</strong>
                        </h2>
                        <p>Enter your email address to receive a link to reset your password. Follow the instructions in the email to create a new password and restore access to your account.</p>
                        <form className="form">
                            <div className="control_group">
                                <TextField
                                    hiddenLabel
                                    fullWidth
                                    value={email}
                                    placeholder="Enter your Email ID"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <MailOutlineIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="form_btn">
                                <Button
                                    // onClick={() => navigate('/auth/as-tutor/otp-verify-email')}
                                    disabled={!email ? true : false}
                                    onClick={() => fetchForgotPassword()}
                                >Next</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default TutorForgotPassword;