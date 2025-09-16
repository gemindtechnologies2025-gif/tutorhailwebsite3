/* eslint-disable jsx-a11y/anchor-is-valid */
import { Button, Checkbox, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import EditIcon from '@mui/icons-material/Edit';
import { useEffect, useState } from "react";
import {
  useLazyGetDocsQuery,
  usePostDocsMutation,
} from "../../../../service/tutorProfileSetup";
import dayjs, { Dayjs } from "dayjs";
import { isString } from "../../../../utils/validations";
import { useFormik } from "formik";
import * as Yup from "yup";
import moment from "moment";
import CloseIcon from "@mui/icons-material/Close";
import { showError, showToast, showWarning } from "../../../../constants/toast";
import { UploadMedia, Uploadpdf } from "../../../../utils/mediaUpload";
import Loader from "../../../../constants/Loader";
import EditText from "../../../../components/EditText";

type obj = {
  frontImage: string;
  description: string;
  documentName: number;
  documentType: number;
  startDate: string;
  endDate: string;
  _id?: string;
}

const TutorExperienceEdit = () => {
  const navigate = useNavigate();
  const [profilePicture, setProfilePicture] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [updateProfile] = usePostDocsMutation();
  const [getDocs] = useLazyGetDocsQuery();
  const [image, setImage] = useState<string>("");
  const [id, setId] = useState<any>(null);
  const [ongoing, setOngoing] = useState<boolean>(false)

  const fetchDocs = async () => {
    try {
      const res = await getDocs({ documentType: 2 }).unwrap();
      if (res?.statusCode === 200) {
        setProfilePicture(res?.data?.document);
      }
    } catch (error: any) {
      showError(error?.data?.message);
      //      console.log(error, "error in fetchdocs");
    }
  };

  const addInArray = async () => {

    if (formik.values.description?.length < 10 || formik.values.startDate === "" || (formik.values.endDate === "" && !ongoing)) {
      showWarning("Please fill all the details");
      return;
    }
    let arr;
    if (id) {
      arr = [
        {
          _id: id,
          frontImage: image,
          description: formik.values.description,
          documentName: 1,
          documentType: 2,
          ongoing: ongoing,
          startDate: moment(formik.values.startDate)
            .utc()
            .format("YYYY-MM-DDTHH:mm:ss[Z]"),
          endDate: formik.values.endDate ? moment(formik.values.endDate)
            .utc()
            .format("YYYY-MM-DDTHH:mm:ss[Z]") : "",

        }
      ]
    } else {
      arr = [
        {
          frontImage: image,
          description: formik.values.description,
          documentName: 1,
          ongoing: ongoing,
          documentType: 2,
          startDate: moment(formik.values.startDate)
            .utc()
            .format("YYYY-MM-DDTHH:mm:ss[Z]"),
          endDate: formik.values.endDate ? moment(formik.values.endDate)
            .utc()
            .format("YYYY-MM-DDTHH:mm:ss[Z]") : "",

        }
      ]
    }

    setProfilePicture([...profilePicture, ...arr]);

    //empty form

    setImage("")
    formik.setFieldValue('startDate', "")
    formik.setFieldValue('endDate', "")
    formik.setFieldValue('description', "")
    setOngoing(false)
    setId(null)

  }

  const handleEdit = async (item: obj, indexToRemove: number) => {

    setImage(item?.frontImage)
    formik.setFieldValue('startDate', item?.startDate)
    formik.setFieldValue('endDate', item?.endDate)
    formik.setFieldValue('description', item?.description)

    setProfilePicture((prev: any) => prev.filter((_: any, index: number) => index !== indexToRemove));
  }

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      frontImage: "",
      description: "",
      documentName: 1,
      documentType: 2,
      startDate: "",
      endDate: "",
    },


    onSubmit: async (values) => {
      formik.setSubmitting(true);

      if (profilePicture?.length === 0) {
        showWarning("Please upload documents");
        return;
      }


      let body = {
        documents: profilePicture
      }
      //      console.log("body for exp", body);

      try {
        setIsLoading(true);
        const response = await updateProfile(body).unwrap();
        if (response?.statusCode === 200) {
          showToast("Experience details updated successfully");
          navigate('/tutor/profile')
        }
        setIsLoading(false);
      } catch (errors: any) {
        //        console.log(errors, "errrr");
        setIsLoading(false);
        showError(errors?.data?.message);
      }
    },
  });

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => {
    const files = event.target.files;
    if (!files) return;

    try {
      setIsLoading(true);

      const fileArray = Array.from(files); // Convert FileList to an array

      for (const file of fileArray) {
        let res: {
          statusCode: number;
          data: { image: string };
          message?: string;
        }; // Explicitly type 'res'

        if (file.type === "application/pdf") {
          res = await Uploadpdf(file);
        } else {
          res = await UploadMedia(file);
        }

        if (res?.statusCode === 200) {
          if (type === "profile_picture") {
            setImage(res?.data?.image)
          }
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

  const handleRemoveImage = (indexToRemove: number) => {
    setProfilePicture((prev: any) =>
      prev.filter((_: any, index: number) => index !== indexToRemove)
    );
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  return (
    <>
      <main className="content editTutor">
        <Loader isLoad={isLoading} />
        {/* <header className="inner_header">
          <div className="conta_iner">
            <a
              onClick={() => navigate("/tutor/dashboard")}
              className="site_logo"
            >
              <figure>
                <img src={`/static/images/logo.png`} alt="logo" />
              </figure>
            </a>
          </div>
        </header> */}
        <section className="tutor_setup">
          <div className="conta_iner">
            {/* <TutorStepsAside active={active} name="exp" /> */}
            <div className="rt_s">
              <h2>
                <button
                  className="back_arrow"
                  onClick={() => navigate('/tutor/profile')}
                >
                  <img src={`/static/images/back.png`} alt="img" />
                </button>
                <strong>Edit Experience details</strong>
              </h2>
              <form onSubmit={formik.handleSubmit} className="form">
                <div className="gap_p">
                  <div className="control_group w_100" >
                    <h4>Enter Organisation name</h4>
                      <EditText
                        content={formik.values.description}
                        setContent={(value) => formik.setFieldValue("description", value)}
                      />

                    {/* <TextField
                      hiddenLabel
                      fullWidth
                      className="text_fields"
                      name="description"
                      placeholder="Enter Institution Name"
                      value={formik.values.description}
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
                      helperText={
                        formik.touched.description &&
                          typeof formik.errors.description === "string"
                          ? formik.errors.description
                          : ""
                      }
                    ></TextField> */}
                  </div>
                  <div className="control_group w_50">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Start date"
                        className="label_hidden"
                        views={['year', 'month']}
                        value={formik.values.startDate ? dayjs(formik.values.startDate) : null}
                        onChange={(value) => {
                          if (value) {
                            formik.setFieldValue("startDate", value.toISOString());
                          } else {
                            formik.setFieldValue("startDate", null);
                          }
                        }} maxDate={dayjs()}
                      />
                    </LocalizationProvider>
                  </div>
                  <div className="control_group w_50 pos_rel_on">
                    <span className="pos_abs_on" >
                      <Checkbox
                        checked={ongoing}
                        onChange={() => setOngoing(!ongoing)}
                        inputProps={{ "aria-label": "controlled" }}
                      />
                      <Typography className="custom_label">Ongoing</Typography>
                    </span>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="End date"
                        className="label_hidden"
                        views={['year', 'month']}
                        value={formik.values.endDate ? dayjs(formik.values.endDate) : null}
                        onChange={(value) => {
                          if (value) {
                            formik.setFieldValue("endDate", value.toISOString());
                          } else {
                            formik.setFieldValue("endDate", null);
                          }
                        }} minDate={dayjs(formik.values.startDate)}
                      />
                    </LocalizationProvider>
                  </div>


                  <div className="control_group w_100 mt_30 ">
                    <div className="upload_doc">
                      {image ? (
                        <span onClick={() => setImage("")} className="close" ><CloseIcon /></span>
                      ) : ("")}
                      <input
                        accept="image/png, image/jpeg, application/pdf"
                        type="file"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleImageUpload(e, "profile_picture")
                        }
                      />
                      <figure>
                        <img
                          src={
                            image && image.includes(".pdf")
                              ? `/static/images/pdf_icon.svg`
                              : image
                                ? image
                                : `/static/images/upload_icon.svg`
                          }
                          alt="Document"
                        />
                      </figure>
                      <h3>Upload Experience or Appraisal Letter Documents</h3>
                    </div>
                  </div>
                  {
                    image ? (
                      <div style={{
                        margin: "10px",
                        padding: " 10px",
                        textAlign: "center"
                      }}><button
                        style={{
                          padding: "10px",
                          borderRadius: "10px",
                          background: "#05A633",
                          color: "white",
                          border: "none",
                          cursor: "pointer"
                        }} onClick={addInArray}
                        type="button">Add more experience</button></div>
                    ) : ("")
                  }
                  <div className="doc_preview">
                    {profilePicture?.length
                      ? profilePicture?.map((item: any, index: number) => {
                        return (
                          <div className="single">
                            <div >
                              <span onClick={() => { setId(item?._id); handleEdit(item, index) }} className="close v2" ><EditIcon /></span>
                              <span onClick={() => handleRemoveImage(index)} className="close" ><CloseIcon /></span>
                            </div>
                            <div key={index}>
                              <figure>
                                <img
                                  src={
                                    item?.frontImage?.includes(".pdf")
                                      ? `/static/images/pdf_icon.svg`
                                      : item?.frontImage
                                  }
                                  alt="Icon"
                                />
                              </figure>
                              <mark>
                                {moment(item?.startDate).format("MMM, YYYY")}{item?.endDate ? "-" + moment(item?.endDate).format("MMM, YYYY") : " - Ongoing"}
                              </mark>
                            </div>
                            <p>
                              <strong dangerouslySetInnerHTML={{ __html: item?.description || "" }}/> 
                            </p>

                          </div>
                        );
                      })
                      : ""}
                  </div>
                </div>
                <div className="form_btn">
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() =>
                      navigate('/tutor/profile')
                    }
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Continue</Button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default TutorExperienceEdit;
