import React, { useEffect, useState } from "react";
import { useFormik } from "formik"; // ✅ Added Formik
import * as Yup from "yup"; // ✅ Added Yup
import Modal from "@mui/material/Modal";
import {
  Box,
  Button,
  Input,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import { UploadMedia } from "../utils/mediaUpload";
import {
  CONTENT_TYPE,
  INQUIRY_TYPE,
  TYPE_SUBJECT_LISTING,
} from "../constants/enums";
import {
  useCreateContentMutation,
  useUpdateContentMutation,
} from "../service/content";
import { showToast } from "../constants/toast";
import CancelIcon from "@mui/icons-material/Cancel";
import { useLazyGetSubjectsAndCategoryQuery } from "../service/auth";
import { useAddInquiryMutation } from "../service/inquiry";
import useAuth from "../hooks/useAuth";
import { useParams } from "react-router-dom";
import Loader from "../constants/Loader";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

interface AddFormProps {
  open: boolean;
  handleOpen: () => void;
  handleClose: () => void;
}

// ✅ Yup validation schema added
const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().required("Email is required"),
  type: Yup.string().required("Type is required"),
});

export const AddInquriryModal = ({
  open,
  handleOpen,
  handleClose,
}: AddFormProps) => {
  const [addInquiry, { isLoading }] = useAddInquiryMutation();
  const user = useAuth();
    const {id}=useParams();
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      type: "",
      other: "",
      name: user?.name || "",
      email: user?.email || "",
    },
    validationSchema,
    onSubmit: async (values) => {
      handleClose();
      const body = {
        tutorId: id,
        type: values.type ? Number(values.type):INQUIRY_TYPE.OTHERS,
        ...(values.other ? { other:values.other}:{}),
        name: values.name||"",
        email: values.email||"",
      };
      try {
        let res = await addInquiry(body).unwrap();
        if (res?.statusCode === 200) {
          showToast("Inquiry added successfully");
          formik.resetForm();
        }
      } catch (error: any) {
        console.log(error);
      } finally {
        handleClose();
      }
    },
  });

  useEffect(() => {
    if (!open) {
      formik.resetForm();
    }
  }, [open]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description">
      <Box sx={style}>
        <Loader isLoad={isLoading} />
        <div className="form_discuss">
          <div
            className="btn-close"
            style={{
              display: "flex",
              justifyContent: "flex-end",
              cursor: "pointer",
            }}
          >
            <CloseIcon onClick={handleClose} />
          </div>
          
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Report Tutor
          </Typography>

          {/* ✅ Wrapped form in formik.handleSubmit */}
          <form
            className="form"
            onSubmit={formik.handleSubmit}
            style={{ marginTop: "20px" }}
          >
            <div className="control_group" style={{ marginTop: "15px" }}>
              <Select
                name="type"
                value={formik.values.type}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                fullWidth
                displayEmpty
              >
                <MenuItem value="" disabled>
                  Select for quick inquiry
                </MenuItem>
                <MenuItem value={INQUIRY_TYPE.TEACHING_STYLE}>
                  Teaching
                </MenuItem>
                <MenuItem value={INQUIRY_TYPE.AVAILABILITY}>
                  Availability
                </MenuItem>
                <MenuItem value={INQUIRY_TYPE.RESOURCES}>Resources</MenuItem> 
                <MenuItem value={INQUIRY_TYPE.SUBJECT}>Subject</MenuItem>
              </Select>
              {formik.touched.type && formik.errors.type && (
                <Typography color="error" fontSize={12}>
                  {formik.errors.type as string}
                </Typography>
              )}
            </div>

            {/* ✅ Title input with Formik bindings */}
            <div className="control_group" style={{ marginTop: "15px" }}>
              <TextField
                fullWidth
                placeholder="For other you can type here"
                name="other"
                value={formik.values.other}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                minRows={4}
                multiline
                maxRows={6}
              />
              {formik.touched.other && formik.errors.other && (
                <Typography color="error" fontSize={12}>
                  {formik.errors.other as string}
                </Typography>
              )}
            </div>
        

            <div className="control_group" style={{ marginTop: "15px" }}>
              <TextField
                fullWidth
                hiddenLabel
                placeholder="name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled
              />
              {formik.touched.name && formik.errors.name && (
                <Typography color="error" fontSize={12}>
                  {formik.errors.name as string}
                </Typography>
              )}
            </div>

            <div className="control_group" style={{ marginTop: "15px" }}>
              <TextField
                fullWidth
                hiddenLabel
                placeholder="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled
              />
              {formik.touched.email && formik.errors.email && (
                <Typography color="error" fontSize={12}>
                  {formik.errors.email as string}
                </Typography>
              )}
            </div>

            <div className="form_btn">
              <button className="btn transparent" onClick={handleClose}>
                Cancel
              </button>
              <button type="submit" className=" btn primary">
                Submit
              </button>
            </div>
          </form>
        </div>
      </Box>
    </Modal>
  );
};
