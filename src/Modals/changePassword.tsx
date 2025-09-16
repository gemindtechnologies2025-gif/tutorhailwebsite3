import { IconButton, InputAdornment, Modal, TextField } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Button from '@mui/material/Button';
import React from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { usePostChangePasswordMutation } from "../service/auth";
import Loader from "../constants/Loader";
import { useFormik } from "formik";
import * as Yup from "yup";
import { showError, showToast } from "../constants/toast";

interface ChangePasswordProps {
    open: boolean;
    onClose: () => void;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function ChangePasswordModal({
    open,
    onClose,
    setOpen,
}: ChangePasswordProps) {
    const [ChangePassword, { isLoading }] =
        usePostChangePasswordMutation();

    const [showPassword1, setShowPassword1] = useState<boolean>(false);
    const handleClickShowPassword1 = () => {
        setShowPassword1(!showPassword1);
    };

    const [showPassword2, setShowPassword2] = useState<boolean>(false);
    const handleClickShowPassword2 = () => {
        setShowPassword2(!showPassword2);
    };

    const [showPassword3, setShowPassword3] = useState<boolean>(false);
    const handleClickShowPassword3 = () => {
        setShowPassword3(!showPassword3);
    };

    const formik = useFormik({
        initialValues: {
            newPassword: "",
            passwordConfirmation: "",
            oldPassword: "",
        },
        validationSchema: Yup.object({
            oldPassword: Yup.string()
                .label("Old Password")
                .required("Old password is required."),

            newPassword: Yup.string()
                .label("new Password")
                .required("New password is required.")
                .notOneOf(
                    [Yup.ref("oldPassword"), null],
                    "New password cannot be same as old password."
                )
                .matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/,
                    "Enter a strong password"),

            passwordConfirmation: Yup.string()
                .oneOf([Yup.ref("newPassword")], "Passwords must match.")
                .required("Confirm password is required."),
        }),

        onSubmit: async () => {
            formik.setSubmitting(true);

            let data = {
                oldPassword: formik.values.oldPassword,
                newPassword: formik.values.newPassword,
            };


            try {
                const response = await ChangePassword(data).unwrap();
                if (response?.statusCode === 200) {
                    showToast("Password changed successfully");
                    setOpen(false)
                    formik.setFieldValue('newPassword', "")
                    formik.setFieldValue('oldPassword', "")
                    formik.setFieldValue('passwordConfirmation', "")
                }
            } catch (error: any) {
                showError(error?.data?.message || "");
            }
            formik.setSubmitting(false);
        },
    });

    return (
        <>
            <Loader isLoad={isLoading} />
            <Modal
                className="modal changePassword_modal"
                id="changePasswordModal"
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
                        <h2>Change Password</h2>
                        <p>Update your password to keep your account secure. Enter your current password followed by your new one to make the change.
                        </p>
                        <form onSubmit={formik.handleSubmit} className="form">
                            <div className="control_group">
                                <TextField
                                    fullWidth
                                    hiddenLabel
                                    type={showPassword1 ? "text" : "password"}
                                    placeholder="Enter Old Password"
                                    className="text_field"
                                    name="oldPassword"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.oldPassword}
                                    helperText={
                                        formik.touched.oldPassword && formik.errors.oldPassword
                                    }
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment className="eye_btn" position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={() => handleClickShowPassword1()}
                                                    edge="end"
                                                >
                                                    {showPassword1 ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                ></TextField>
                            </div>
                            <div className="control_group">
                                <TextField
                                    fullWidth
                                    hiddenLabel
                                    className="text_field"
                                    type={showPassword2 ? "text" : "password"}
                                    placeholder="Enter New Password"
                                    name="newPassword"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.newPassword}
                                    helperText={
                                        formik.touched.newPassword && formik.errors.newPassword
                                    }
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment className="eye_btn" position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={() => handleClickShowPassword2()}
                                                    edge="end"
                                                >
                                                    {showPassword2 ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                ></TextField>
                            </div>
                            <div className="control_group">
                                <TextField
                                    fullWidth
                                    hiddenLabel
                                    className="text_field"
                                    type={showPassword3 ? "text" : "password"}
                                    placeholder="Re-Enter New Password"
                                    name="passwordConfirmation"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.passwordConfirmation}
                                    helperText={
                                        formik.touched.passwordConfirmation &&
                                        formik.errors.passwordConfirmation
                                    }
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment className="eye_btn" position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={() => handleClickShowPassword3()}
                                                    edge="end"
                                                >
                                                    {showPassword3 ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                ></TextField>
                            </div>
                            <div className="form_btn">
                                <Button variant="outlined" color="primary" onClick={() => setOpen(false)}>Cancel</Button>
                                <Button color="primary" type='submit'>Change Password</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </Modal>
        </>
    );
}