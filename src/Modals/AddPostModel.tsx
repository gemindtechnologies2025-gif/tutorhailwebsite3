import React, { useEffect, useState } from "react";
import { useFormik } from "formik"; // ✅ Added Formik
import Modal from "@mui/material/Modal";
import {
  Autocomplete,
  Box,
  CircularProgress,
  Input,
  ListSubheader,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import { UploadMedia, Uploadpdf, UploadVideo } from "../utils/mediaUpload";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import {
  CONTENT_TYPE,
  POST_TYPE,
  TYPE_SUBJECT_LISTING,
} from "../constants/enums";
import {
  useCreateContentMutation,
  useUpdateContentMutation,
} from "../service/content";
import { showToast, showWarning } from "../constants/toast";
import CancelIcon from "@mui/icons-material/Cancel";
import AdvanceDocumentViewer from "../components/DocViewer";
import { useLazyGetSubjectsAndCategoryQuery } from "../service/auth";
import useAuth from "../hooks/useAuth";
import ImageViewModal from "./ImageViewModal";

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
  type: number;
}

export const AddPostModal = ({
  open,
  handleOpen,
  handleClose,
  data,
  edit,
  type,
}: AddFormProps) => {
  const [createContent] = useCreateContentMutation();
  const user = useAuth();
  const [updateContent] = useUpdateContentMutation();
  const [numPages, setNumPages] = useState<number>(0);
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };
  const [loading,setLoading]=useState<boolean>(false);
  const [openImage, setOpenImage] = useState<boolean>(false);
  const [getSubjects] = useLazyGetSubjectsAndCategoryQuery();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [img, setImg] = useState<string>("");

  const [search, setSearch] = useState("");

  // filter subjects based on search text
  const filteredSubjects = subjects.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );
  // ✅ Initialized Formik
  const formik = useFormik({
    initialValues: {
      title: data?.title || "",
      subject: data?.subjects?.map((s: any) => s._id) || [],
      category: data?.category?._id || "1",
      description: data?.description || "",
      images: data?.images ? data?.images : ([] as string[]),
    },

    onSubmit: async (values) => {
      if (values.images?.length == 0 && values.title.trim() == "") {
        showWarning("Please add something in your post")
        return;
      }
      if (values.subject?.length == 0) {
        showWarning("Please select subject")
        return;
      }
      handleClose();
      const body = {
        visibility: Number(values.category),
        ...(values.title ? { topic: values.title } : {}),
        subjectId: values.subject,
        images: values.images,
        contentType: CONTENT_TYPE.POST,
      };

      try {
        let res;
        if (edit) {
          res = await updateContent({ id: data._id, body: body }).unwrap();
        } else {
          res = await createContent(body).unwrap();
        }
        if (res?.statusCode === 200) {
          showToast("Post added successfully");
          formik.resetForm();
        }
      } catch (error: any) {
        console.log(error);
      } finally {
        handleClose();
      }
    },
  });

  // ✅ Handle image upload and limit to 4 files
  //   const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //     const files = e.target.files;
  //     if (!files) return;

  //     const fileArray = Array.from(files).slice(0, 4); // Max 4
  //     try {
  //       const uploaded = await Promise.all(
  //         fileArray.map((file) => UploadMedia(file))
  //       );
  //       const uploadedUrls = uploaded.map((res) => res.data?.image); // adjust based on UploadMedia response shape
  //       formik.setFieldValue("images", [
  //         ...formik.values.images,
  //         ...uploadedUrls,
  //       ]);
  //     } catch (error) {
  //       console.error("Image upload failed:", error);
  //     }
  //   };


  const fetchSubjects = async () => {
    try {
      const res = await getSubjects({ type: TYPE_SUBJECT_LISTING.SUBJECT }).unwrap();
      if (res?.statusCode == 200) {
        setSubjects(res?.data)
      }
    } catch (error: any) {

    }
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    const currentFiles = formik.values.images || [];

    const imageFiles = newFiles.filter((file) =>
      file.type.startsWith("image/")
    );
    const videoFiles = newFiles.filter((file) =>
      file.type.startsWith("video/")
    );
    const pdfFiles = newFiles.filter((file) => file.type === "application/pdf");

    const uploads: string[] = [];
setLoading(true)
    try {
      // Handle image upload (max 4 images total)
      const imageLimit = 20 - currentFiles.length;
      const limitedImages = imageFiles.slice(0, imageLimit);

      const uploadedImages = await Promise.all(
        limitedImages.map((file) => UploadMedia(file))
      );
      uploads.push(...uploadedImages.map((res) => res.data?.image));

      // Handle single video upload (if no video already uploaded)
      const hasVideo = currentFiles.some(
        (file: any) =>
          file?.includes(".mp4") ||
          file?.includes(".mov") ||
          file?.includes(".avi")
      );
      if (!hasVideo && videoFiles.length > 0) {
        const uploadedVideo = await UploadVideo(videoFiles[0]);
        uploads.push(uploadedVideo.data?.image);
      }

      // Handle single PDF upload (if no PDF already uploaded)
      const hasPdf = currentFiles.some((file: any) => file?.includes(".pdf"));
      if (!hasPdf && pdfFiles.length > 0) {
        const uploadedPdf = await Uploadpdf(pdfFiles[0]);
        uploads.push(uploadedPdf.data?.image);
      }

      formik.setFieldValue("images", [...currentFiles, ...uploads]);
      setLoading(false)

    } catch (error) {
      setLoading(false)

      console.error("Upload failed:", error);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const updatedImages = formik.values.images.filter(
      (_: any, idx: any) => idx !== indexToRemove
    );
    formik.setFieldValue("images", updatedImages);
  };

  useEffect(() => {
    if (!open) {
      formik.resetForm();
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      fetchSubjects()
    }
  }, [open])

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <div className="form_discuss add_post">
          <Typography id="modal-modal-title" variant="h2" component="h2">
            Add Post
          </Typography>
          <div className="add_post_drop">
            <figure>
              <img src={user?.image || "/static/images/user_add.png"} alt="image" />
            </figure>

            <div className="control_group" >
              <Select
                name="category"
                value={formik.values.category}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                fullWidth
                displayEmpty
              >
                <MenuItem value="1">Anyone</MenuItem>
                <MenuItem value="2">Followers</MenuItem>
              </Select>
            </div>
          </div>



          <form
            className="form"
            onSubmit={formik.handleSubmit}
            style={{ marginTop: "20px" }}
          >
            <div className="control_group" style={{ marginTop: "15px" }}>
              <label>Subjects: Add subjects to categorise your post</label>
              <Autocomplete
                multiple
                options={subjects}
                getOptionLabel={(option) => option.name}
                value={
                  subjects.filter((s) =>
                    formik.values.subject.includes(s._id)
                  ) || []
                }
                onChange={(_, newValue) => {
                  formik.setFieldValue(
                    "subject",
                    newValue.map((v) => v._id) // sirf ids store karni hai
                  );
                }}
                
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Select Subject"
                    onBlur={formik.handleBlur}
                    error={formik.touched.subject && Boolean(formik.errors.subject)}
                    helperText={
                      formik.touched.subject && formik.errors.subject
                        ? (formik.errors.subject as string)
                        : ""
                    }
                  />
                )}
                fullWidth
                disabled={!formik.values.category}
              />
            </div>
            <div className="control_group" style={{ marginTop: "15px" }}>
              <TextField
                fullWidth
                multiline
                minRows={6}
                maxRows={6}
                placeholder="Share your thoughts..."
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />

              {formik.touched.title && formik.errors.title && (
                <Typography color="error" fontSize={12}>
                  {formik.errors.title as string}
                </Typography>
              )}
            </div>

            <div className="ovr_flow">
              {formik.values.images &&
                formik.values.images.map((img: any, index: number) => (
                  <div className="upload_file">
                    {type === POST_TYPE.VIDEO ? (
                      <figure className="after_upload">
                        <video
                          src={img || `Not available`}
                          controls={true}
                          autoPlay={false}
                        />
                        <figcaption
                          onClick={() => handleRemoveImage(index)}
                          style={{ cursor: "pointer" }}
                        >
                          <CancelIcon />
                        </figcaption>
                      </figure>
                    ) : type === POST_TYPE.DOCUMENT ? (


                      <figure className="after_upload">
                        <iframe
                          src={`https://docs.google.com/gview?url=${encodeURIComponent(
                            img
                          )}&embedded=true`}
                          style={{
                            width: "100%",
                            height: "200px",
                            border: "1px solid #e0e0e0",
                            borderRadius: "4px",
                          }}


                          title={'PDF Document'}
                        />
                        <figcaption
                          onClick={() => handleRemoveImage(index)}
                          style={{ cursor: "pointer" }}
                        >
                          <CancelIcon />
                        </figcaption>
                      </figure>


                    ) : (
                      <figure className="after_upload" key={index}>
                        <img
                          onClick={() => {
                            setImg(img);
                            setOpenImage(true);
                          }}
                          src={img || `/static/images/emili.png`}
                          alt="emili"
                        />
                        <figcaption
                          onClick={() => handleRemoveImage(index)}
                          style={{ cursor: "pointer" }}
                        >
                          <CancelIcon />
                        </figcaption>
                      </figure>
                    )}
                  </div>
                ))}
            </div>
            {((type === POST_TYPE.IMAGE && formik.values.images.length < 20) ||
              ((type === POST_TYPE.VIDEO ||
                type === POST_TYPE.DOCUMENT ||
                type === POST_TYPE.POLL) &&
                formik.values.images.length === 0)) && (
                <div className="upload_file">
                  <input
                    type="file"
                    multiple
                    accept={
                      type === POST_TYPE.VIDEO
                        ? "video/*"
                        : type === POST_TYPE.DOCUMENT
                          ? "application/pdf"
                          : "image/*"
                    }
                    onChange={handleImageChange}
                  />
                  {loading ?<CircularProgress size={20}/>: <DriveFolderUploadIcon />}
                 
                  <p>Upload</p>


                  {formik.errors.images &&
                    typeof formik.errors.images === "string" && (
                      <Typography color="error" fontSize={12}>
                        {formik.errors.images}
                      </Typography>
                    )}
                </div>
              )}


            <div className="form_btn">
              <button style={formik.values.title.trim() == "" ? { backgroundColor: 'lightgray', color: 'black' } : {}} disabled={formik.values.title.trim() == ""} type="submit" className=" btn primary">
                {edit ? "Save" : "Post"}
              </button>
            </div>
          </form>
        </div>
        <ImageViewModal
          open={openImage}
          onClose={() => setOpenImage(false)}
          setOpen={setOpenImage}
          image={img}
        />
      </Box>
    </Modal>
  );
};
