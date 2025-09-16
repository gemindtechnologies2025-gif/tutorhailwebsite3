import {
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { useState } from "react";
import { useFormik } from "formik"; // ✅ Added Formik
import * as Yup from "yup"; // ✅ Added Yup
import { showToast } from "../constants/toast";
import useAuth from "../hooks/useAuth";
import { CONTENT_TYPE, TYPE_SUBJECT_LISTING } from "../constants/enums";
import { useLazyGetSubjectsAndCategoryQuery } from "../service/auth";
import CancelIcon from "@mui/icons-material/Cancel";
import { UploadVideo } from "../utils/mediaUpload";
import {
  useCreateContentMutation,
  useUpdateContentMutation,
} from "../service/content";
import EditText from "./EditText";

const AddShortVideo = ({ edit, data }: any) => {
  const [createContent] = useCreateContentMutation();
  const [updateContent] = useUpdateContentMutation();
  const user = useAuth();
  const [getSubjects] = useLazyGetSubjectsAndCategoryQuery();
  const [category, setCategory] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);

 

  const fetchCategory = async () => {
    try {
      const res = await getSubjects({
        type: TYPE_SUBJECT_LISTING.CATEGORY,
      }).unwrap();
      if (res?.statusCode == 200) {
        setCategory(res?.data);
      }
    } catch (error: any) {}
  };

  const handleVideoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const res = await UploadVideo(file); // assuming this uploads and returns { data: { image: string } }
      const uploadedUrl = res.data?.image;

      if (uploadedUrl) {
        formik.setFieldValue("video", uploadedUrl);
      }
    } catch (error) {
      console.error("Video upload failed:", error);
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
    } catch (error: any) {}
  };

  const validationSchema = Yup.object({
    video: Yup.string().required("Video is required"),
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    category: Yup.string().required("Category is required"),
    subject: Yup.string().required("Subject is required"),
  });

  const formik = useFormik({
    initialValues: {
      video: edit ? data?.images?.[0] : "",
      title: edit ? data?.title : "",
      category: edit ? data?.category?._id : "",
      subject: edit ? data?.subjects?._id : "",
      description: edit ? data?.description : "",
      allowComment: edit ? data?.allowComments : true,
    },
    validationSchema,
    onSubmit: async (values) => {
      const body = {
        subjectId: [values.subject] ,
        title: values.title || "",
        categoryId: values.category || "",
        description: values.description || "",
        images: values.video ? [values.video] : [],
        allowComments: values.allowComment,
        contentType: CONTENT_TYPE.SHORT_VIDEO,
      };

      try {
        let res;
        if (data) {
          res = await updateContent({ id: data?._id, body: body }).unwrap();
        } else {
          res = await createContent(body).unwrap();
        }
        if (res?.statusCode === 200) {
          formik.resetForm({
            values: {
              video: "",
              title: "",
              category: "",
              subject: "",
              description: "",
              allowComment: true,
            },
          });
          if (data) {
            showToast("Short video updated successfully");
          } else {
            showToast("Short video added successfully");
          }
        }
      } catch (error: any) {
        console.log(error);
      }
    },
  });

  useEffect(() => {
    if (!data) {
      formik.resetForm();
    }
  }, []);

  useEffect(() => {
    fetchCategory();
  }, []);

  useEffect(() => {
    if (formik.values.category) {
      fetchSubjects();
    }
  }, [formik.values.category]);
  return (
    <>
      <div className="card_mn addvideo_upload">
        <div className="title_sb">
          <h2>Add Videos</h2>
        </div>
        <div className="profile_title">
          <figure>
            <img src={user?.image || `/static/images/elisha.png`} alt="" />
          </figure>
          <h5>{user?.name || ""}</h5>
        </div>

        {/* <div className="upload_file">
          <input type="file" />
          <figure >
            <img src={`/static/images/uploadfile.svg`} alt="svg" />
          </figure>
          <p>File Upto 50MB</p>
        </div> */}

        {/* <div className="title_hd">
          <h6>  Drag and drop to upload</h6>
        </div> */}

        {/* <button className="btn primary">Upload</button> */}

        {formik?.values?.video ? (
          <div className="ovr_flow">
            <div className="upload_file">
              <figure>
                <video
                  controls
                  src={formik.values.video || `/static/images/emili.png`}
                />
                <figcaption
                  onClick={() => formik.setFieldValue("teaserVideo", "")}
                  style={{ cursor: "pointer" }}
                >
                  <CancelIcon />
                </figcaption>
                <figcaption className="cross_icon">
                  <CancelIcon />
                </figcaption>
              </figure>
            </div>
          </div>
        ) : (
          <div className="upload_file">
            <input type="file" accept="video/*" onChange={handleVideoChange} />
            <figure>
              <img src={`/static/images/uploadfile.svg`} alt="svg" />
            </figure>

            <p>Upload Video</p>

            {formik.errors.video && typeof formik.errors.video === "string" && (
              <Typography color="error" fontSize={12}>
                {formik.errors.video}
              </Typography>
            )}
          </div>
        )}

        <form className="form_group" onSubmit={formik.handleSubmit}>
          <div className="control_group">
            <label>Video title</label>
            <TextField
              id="outlined-basic"
              placeholder="Video title"
              variant="outlined"
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

          <div className="control_group">
            <InputLabel id="demo-select-small-label">Category</InputLabel>
            <Select
              labelId="demo-select-small-label"
              id="demo-select-small"
              value={formik.values.category}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              name="category"
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

          <div className="control_group" style={{ marginTop: "15px" }}>
            <label>Subject</label>
            <Select
              name="subject"
              value={formik.values.subject}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              fullWidth
              disabled={!formik.values.category}
              displayEmpty
            >
              <MenuItem value="" disabled>
                Select Subject
              </MenuItem>
              {subjects?.map((item) => {
                return (
                  <MenuItem value={item?._id}>{item?.name || "-"}</MenuItem>
                );
              })}
            </Select>
            {formik.touched.subject && formik.errors.subject && (
              <Typography color="error" fontSize={12}>
                {formik.errors.subject as string}
              </Typography>
            )}
          </div>
          <div className="control_group">
            <label> Description</label>
            <EditText
              content={formik.values.description}
              setContent={(value) => formik.setFieldValue("description", value)}
            />
            {formik.touched.description && formik.errors.description && (
              <Typography color="error" fontSize={12}>
                {formik.errors.description as string}
              </Typography>
            )}
          </div>

          <div className="btm_details">
            <p>Allow Comments</p>
            <div className="sp_form">
              <p>Allow comments</p>
              <div className="control_group">
                <Checkbox
                  name="allowComment"
                  checked={formik.values.allowComment}
                  onClick={formik.handleChange}
                />
              </div>
            </div>
            <div className="sp_form">
              <p>Video Visibility</p>
              <strong>Everyone</strong>
            </div>
            <div className="btn_grp">
            <button  style={{ width: '100%' }} type="submit" className="btn primary">
              Publish Video
            </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddShortVideo;
