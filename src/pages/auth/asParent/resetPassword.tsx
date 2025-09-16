/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import { Button, IconButton, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import InputAdornment from '@mui/material/InputAdornment';
import AuthLeft from './authLeft';
import { useResetPasswordMutation } from '../../../service/auth';
import { useFormik } from "formik";
import * as Yup from "yup";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { showError, showToast } from '../../../constants/toast';
import Loader from '../../../constants/Loader';

const ResetPassword = () => {

    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] =
        useState<boolean>(false);



    const [resetPassword] = useResetPasswordMutation();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };
    const handleshowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const formik = useFormik({
        initialValues: {
            newPassword: "",
            passwordConfirmation: "",
        },
        validationSchema: Yup.object({
            newPassword: Yup.string()
                .label("Password")
                .required("Password is required.")
                .matches(
                    /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])(?=.*[0-9])[^\s]{8,}$/,
                    "Password must be at least 8 characters long and include 1 uppercase, 1 lowercase, and 1 special character."
                ),

            passwordConfirmation: Yup.string()
                .oneOf([Yup.ref("newPassword")], "Passwords must match.")
                .required("Confirm password is required."),
        }),
        onSubmit: async () => {
            formik.setSubmitting(true);
            try {
                setIsLoading(true)
                const response = await resetPassword({ newPassword: formik.values.newPassword }).unwrap();
                setIsLoading(false)
                if (response?.statusCode === 200) {
                    showToast(response?.message || "Password reset successfully");
                    navigate('/auth/as-parent/login');
                }
            } catch (error: any) {
                setIsLoading(false)
                showError(error?.data?.message || "");
            }
            formik.setSubmitting(false);
        },
    });

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
                            <strong>Reset Password?</strong>
                        </h2>
                        <p>Enter your new password and restore access to your account.</p>
                        <form onSubmit={formik.handleSubmit} className="form">
                            <div className="control_group">
                                <TextField
                                    hiddenLabel
                                    fullWidth
                                    placeholder="Enter your Password"
                                    variant="outlined"
                                    name="newPassword"
                                    type={showPassword ? "text" : "password"}
                                    value={formik.values.newPassword}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
                                    helperText={formik.touched.newPassword && formik.errors.newPassword}
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
                            <div className="control_group">
                                <TextField
                                    hiddenLabel
                                    fullWidth
                                    placeholder="Enter your Password"
                                    variant="outlined"
                                    name="passwordConfirmation"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={formik.values.passwordConfirmation}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.passwordConfirmation && Boolean(formik.errors.passwordConfirmation)}
                                    helperText={formik.touched.passwordConfirmation && formik.errors.passwordConfirmation}
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
                                                    aria-label="toggle passwordConfirmation visibility"
                                                    onClick={() => handleshowConfirmPassword()}
                                                    edge="end"
                                                >
                                                    {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                ></TextField>
                            </div>
                            <div className="form_btn">
                                <Button type="submit">Submit</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default ResetPassword;