import {
  Button,
  Checkbox,
  CircularProgress,
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
import { useGetClassListQuery } from "../service/tutorApi";
import {
  CLASS_SETTING,
  Class_Variables,
  CONTENT_TYPE,
  GRADE_TYPE_NAME,
  TYPE_SUBJECT_LISTING,
} from "../constants/enums";
import { useLazyGetSubjectsAndCategoryQuery } from "../service/auth";
import CancelIcon from "@mui/icons-material/Cancel";
import { UploadVideo } from "../utils/mediaUpload";
import {
  useCreateContentMutation,
  useUpdateContentMutation,
} from "../service/content";
import EditText from "./EditText";
import { useLocation } from "react-router-dom";

const AddVideoRgt = () => {
  const [createContent] = useCreateContentMutation();
  const { data: classList } = useGetClassListQuery({ type: 2 });
  const user = useAuth();
  const location = useLocation();
  const { state } = location;
  const [loading,setLoading]=useState<boolean>(false);
  const [updateContent] = useUpdateContentMutation();
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
    
    setLoading(true)
    try {
      const res = await UploadVideo(file); // assuming this uploads and returns { data: { image: string } }
      const uploadedUrl = res.data?.image;

      if (uploadedUrl) {
        formik.setFieldValue("video", uploadedUrl);
      }
      setLoading(false)
    } catch (error) {
      console.error("Video upload failed:", error);
      setLoading(false)
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
    video: Yup.string().when("setting", {
      is: "2",
      then: (schema) => schema.required("Video is required"),
      otherwise: (schema) => schema.required("Video is required"),
    }),

    title: Yup.string().when("setting", {
      is: "2",
      then: (schema) => schema.required("Title is required"),
      otherwise: (schema) => schema.required("Title is required"),
    }),

    description: Yup.string().when("setting", {
      is: "2",
      then: (schema) => schema.notRequired(),
      otherwise: (schema) => schema.required("Description is required"),
    }),

    category: Yup.string().when("setting", {
      is: "2",
      then: (schema) => schema.notRequired(),
      otherwise: (schema) => schema.required("Category is required"),
    }),

    subject: Yup.string().when("setting", {
      is: "2",
      then: (schema) => schema.notRequired(),
      otherwise: (schema) => schema.required("Subject is required"),
    }),

    topic: Yup.string().when("setting", {
      is: "2",
      then: (schema) => schema.notRequired(),
      otherwise: (schema) => schema.required("Topic is required"),
    }),

    grade: Yup.string().when("setting", {
      is: "2",
      then: (schema) => schema.notRequired(),
      otherwise: (schema) => schema.required("Grade is required"),
    }),
  });

  const formik = useFormik({
    initialValues: {
      video: state?.edit ? state?.data?.images?.[0] : "",
      title: state?.edit ? state?.data?.title : "",
      category:
        state?.edit && state?.data?.category?._id
          ? state?.data?.category?._id
          : "",
      subject:
        state?.edit && state?.data?.subjects?._id
          ? state?.data?.subjects?._id
          : "",
      topic: state?.edit && state?.data?.topic ? state?.data?.topic : "",
      grade: state?.edit && state?.data?.gradeId ? state?.data?.gradeId : "",
      description:
        state?.edit && state?.data?.description ? state?.data?.description : "",
      allowComment: state?.edit ? state?.data?.allowComments : true,
      setting: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const body = {
        title: values.title || "",
        images: values.video ? [values.video] : [],
        ...(values.subject ? { subjectId: [values.subject] } : {}),
        ...(values.description ? { description: values.description } : {}),
        ...(values.topic ? { topic: values.topic } : {}),
        contentType: CONTENT_TYPE.TEASER_VIDEO,
        allowComments: values.allowComment,
        ...(values.grade ? { gradeId: values.grade } : {}),
        ...(values.setting ? { setting: values.setting } : {}),
        ...(values.category ? { categoryId: values.category } : {}),
      };
      console.log(body, "body");

      try {
        let res;
        if (state?.edit) {
          res = await updateContent({
            id: state?.data?._id,
            body: body,
          }).unwrap();
        } else {
          res = await createContent(body).unwrap();
        }
        if (res?.statusCode === 200) {
          if (
            formik.values.setting == String(CLASS_SETTING.DRAFT) &&
            !state?.edit
          ) {
            showToast("Teaser video saved in Draft successfully");
          } else if (state?.edit) {
            showToast("Teaser video updated successfully");
          } else {
            showToast("Teaser video added successfully");
          }
          formik.resetForm({
            values: {
              video: "",
              title: "",
              category: "",
              subject: "",
              description: "",
              allowComment: true,
              topic: "",
              grade: "",
              setting: "",
            },
          });
        }
      } catch (error: any) {
        console.log(error);
      }
    },
  });

  console.log(formik.values.setting, "setting");

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

        {formik.values.video ? (
          <div className="ovr_flow">
            <div className="upload_file">
              <figure>
                <video
                  controls
                  src={formik.values.video || `/static/images/emili.png`}
                />

                <figcaption
                  onClick={() => formik.setFieldValue("video", "")}
                  className="cross_icon"
                >
                  <CancelIcon />
                </figcaption>
              </figure>
            </div>
          </div>
        ) : (
          <div className="upload_file">
            <input type="file" accept="video/*" onChange={handleVideoChange} />
            {loading ? (
              <CircularProgress size={15}/>
            ):(
               <figure>

               <img src={`/static/images/uploadfile.svg`} alt="svg" />
             </figure>
            )}
           

            <p>{ loading ? "Uploading Video" :"Upload Video"}</p>
            {formik.errors.video && typeof formik.errors.video === "string" && (
              <Typography color="error" fontSize={12}>
                { loading ? null: formik.errors.video}
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
            <label id="demo-select-small-label">Category</label>
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
            <label> Topic</label>
            <TextField
              id="outlined-basic"
              placeholder="Enter Video Topic"
              variant="outlined"
              name="topic"
              value={formik.values.topic}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.topic && formik.errors.topic && (
              <Typography color="error" fontSize={12}>
                {formik.errors.topic as string}
              </Typography>
            )}
          </div>

          <div className="control_group" style={{ marginTop: "15px" }}>
            <label>Grade</label>
            <Select
              name="grade"
              value={formik.values.grade}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              fullWidth
              displayEmpty
            >
              <MenuItem value="" disabled>
                Select grade
              </MenuItem>
              {classList?.data?.[0]?.classes?.map((item: any) => {
                return (
                  <MenuItem value={item}>
                    {GRADE_TYPE_NAME[Number(item)]}
                  </MenuItem>
                );
              })}
            </Select>
            {formik.touched.grade && formik.errors.grade && (
              <Typography color="error" fontSize={12}>
                {formik.errors.grade as string}
              </Typography>
            )}
          </div>

          <div className="control_group">
            <label> Description</label>
            {/* <TextField id="outlined-basic" placeholder="Enter Video Description" multiline minRows={4} variant="outlined"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            /> */}
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
            <label>Video Settings</label>

            <div className="sp_form">
              <p>Allow Comments</p>
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
              {state?.edit ? null : (
                <button
                  onClick={() =>
                    formik.setFieldValue("setting", String(CLASS_SETTING.DRAFT))
                  }
                  type="submit"
                  className="btn transparent"
                >
                  Save as Draft
                </button>
              )}

              <button
                onClick={() =>
                  formik.setFieldValue("setting", String(CLASS_SETTING.PUBLISH))
                }
                type="submit"
                className="btn primary"
              >
                {state?.edit ? "Save" : "Publish Video"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddVideoRgt;
