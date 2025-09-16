import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Modal from "@mui/material/Modal";
import {
  Box,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Input,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import { UploadMedia, Uploadpdf, UploadVideo } from "../utils/mediaUpload";
import {
  CONTENT_TYPE,
  TYPE_SUBJECT_LISTING,
  POST_TYPE,
} from "../constants/enums";
import {
  useCreateContentMutation,
  useUpdateContentMutation,
} from "../service/content";
import { showError, showToast, showWarning } from "../constants/toast";
import CancelIcon from "@mui/icons-material/Cancel";
import { useLazyGetSubjectsAndCategoryQuery } from "../service/auth";
import EditText from "../components/EditText";
import { isValidInput } from "../utils/validations";

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
  data?: any;
  edit?: boolean;
}

// ✅ Yup validation schema added
const validationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  subject: Yup.array()
    .of(Yup.string())
    .min(1, "At least one subject is required")
    .required("At least one subject is required"),
  description: Yup.string().required("Description is required"),
  category: Yup.string().required("Category is required"),
});

export const AddFormAndDisscussion = ({
  open,
  handleOpen,
  handleClose,
  data,
  edit,
}: AddFormProps) => {
  const [createContent] = useCreateContentMutation();
  const [updateContent] = useUpdateContentMutation();
  const [getSubjects] = useLazyGetSubjectsAndCategoryQuery();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [category, setCategory] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const formik = useFormik({
    initialValues: {
      title: data?.title || "",
      subject: data?.subjects?.map((s: any) => s._id) || [],
      category: data?.category?._id || "",
      description: data?.description || "",
      media: data?.media ? data?.media : ([] as string[]),
      isAnonymous:data?.isAnonymous || false
    },
    validationSchema,
    onSubmit: async (values) => {
      // Check if media is uploaded
      if (values.media?.length === 0) {
        showWarning("Please add media to your forum post");
        return;
      }

      handleClose();
      const body = {
        subjectId: values.subject,
        categoryId: values.category,
        title: values.title,
        description: values.description,
        images: values.media,
        contentType: CONTENT_TYPE.FORUM,
        isAnonymous: values.isAnonymous,
      };

      try {
        let res;
        if (edit) {
          res = await updateContent({ id: data._id, body: body }).unwrap();
        } else {
          res = await createContent(body).unwrap();
        }
        if (res?.statusCode === 200) {
          showToast("Forum added successfully");
          formik.resetForm();
        }
      } catch (error: any) {
        console.log(error);
        showError(error?.data?.message);
      }
    },
  });

  const fetchCategory = async () => {
    try {
      const res = await getSubjects({
        type: TYPE_SUBJECT_LISTING.CATEGORY,
      }).unwrap();
      if (res?.statusCode == 200) {
        setCategory(res?.data);
      }
    } catch (error: any) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await getSubjects({
        type: TYPE_SUBJECT_LISTING.SUBJECT,
        categoryId: formik.values.category,
      }).unwrap();
      if (res?.statusCode == 200) {
        setSubjects(res?.data);
      }
    } catch (error: any) {
      console.error("Error fetching subjects:", error);
    }
  };

  // Check if user has uploaded a video
  const hasVideo = () => {
    return formik.values.media.some(
      (file: any) =>
        file?.includes(".mp4") ||
        file?.includes(".mov") ||
        file?.includes(".avi")
    );
  };

  // Check if user has uploaded a document
  const hasDocument = () => {
    return formik.values.media.some((file: any) => file?.includes(".pdf"));
  };

  // Check if user has uploaded any images
  const hasImages = () => {
    return formik.values.media.some(
      (file: any) =>
        file?.includes(".jpg") ||
        file?.includes(".jpeg") ||
        file?.includes(".png") ||
        file?.includes(".gif")
    );
  };

  // Check if user can upload more images (max 4)
  const canUploadMoreImages = () => {
    const imageCount = formik.values.media.filter(
      (file: any) =>
        file?.includes(".jpg") ||
        file?.includes(".jpeg") ||
        file?.includes(".png") ||
        file?.includes(".gif")
    ).length;
    return imageCount < 20;
  };

  // Check if upload section should be shown
  const shouldShowUpload = () => {
    // If user has a video or document, they can't upload anything else
    if (hasVideo() || hasDocument()) {
      return false;
    }

    // If user has images, check if they can upload more
    if (hasImages()) {
      return canUploadMoreImages();
    }

    // If no media yet, show upload section
    return true;
  };

  // Get the accepted file types based on current selection
  const getAcceptedFileTypes = () => {
    if (hasVideo() || hasDocument()) {
      return ""; // No more uploads allowed
    }

    if (hasImages()) {
      return "image/*"; // Only images allowed if images already exist
    }

    return "image/*, video/*, application/pdf"; // All types allowed if no media yet
  };

  // ✅ Handle media upload for images, videos, and PDFs
  const handleMediaChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    const currentFiles = formik.values.media || [];

    const imageFiles = newFiles.filter((file) =>
      file.type.startsWith("image/")
    );
    const videoFiles = newFiles.filter((file) =>
      file.type.startsWith("video/")
    );
    const pdfFiles = newFiles.filter((file) => file.type === "application/pdf");

    const uploads: string[] = [];

    try {
      setLoading(false);
      // If user already has a video or document, don't allow more uploads
      if (hasVideo() || hasDocument()) {
        showWarning("You can only upload one video or document");
        return;
      }

      // If user already has images, only allow more images (not videos or documents)
      if (hasImages() && (videoFiles.length > 0 || pdfFiles.length > 0)) {
        showWarning(
          "You can only upload images when you've already added images"
        );
        return;
      }

      // Handle video upload (only one allowed, and no existing images)
      if (videoFiles.length > 0 && !hasVideo() && !hasImages()) {
        const uploadedVideo = await UploadVideo(videoFiles[0]);
        uploads.push(uploadedVideo.data?.image);
        formik.setFieldValue("media", [...currentFiles, ...uploads]);
        return;
      }

      // Handle PDF upload (only one allowed, and no existing images)
      if (pdfFiles.length > 0 && !hasDocument() && !hasImages()) {
        const uploadedPdf = await Uploadpdf(pdfFiles[0]);
        uploads.push(uploadedPdf.data?.image);
        formik.setFieldValue("media", [...currentFiles, ...uploads]);
        return;
      }

      // Handle image upload (max 4 images total, and no existing video/document)
      if (
        imageFiles.length > 0 &&
        canUploadMoreImages() &&
        !hasVideo() &&
        !hasDocument()
      ) {
        const imageLimit =
          20 -
          currentFiles.filter(
            (file: any) =>
              file?.includes(".jpg") ||
              file?.includes(".jpeg") ||
              file?.includes(".png") ||
              file?.includes(".gif")
          ).length;

        const limitedImages = imageFiles.slice(0, imageLimit);

        const uploadedImages = await Promise.all(
          limitedImages.map((file) => UploadMedia(file))
        );
        uploads.push(...uploadedImages.map((res) => res.data?.image));
        formik.setFieldValue("media", [...currentFiles, ...uploads]);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Upload failed:", error);
    }
  };

  const handleRemoveMedia = (indexToRemove: number) => {
    const updatedMedia = formik.values.media.filter(
      (_: any, idx: any) => idx !== indexToRemove
    );
    formik.setFieldValue("media", updatedMedia);
  };

  const detectFileType = (fileUrl: string): POST_TYPE => {
    if (
      fileUrl.includes(".mp4") ||
      fileUrl.includes(".mov") ||
      fileUrl.includes(".avi")
    ) {
      return POST_TYPE.VIDEO;
    } else if (fileUrl.includes(".pdf")) {
      return POST_TYPE.DOCUMENT;
    } else {
      return POST_TYPE.IMAGE;
    }
  };

   const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value, checked } = event.target;
  
      if (checked) {
        formik.setFieldValue("isAnonymous", true);
      } else {
        formik.setFieldValue("isAnonymous", false);
      }
    };

  useEffect(() => {
    fetchCategory();
  }, []);

  useEffect(() => {
    if (formik.values.category) {
      fetchSubjects();
    }
  }, [formik.values.category]);

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
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <div className="form_discuss add_post">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Forum & Discussion
          </Typography>

          <form
            className="form"
            onSubmit={formik.handleSubmit}
            style={{ marginTop: "20px" }}
          >
            <div className="ovr_flow">
              {formik.values.media &&
                formik.values.media.map((media: any, index: number) => {
                  const type = detectFileType(media);
                  return (
                    <div className="upload_file" key={index}>
                      {type === POST_TYPE.VIDEO ? (
                        <figure className="after_upload">
                          <video src={media} controls={true} autoPlay={false} />
                          <figcaption
                            onClick={() => handleRemoveMedia(index)}
                            style={{ cursor: "pointer" }}
                          >
                            <CancelIcon />
                          </figcaption>
                        </figure>
                      ) : type === POST_TYPE.DOCUMENT ? (
                        <figure className="after_upload">
                          <iframe
                            src={`https://docs.google.com/gview?url=${encodeURIComponent(
                              media
                            )}&embedded=true`}
                            style={{
                              width: "100%",
                              height: "200px",
                              border: "1px solid #e0e0e0",
                              borderRadius: "4px",
                            }}
                            title={"PDF Document"}
                          />
                          <figcaption
                            onClick={() => handleRemoveMedia(index)}
                            style={{ cursor: "pointer" }}
                          >
                            <CancelIcon />
                          </figcaption>
                        </figure>
                      ) : (
                        <figure className="after_upload">
                          <img
                            src={media || `/static/images/emili.png`}
                            alt="media"
                            style={{ maxWidth: "100px", maxHeight: "100px" }}
                          />
                          <figcaption
                            onClick={() => handleRemoveMedia(index)}
                            style={{ cursor: "pointer" }}
                          >
                            <CancelIcon />
                          </figcaption>
                        </figure>
                      )}
                    </div>
                  );
                })}
            </div>

            {/* File input for all media types - only show if allowed */}
            {shouldShowUpload() && (
              <div className="upload_file">
                <input
                  type="file"
                  multiple
                  accept={getAcceptedFileTypes()}
                  onChange={handleMediaChange}
                />
                {!loading ? (
                  <DriveFolderUploadIcon />
                ) : (
                  <CircularProgress size={20} />
                )}

                <p>Upload Media</p>
                <Typography variant="caption" display="block" gutterBottom>
                  {hasVideo() || hasDocument()
                    ? "You can only upload one video or document"
                    : hasImages()
                      ? `You can upload up to ${
                          20 -
                          formik.values.media.filter(
                            (file: any) =>
                              file?.includes(".jpg") ||
                              file?.includes(".jpeg") ||
                              file?.includes(".png") ||
                              file?.includes(".gif")
                          ).length
                        } more images`
                      : "You can upload images (up to 20), a video, or a document"}
                </Typography>
              </div>
            )}

            {/* Title input */}
            <div className="control_group" style={{ marginTop: "15px" }}>
              <label>Enter Title</label>
              <Input
                fullWidth
                placeholder="Enter title"
                name="title"
                value={formik.values.title}
                onChange={(e) => {
                  if (isValidInput(e.target.value)) formik.handleChange(e);
                }}
                onBlur={formik.handleBlur}
              />
              {formik.touched.title && formik.errors.title && (
                <Typography color="error" fontSize={12}>
                  {formik.errors.title as string}
                </Typography>
              )}
            </div>

            {/* Category select */}
            <div className="control_group" style={{ marginTop: "15px" }}>
              <label>Select Category</label>
              <Select
                name="category"
                value={formik.values.category}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                fullWidth
                displayEmpty
              >
                <MenuItem value="" disabled>
                  Select category
                </MenuItem>
                {category?.map((item) => {
                  return (
                    <MenuItem value={item?._id}>{item?.name || "-"}</MenuItem>
                  );
                })}
              </Select>
              {formik.touched.category && formik.errors.category && (
                <Typography color="error" fontSize={12}>
                  {formik.errors.category as string}
                </Typography>
              )}
            </div>

            {/* Subject select */}
            <div className="control_group" style={{ marginTop: "15px" }}>
              <label>Select Subjects</label>
              <Select
                name="subject"
                multiple
                value={formik.values.subject}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                fullWidth
                disabled={!formik.values.category}
                displayEmpty
                renderValue={(selected: any) =>
                  subjects
                    .filter((s) => selected.includes(s._id))
                    .map((s) => s.name)
                    .join(", ") || "Select Subject"
                }
              >
                {subjects?.map((item) => (
                  <MenuItem key={item?._id} value={item?._id}>
                    {item?.name || "-"}
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.subject && formik.errors.subject && (
                <Typography color="error" fontSize={12}>
                  {formik.errors.subject as string}
                </Typography>
              )}
            </div>

            {/* Description editor */}
            <div className="control_group" style={{ marginTop: "15px" }}>
              <label>Enter description</label>
              {formik.values.description || !edit ? (
                <EditText
                  content={formik.values.description}
                  setContent={(value) =>
                    formik.setFieldValue("description", value)
                  }
                />
              ) : null}

              {formik.touched.description && formik.errors.description && (
                <Typography color="error" fontSize={12}>
                  {formik.errors.description as string}
                </Typography>
              )}
            </div>

            <div className="control_group">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formik?.values?.isAnonymous}
                    onChange={handleCheckboxChange}
                    name="classType"
                  />
                }
                label="Is Anonymous"
              />
            </div>

            <div className="form_btn">
              <button
                type="button"
                className="btn transparent"
                onClick={handleClose}
              >
                Cancel
              </button>
              <button type="submit" className=" btn primary">
                {edit ? "Save" : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </Box>
    </Modal>
  );
};
