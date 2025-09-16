/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { ChangeEvent, useEffect, useState } from 'react';
import { CardMedia, Input, Button, Select, TextField, MenuItem, SelectChangeEvent, IconButton } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import InputAdornment from '@mui/material/InputAdornment';
import CloseIcon from '@mui/icons-material/Close';
import { Autocomplete } from "@react-google-maps/api";
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import { useFormik } from "formik";
import * as Yup from "yup";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TextFieldProps } from '@mui/material';
import { useLazyGetUserQuery, useResendOtpMutation, useUpdateProfileMutation } from '../../../../service/auth';
import { showError, showToast, showWarning } from '../../../../constants/toast';
import { useAppDispatch } from '../../../../hooks/store';
import { UploadMedia } from '../../../../utils/mediaUpload';
import { GOOGLE_API_KEY } from '../../../../constants/url';
import { role, setCredentials } from '../../../../reducers/authSlice';
import { getFromStorage, setToStorage } from '../../../../constants/storage';
import { STORAGE_KEYS } from '../../../../constants/storageKeys';
import { isString } from '../../../../utils/validations';
import dayjs, { Dayjs } from 'dayjs';
import VerifyOtpForSetup from '../../../../Modals/verifyOtp';
import moment from 'moment';
import Loader from '../../../../constants/Loader';
import TutorStepsAside from '../profileSetup/stepsAside';
import EditText from '../../../../components/EditText';

const TutorProfileSetupEdit = () => {

    const navigate = useNavigate();
    const [open, setOpen] = useState<boolean>(false);

    const [gender, setGender] = React.useState('');

    const [autocomplete, setAutocomplete] = useState(null)
    const token = getFromStorage(STORAGE_KEYS?.token);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const location = useLocation();
    const { state } = location;
    const [updateProfile] = useUpdateProfileMutation();
    const [getProfile] = useLazyGetUserQuery();
    const [profileData, setProfileData] = useState<any>();
    const dispatch = useAppDispatch();
    const [sendOtp] = useResendOtpMutation();
    const [emailVerifed, setEmailVerfied] = useState<boolean>();
    const [phoneVerified, setPhoneVerified] = useState<boolean>();
    const [latlng, setLatlong] = useState({
        lat: 0,
        long: 0
    })
    const setRole = (roles: string) => {
        dispatch(role({ roleName: roles }));
    };
    const onClose = () => {
        setOpen(false)
    }

    const handleImageUpload = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const files = event.target;
        const file = files?.files?.length ? files?.files[0] : "";
        if (file) {
            if (file.type.startsWith("image/")) {
                //                console.log(file, "FILE");
                //                console.log(file, "FILE");
                formik.setFieldValue("image", URL.createObjectURL(file));
                const res = await UploadMedia(file);
                if (res?.statusCode === 200) {
                    showToast("Image uploaded successfully")
                    formik.setFieldValue("image", res?.data?.image);
                }
                else {
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
            email: profileData?.email ? profileData?.email : location.state?.email ? location.state?.email : "",
            phoneNo: profileData?.phoneNo ? profileData?.phoneNo : location.state?.phoneNo ? location.state?.phoneNo : "",
            dialCode: profileData?.dialCode ? profileData?.dialCode : location.state?.dialCode ? location.state?.dialCode : "+1",
            image: profileData?.image || "",
            userName: profileData?.userName || "",
            latitude: profileData?.latitude || "",
            longitude: profileData?.longitude || "",
            address: profileData?.address || "",
            countryName: profileData?.countryName || "",
            gender: profileData?.gender || "",
            age: profileData?.age || "",
            shortBio: profileData?.shortBio || "",
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .required("Name is required")
                .min(2, "Minimum 2 characters are required")
                .max(100, "Maximum 100 characters are allowed")
                .matches(
                    /^[A-Za-z\s'-]+$/,
                    "Name must contain only alphabets"
                ),
            userName: Yup.string()
                .required("user name is required")
                .min(2, "Minimum 2 characters are required")
                .max(100, "Maximum 100 characters are allowed"),
            email: Yup.string()
                .required("Email is required")
                .matches(
                    /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i,
                    "Enter a valid email address!"
                ),
            age: Yup.string()
                .required("Date of birth is required"),
            shortBio: Yup.string()
                .required("Description is required")
                .min(10, 'Description must have 10 characters'),
            phoneNo: Yup.string()
                .required("Phone number is required")
                .min(8, "Minimum 8 digits are required")
                .max(16, "Maximum 16 digits are allowed"),
            address: Yup.string()
                .required("Address is required"),

        }),

        onSubmit: async (values) => {
            formik.setSubmitting(true);

            if (!gender) {
                showWarning("Please select a gender")
                return;
            }
            if (!formik.values.image) {
                showWarning("Please select an image")
                return;
            }
            if (!emailVerifed) {
                showWarning("Please Verify your Email")
                return;
            }
            if (!phoneVerified) {
                showWarning("Please Verify your Phone number")
                return;
            }
            if (formik.values.age === "") {
                showWarning("Please Add date of birth")
                return;
            }
            if (latlng.lat === 0 && latlng.long === 0) {
                showWarning("Please select a valid address");
                return;
            }

            let body = {
                name: values.name,
                userName: values.userName,
                age: moment(values.age)
                    .utc()
                    .format("YYYY-MM-DDTHH:mm:ss[Z]"),
                gender: gender,
                image: values.image,
                longitude: latlng?.long,
                shortBio: values?.shortBio,
                latitude: latlng?.lat,
                address: values.address,
            };

            //            console.log("body for setup", body);

            try {
                setIsLoading(true)
                const response = await updateProfile(body).unwrap();
                if (response?.statusCode === 200) {
                    showToast("Profile updated successfully")
                    navigate("/tutor/profile")
                    dispatch(
                        setCredentials({
                            user: response?.data || null,
                            token: token || null,
                        }),
                    );
                }
                setIsLoading(false)
            } catch (errors: any) {
                //                console.log(errors, "errrr");
                setIsLoading(false)
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

    const onLoad = (autocompleteObj: any) => {
        setAutocomplete(autocompleteObj);

    };


    const onPlaceChanged = async () => {
        //        console.log("inside")
        if (autocomplete) {
            let place = await (autocomplete as any).getPlace()
            if (place && place.address_components) {
                let address = place.address_components;
                let state,
                    city,
                    country,
                    zip = "";
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

                formik.setFieldValue("address", `${place?.formatted_address}`);
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
        formik.setFieldValue("address", "");
    };

    //    console.log(state, "satte in step1");


    // Resend OTP
    const handleResendOtp = async () => {
        let body;
        if (emailVerifed) {
            body = {
                phoneNo: formik.values.phoneNo,
                dialCode: formik.values.dialCode,
                type: 3
            }
        } else {
            body = {
                email: formik.values.email,
                type: 3,
            }
        }
        //        console.log(body, "body in resent otp");
        try {
            const response = await sendOtp(body).unwrap();
            if (response?.statusCode === 200) {
                setOpen(true);
            }
        } catch (error: any) {
            showError(error?.data?.message || "");
            //            console.log(error);
        }

    };
    const fetchUser = async () => {
        const token = getFromStorage(STORAGE_KEYS.token)
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
                setEmailVerfied(res?.data?.isEmailVerified ? res?.data?.isEmailVerified : location.state?.emailVerified);
                setPhoneVerified(res?.data?.isPhoneVerified ? res?.data?.isPhoneVerified : location.state?.phoneVerified)
                setGender(res?.data?.gender ? res?.data?.gender : "")
                setLatlong({
                    lat: res?.data?.latitude ? res?.data?.latitude : 0,
                    long: res?.data?.longitude ? res?.data?.longitude : 0
                })
            }
        } catch (error: any) {
            showError(error?.data?.message)
        }
    }

    //    console.log(profileData, "my profile");



    useEffect(() => {
        fetchUser();
        setRole("tutor");
    }, [])

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

    //    console.log(formik.values.age, "formik.values.age");

    useEffect(() => {
        if (formik.values.phoneNo === profileData?.phoneNo) {
            setPhoneVerified(true)
        }
    }, [formik.values.phoneNo])

    useEffect(() => {
        if (formik.values.email === profileData?.email) {
            setEmailVerfied(true)
        }
    }, [formik.values.email])





    return (
        <main className="content editTutor">
            <Loader isLoad={isLoading} />
            {/* <header className="inner_header">
                <div className="conta_iner">
                    <a onClick={() => navigate("/")} className="site_logo">
                        <figure>
                            <img src={`/static/images/logo.png`} alt="logo" />
                        </figure>
                    </a>
                </div>
            </header> */}
            <section className="tutor_setup ">
                <div className="conta_iner">
                    {/* <TutorStepsAside active={active} name="profile" /> */}
                    <div className="rt_s">
                        <h2>
                            <button className="back_arrow" onClick={() => navigate("/tutor/profile")}>
                                <img src={`/static/images/back.png`} alt="img" />
                            </button>
                            <strong>Edit Profile</strong>
                        </h2>
                        <form onSubmit={formik.handleSubmit} className="form">
                            <div className="gap_p">
                                <div className="control_group text_center">
                                    {formik.values.image ? (
                                        <div className="upload_image v2">
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
                                        <label className="upload_image v2" htmlFor="icon-button-file">
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
                                                    <figcaption>Add Photo</figcaption>
                                                </figure>
                                            </span>
                                        </label>
                                    )}
                                </div>
                                <div className="control_group w_50">
                                    <TextField
                                        hiddenLabel
                                        fullWidth
                                        placeholder="Full Name"
                                        className="text_field"
                                        inputProps={{ maxLength: 100 }}
                                        name="name"
                                        onChange={(val) => {
                                            if (
                                                val.target.value === " " ||
                                                val.target.value === "."
                                            ) {
                                            } else if (isString(val.target.value)) {
                                                formik.handleChange(val);
                                            }
                                        }}
                                        value={formik.values.name}
                                        onBlur={formik.handleBlur}
                                        helperText={
                                            formik.touched.name && typeof formik.errors.name === 'string'
                                                ? formik.errors.name
                                                : ''
                                        }
                                    ></TextField>
                                </div>
                                <div className="control_group w_50">
                                    <TextField
                                        hiddenLabel
                                        fullWidth
                                        placeholder="User name"
                                        className="text_field"
                                        inputProps={{ maxLength: 100 }}
                                        name="userName"
                                        onChange={(val) => {
                                            let newValue = val.target.value;
                                            newValue = newValue.replace(/\s/g, '');
                                            val.target.value = newValue;
                                            formik.handleChange(val);
                                        }}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.userName}
                                        helperText={
                                            formik.touched.userName && typeof formik.errors.userName === 'string'
                                                ? formik.errors.userName
                                                : ''
                                        }
                                    ></TextField>
                                </div>
                                <div className="control_group w_50">
                                    <TextField
                                        hiddenLabel
                                        fullWidth
                                        className="text_field"
                                        placeholder="Enter your Email ID"
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    {emailVerifed || (formik.values.email === profileData?.email && formik.values.email !== "") ? (
                                                        <p className='verify-link' >Verified</p>
                                                    ) : (
                                                        <p
                                                            onClick={() => { handleResendOtp() }}
                                                            className='verify-link' >Verify</p>
                                                    )}
                                                </InputAdornment>
                                            ),
                                        }}
                                        name="email"
                                        value={formik.values.email}
                                        onChange={(val) => {
                                            if (
                                                val.target.value === " " ||
                                                val.target.value === "."
                                            ) {
                                            } else {
                                                setEmailVerfied(false)
                                                formik.handleChange(val);
                                            }
                                        }}
                                        onBlur={formik.handleBlur}
                                        helperText={
                                            formik.touched.email && typeof formik.errors.email === 'string'
                                                ? formik.errors.email
                                                : ''
                                        }
                                    ></TextField>
                                </div>
                                <div className="control_group w_50">
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            className="label_hidden"
                                            label="Date of Birth"
                                            value={formik.values.age ? dayjs(formik.values.age) : null}
                                            onChange={(value) => formik.setFieldValue("age", value)}
                                            maxDate={dayjs().subtract(18, "year")}
                                        />
                                    </LocalizationProvider>

                                </div>
                                <div className="control_group w_50">
                                    <PhoneInput
                                        country={"us"}
                                        placeholder="Enter Your Phone Number"
                                        enableSearch={true}
                                        onChange={(phone, country) => {
                                            handleChangePhone(phone, country)
                                            setPhoneVerified(false)
                                        }
                                        }
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
                                            <p onClick={() => {
                                                if (!phoneVerified) {
                                                    handleResendOtp();
                                                }
                                            }} >{phoneVerified || (formik.values.phoneNo === profileData?.phoneNo && formik.values.phoneNo !== "") ? "Verified" : " Verify"}</p>
                                        </div>
                                    ) : ("")
                                    }
                                    {formik.touched.phoneNo && typeof formik.errors.phoneNo === 'string' && (
                                        <div style={{ color: 'red', fontSize: "13px" }}>{formik.errors.phoneNo}</div>
                                    )}
                                </div>
                                <div className="control_group w_50">
                                    <Select
                                        labelId="gender-label"
                                        id="gender"
                                        value={gender}
                                        onChange={(event) => setGender(event.target.value)}
                                        displayEmpty
                                    >
                                        <MenuItem value="" disabled>Gender</MenuItem>
                                        <MenuItem value="MALE">Male</MenuItem>
                                        <MenuItem value="FEMALE">Female</MenuItem>
                                    </Select>
                                </div>
                                <Autocomplete
                                    onLoad={onLoad}
                                    onPlaceChanged={() => onPlaceChanged()}
                                >
                                    <div className="control_group">
                                        <TextField
                                            hiddenLabel
                                            fullWidth
                                            placeholder="Address"

                                            className="text_field"
                                            name="address"
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
                                            value={formik.values.address}
                                            helperText={
                                                formik.touched.address && typeof formik.errors.address === 'string'
                                                    ? formik.errors.address
                                                    : ''
                                            }
                                            InputProps={{
                                                endAdornment: formik.values.address ? (
                                                    <InputAdornment position="end">
                                                        <IconButton onClick={handleClear}>
                                                            <CloseIcon />
                                                        </IconButton>
                                                    </InputAdornment>
                                                ) : null,
                                            }}
                                        ></TextField>
                                    </div>
                                </Autocomplete>
                                <div className="control_group">
                                    {formik.values.shortBio ? (
                                        <EditText
                                            content={formik.values.shortBio}
                                            setContent={(value) => formik.setFieldValue("shortBio", value)}
                                        />
                                    ) : null}

                                    {/* <TextField
                                        hiddenLabel
                                        fullWidth
                                        placeholder="Description"
                                        multiline
                                        rows={5}
                                        className="text_field"
                                        name="shortBio"
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
                                        value={formik.values.shortBio}
                                        helperText={
                                            formik.touched.shortBio && typeof formik.errors.shortBio === 'string'
                                                ? formik.errors.shortBio
                                                : ''
                                        }
                                    ></TextField> */}
                                </div>
                            </div>
                            <div className="form_btn">
                                <Button variant="outlined" color="primary" onClick={() => navigate('/tutor/profile')}>Cancel</Button>
                                <Button
                                    // onClick={() => navigate('/auth/as-tutor/profile-setup/step1/2')}
                                    type="submit"
                                >Continue</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </section >
            {open ? <VerifyOtpForSetup
                open={open}
                setOpen={setOpen}
                onClose={onClose}
                from={emailVerifed ? "phone" : "email"}
                phone={formik.values.phoneNo}
                email={formik.values.email}
                dialCode={formik.values.dialCode}
                setEmailVerfied={setEmailVerfied}
                setPhoneVerified={setPhoneVerified}
            /> : undefined}
        </main >
    )
}

export default TutorProfileSetupEdit;