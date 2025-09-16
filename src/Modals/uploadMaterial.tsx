import { Modal, TextField } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Button from '@mui/material/Button';
import { useUploadStudyMatMutation } from "../service/tutorApi";
import { useFormik } from "formik";
import * as Yup from "yup";
import Loader from "../constants/Loader";
import { showError, showToast } from "../constants/toast";
import { UploadMedia, Uploadpdf } from "../utils/mediaUpload";
import { isValidInput } from "../utils/validations";

interface UploadMaterialProps {
    open: boolean;
    onClose: () => void;
    setOpen: Dispatch<SetStateAction<boolean>>;
    bookingId: string;
    bookingDetailId: string;
    parentId: string;
    fetchBooking: () => void;
}

export default function UploadMaterialModal({
    open,
    onClose,
    setOpen,
    bookingId,
    bookingDetailId,
    parentId,
    fetchBooking
}: UploadMaterialProps) {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [postMaterial] = useUploadStudyMatMutation();

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            title: "",
            description: "",
            content: "",
        },
        validationSchema: Yup.object({
            title: Yup.string()
                .required("Title is required")
                .max(200, "Maximum 200 characters is required"),
            description: Yup.string()
                .required("Description is required")
                .max(300, "Maximum 300 characters is required"),
        }),

        onSubmit: async (values) => {
            formik.setSubmitting(true);

            let body = {
                parentId: parentId,
                bookingId: bookingId,
                bookingDetailId: bookingDetailId,
                title: values.title,
                description: values.description,
                content: values.content,
            };

            // ("body for study", body);

            try {
                setIsLoading(true)
                const response = await postMaterial(body).unwrap();
                if (response?.statusCode === 200) {
                    showToast("Documents uploaded successfully")
                    fetchBooking()
                    formik.setFieldValue("content", "");
                    formik.setFieldValue("description", "");
                    formik.setFieldValue("title", "")
                    setOpen(false)
                }
                setIsLoading(false)
            } catch (errors: any) {
                setIsLoading(false)
                showError(errors?.data?.message);
            }
        },
    });

    const handleImageUpload = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const files = event.target.files;
        if (!files) return;

        try {
            setIsLoading(true);

            const fileArray = Array.from(files); // Convert FileList to an array

            for (const file of fileArray) {
                let res: { statusCode: number; data: { image: string }; message?: string }; // Explicitly type 'res'

                if (file.type === "application/pdf") {
                    res = await Uploadpdf(file);
                } else {
                    res = await UploadMedia(file);
                }

                if (res?.statusCode === 200) {

                    formik.setFieldValue("content", res?.data?.image)
                } else {
                    showError(res?.message || "Error uploading file");
                }
            }
        } catch (error) {
            setIsLoading(false);
            console.error("Error uploading file:", error);
            showError("Error uploading file. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };



    return (
        <>
            <Loader isLoad={isLoading} />
            <Modal
                className="modal uploadMaterial_modal"
                id="uploadMaterialModal"
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
                        <h2>Upload Study Material</h2>
                        <p>Help your students with your study materials</p>
                        <form className="form" onSubmit={formik.handleSubmit}>
                            <div className="control_group">
                                <TextField
                                    fullWidth
                                    hiddenLabel
                                    placeholder="Title"
                                    className="text_field"
                                    inputProps={{ maxLength: 200 }}
                                    name="title"
                                    onChange={(e) => {
                                        if (isValidInput(e.target.value)) {
                                            formik.handleChange(e)
                                        }
                                    }}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.title}
                                    helperText={
                                        formik.touched.title && typeof formik.errors.title === 'string'
                                            ? formik.errors.title
                                            : ''
                                    }
                                />
                            </div>
                            <div className="control_group">
                                <TextField
                                    fullWidth
                                    hiddenLabel
                                    placeholder="Description"
                                    className="text_field"
                                    inputProps={{ maxLength: 300 }}
                                    name="description"
                                    onChange={(e) => {
                                        if (isValidInput(e.target.value)) {
                                            formik.handleChange(e)
                                        }
                                    }}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.description}
                                    helperText={
                                        formik.touched.description && typeof formik.errors.description === 'string'
                                            ? formik.errors.description
                                            : ''
                                    }
                                />
                            </div>
                            <div className="control_group">
                                {formik.values.content === "" ? (
                                    <div className="upload_doc">
                                        <input
                                            accept=" application/pdf"
                                            type="file"
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                handleImageUpload(e)
                                            }
                                        />
                                        <figure><img src={`/static/images/upload_icon.svg`} alt="Icon" /></figure>
                                        <h3>Education Documents</h3>
                                        <p>Please upload your government attested educational documents(pdf)</p>
                                    </div>
                                ) : (
                                    <div className="single">
                                        <span className="btn-close" onClick={() => formik.setFieldValue("content", "")}><CloseIcon /></span>
                                        <figure> <img
                                            style={{ width: "100%", height: "200px", objectFit: "contain" }}
                                            src={formik.values.content.includes(".pdf") ? `/static/images/pdf_icon.svg` : formik.values.content}
                                            alt="Icon"
                                        /></figure>
                                    </div>

                                )}

                            </div>
                            <div className="form_btn">
                                <Button variant="outlined" color="primary" onClick={() => {
                                    setOpen(false);
                                    formik.setFieldValue("content", "");
                                    formik.setFieldValue("description", "");
                                    formik.setFieldValue("title", "")
                                }}>Cancel</Button>
                                <Button color="primary" type="submit">Submit</Button>
                            </div>
                        </form>
                    </div>
                </div >
            </Modal >
        </>
    );
}