/* eslint-disable jsx-a11y/anchor-is-valid */
import { Button, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useLazyGetBankQuery, useUpdateBankMutation } from '../../../../service/tutorProfileSetup';
import { showError, showToast } from '../../../../constants/toast';
import { useFormik } from "formik";
import * as Yup from "yup";
import { isNumber, isString } from '../../../../utils/validations';
import Loader from '../../../../constants/Loader';


const TutorBankDetailEdit = () => {

    const navigate = useNavigate();
    const [postBank] = useUpdateBankMutation();
    const [getBank] = useLazyGetBankQuery();
    const [bankData, setBankData] = useState<any>();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const fetchBank = async () => {
        try {
            const res = await getBank({}).unwrap();
            if (res?.statusCode === 200) {
                setBankData(res?.data?.bank[0])
            }
        } catch (error: any) {
            showError(error?.data?.message)
        }
    }


    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            accountNumber: bankData?.accountNumber || "",
            accountHolderName: bankData?.accountHolderName || "",
            swiftCode: bankData?.swiftCode || "",
            bankName: bankData?.bankName || "",
        },
        validationSchema: Yup.object({
            accountNumber: Yup.string()
                .required("Account Number is required")
                .min(6, "Minimum 6 characters are required")
                .max(100, "Maximum 50 characters is required"),
            accountHolderName: Yup.string()
                .required("Account Holder Name is required")
                .min(3, "Minimum 3 characters are required")
                .max(100, "Maximum 80 characters is required"),
            swiftCode: Yup.string()
                .required("Swift Code is required")
                .min(2, "Minimum 2 characters are required")
                .max(100, "Maximum 20 characters is required"),
            bankName: Yup.string()
                .required("Bank Name is required")
                .min(3, "Minimum 3 characters are required")
                .max(100, "Maximum 80 characters is required"),
        }),

        onSubmit: async (values) => {
            formik.setSubmitting(true);

            let body = {
                accountNumber: values.accountNumber,
                accountHolderName: values.accountHolderName,
                swiftCode: values.swiftCode,
                bankName: values.bankName,
            };

//            console.log("body for bank", body);

            try {
                setIsLoading(true)
                const response = await postBank({ body: body, id: bankData?._id }).unwrap();
                if (response?.statusCode === 200) {
                    showToast("Bank details updated successfully")
                    navigate("/tutor/profile")
                }
                setIsLoading(false)
            } catch (errors: any) {
//                console.log(errors, "errrr");
                setIsLoading(false)
                showError(errors?.data?.message);
            }
        },
    });

    useEffect(() => {
        fetchBank()
    }, [])
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
            <section className="tutor_setup">
                <div className="conta_iner">
                    {/* <TutorStepsAside active={active} name="bank" /> */}
                    <div className="rt_s">
                        <h2>
                            <button className="back_arrow" onClick={() => navigate("/tutor/profile")}>
                                <img src={`/static/images/back.png`} alt="img" />
                            </button>
                            <strong>Edit Bank A/C Details</strong>
                        </h2>
                        <form onSubmit={formik.handleSubmit} className="form">
                            <div className="gap_p">
                                <div className="control_group w_100">
                                    <TextField
                                        hiddenLabel
                                        fullWidth
                                        placeholder="A/C Number"
                                        className="text_field"
                                        inputProps={{ maxLength: 100 }}
                                        name="accountNumber"
                                        onChange={(val) => {
                                            if (
                                                val.target.value === " " ||
                                                val.target.value === "."
                                            ) {
                                            } else if (isNumber(val.target.value)) {
                                                formik.handleChange(val);
                                            }
                                        }}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.accountNumber}
                                        helperText={
                                            formik.touched.accountNumber && typeof formik.errors.accountNumber === 'string'
                                                ? formik.errors.accountNumber
                                                : ''
                                        }
                                    ></TextField>
                                </div>
                                <div className="control_group w_100">
                                    <TextField
                                        hiddenLabel
                                        fullWidth
                                        placeholder="Account Holder Name"
                                        className="text_field"
                                        inputProps={{ maxLength: 100 }}
                                        name="accountHolderName"
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
                                        value={formik.values.accountHolderName}
                                        helperText={
                                            formik.touched.accountHolderName && typeof formik.errors.accountHolderName === 'string'
                                                ? formik.errors.accountHolderName
                                                : ''
                                        }
                                    ></TextField>
                                </div>
                                <div className="control_group w_100">
                                    <TextField
                                        hiddenLabel
                                        fullWidth
                                        placeholder="Swift Code"
                                        className="text_field"
                                        inputProps={{ maxLength: 100 }}
                                        name="swiftCode"
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
                                        value={formik.values.swiftCode}
                                        helperText={
                                            formik.touched.swiftCode && typeof formik.errors.swiftCode === 'string'
                                                ? formik.errors.swiftCode
                                                : ''
                                        }
                                    ></TextField>
                                </div>
                                <div className="control_group w_100">
                                    <TextField
                                        hiddenLabel
                                        fullWidth
                                        placeholder="Bank Name"
                                        className="text_field"
                                        inputProps={{ maxLength: 100 }}
                                        name="bankName"
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
                                        value={formik.values.bankName}
                                        helperText={
                                            formik.touched.bankName && typeof formik.errors.bankName === 'string'
                                                ? formik.errors.bankName
                                                : ''
                                        }
                                    ></TextField>
                                </div>
                            </div>
                            <div className="form_btn">
                                <Button variant="outlined" color="primary" onClick={() => navigate('/tutor/profile')}>Cancel</Button>
                                <Button
                                    // onClick={() => navigate('/auth/as-tutor/profile-setup/step2')}
                                    type="submit"
                                >Continue</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </section >
        </main >
    )
}

export default TutorBankDetailEdit;