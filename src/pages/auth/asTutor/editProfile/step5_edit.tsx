/* eslint-disable jsx-a11y/anchor-is-valid */
import { Button, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Description } from "@mui/icons-material";
import { UploadMedia, Uploadpdf } from "../../../../utils/mediaUpload";
import { showError, showToast, showWarning } from "../../../../constants/toast";
import CloseIcon from "@mui/icons-material/Close";
import {
  useLazyGetDocsQuery,
  usePostDocsMutation,
} from "../../../../service/tutorProfileSetup";
import Loader from "../../../../constants/Loader";

const TutorDocumentStatusEdit = () => {
  const navigate = useNavigate();
  const [inputF1, setInputF1] = useState<boolean>(false);
  const [inputF2, setInputF2] = useState<boolean>(false);
  const [inputF3, setInputF3] = useState<boolean>(false);
  const [inputF4, setInputF4] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const location = useLocation();
  const [updateProfile] = usePostDocsMutation();
  const [getDocs] = useLazyGetDocsQuery();

  const [obj1, setObj1] = useState<any>({
    frontImage: "",
    documentType: 4,
    documentName: 1,
    description: "",
  });
  const [obj2, setObj2] = useState<any>({
    frontImage: "",
    documentType: 4,
    documentName: 2,
    description: "",
  });
  const [obj3, setObj3] = useState<any>({
    frontImage: "",
    backImage: "",
    documentType: 4,
    documentName: 3,
    description: "",
  });
  const [obj4, setObj4] = useState<any>({
    frontImage: "",
    documentType: 4,
    documentName: 4,
    description: "",
  });
  const [obj5, setObj5] = useState<any>({
    frontImage: "",
    documentType: 4,
    documentName: 5,
    description: "",
  });

  const handleRadioToggle1 = () => {
    setInputF1((prev) => !prev);
  };
  const handleRadioToggle2 = () => {
    setInputF2((prev) => !prev);
  };
  const handleRadioToggle3 = () => {
    setInputF3((prev) => !prev);
  };
  const handleRadioToggle4 = () => {
    setInputF4((prev) => !prev);
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    name: string
  ) => {
    const files = event.target.files;
    if (!files) return;

    try {
      setIsLoading(true);

      const fileArray = Array.from(files);

      for (const file of fileArray) {
        let res: {
          statusCode: number;
          data: { image: string };
          message?: string;
        };

        if (file.type === "application/pdf") {
          res = await Uploadpdf(file);
        } else {
          res = await UploadMedia(file);
        }

        if (res?.statusCode === 200) {
          if (name === "inputF1") {
            setObj2({
              ...obj2,
              frontImage: res?.data?.image,
            });
          } else if (name === "inputF2a") {
            setObj3({
              ...obj3,
              frontImage: res?.data?.image,
            });
          } else if (name === "inputF2b") {
            setObj3({
              ...obj3,
              backImage: res?.data?.image,
            });
          } else if (name === "inputF3") {
            setObj4({
              ...obj4,
              frontImage: res?.data?.image,
            });
          } else if (name === "inputF4") {
            setObj5({
              ...obj5,
              frontImage: res?.data?.image,
            });
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

  const fetchDocs = async () => {
    try {
      const res = await getDocs({ documentType: 4 }).unwrap();
      if (res?.statusCode === 200) {
        if (res?.data?.document?.length) {
          res?.data?.document.forEach((item: any, index: number) => {
            if (item?.documentName === 1) {
              setObj1(item);
            } else if (item?.documentName === 2) {
              setObj2(item);
            } else if (item?.documentName === 3) {
              setObj3(item);
            } else if (item?.documentName === 4) {
              setObj4(item);
            } else if (item?.documentName === 5) {
              setObj5(item);
            }
          });
        }
      }
    } catch (error: any) {
      showError(error?.data?.message);
//      console.log(error, "error in fetchdocs");
    }
  };

  const postDocuments = async () => {
    if (obj3?.frontImage?.length <= 0 || obj3?.backImage?.length <= 0) {
      showWarning("National Identification documents are required");
      return;
    } else if (obj5?.frontImage?.length <= 0) {
      showWarning("Please upload a facial biometric image");
      return;
    }

    const finalArray = [obj1, obj2, obj3, obj4, obj5];
    const body = {
      documents: finalArray,
    };
    setIsLoading(true);
    try {
      const res = await updateProfile(body).unwrap();
      setIsLoading(false);
      if (res?.statusCode === 200) {
        showToast("Documents updated successfully");
        navigate("/tutor/profile");
      }
    } catch (error: any) {
      setIsLoading(false);
      showError(error?.data?.message);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  useEffect(() => {
    if (location?.state?.length) {
      setObj1({
        ...obj1,
        frontImage: location?.state,
      });
    }
  }, []);

 
  

  return (
    <>
      <main className="content editTutor">
        <Loader isLoad={isLoading} />
        <section className="tutor_setup">
          <div className="conta_iner">
            <div className="rt_s">
              <h2>
                <button
                  className="back_arrow"
                  onClick={() => navigate("/tutor/profile")}
                >
                  <img src={`/static/images/back.png`} alt="img" />
                </button>
                <strong>Document Status</strong>
              </h2>
              <form className="form">
                <div className="gap_p">
                  <div className="control_group w_100">
                    <RadioGroup
                      className="checkbox_label"
                      aria-labelledby="demo-radio-buttons-group-label"
                      name="radio-buttons-group"
                    >
                      <FormControlLabel
                        value="value1"
                        checked
                        control={<Radio />}
                        label="Government Attested Education Documents"
                      />
                      <FormControlLabel
                        value="value2"
                        control={
                          <Radio
                            checked={inputF1}
                            onClick={handleRadioToggle1}
                          />
                        }
                        label="Valid Police Clearance Letter(not older that 4 month from Date of submission) "
                      />
                      {inputF1 && obj2.frontImage?.length <= 0 ? (
                        <div className="upload_doc">
                          <input
                            accept="image/png, image/jpeg, application/pdf"
                            type="file"
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => handleImageUpload(e, "inputF1")}
                          />
                          <figure>
                            <img
                              src={`/static/images/upload_icon.svg`}
                              alt="Icon"
                            />
                          </figure>
                          <h3>Upload Document</h3>
                        </div>
                      ) : inputF1 && obj2.frontImage?.length > 0 ? (
                        <div className="doc_preview">
                          <div className="single">
                            <span
                              className="close"
                              onClick={() =>
                                setObj2({ ...obj2, frontImage: "" })
                              }
                            >
                              <CloseIcon />
                            </span>
                            <figure>
                              <img
                                src={
                                  obj2.frontImage.includes(".pdf")
                                    ? `/static/images/pdf_icon.svg`
                                    : obj2.frontImage
                                }
                                alt="Icon"
                              />
                            </figure>
                          </div>
                        </div>
                      ) : null}

                      <FormControlLabel
                        value="value3"
                        control={
                          <Radio
                            checked={inputF2}
                            onClick={handleRadioToggle2}
                          />
                        }
                        label="Copy of valid National Identification Front and Back Scan"
                      />
                      {inputF2 ? (
                        <>
                          <div className="upload_wrap">
                            {obj3?.frontImage?.length <= 0 ? (
                              <div className="upload_doc">
                                <input
                                  accept="image/png, image/jpeg, application/pdf"
                                  type="file"
                                  onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                  ) => handleImageUpload(e, "inputF2a")}
                                />
                                <figure>
                                  <img
                                    src={`/static/images/upload_icon.svg`}
                                    alt="Icon"
                                  />
                                </figure>
                                <h3>Upload front image</h3>
                              </div>
                            ) : (
                              <div className="doc_preview">
                                <div className="single">
                                  <span
                                    className="close"
                                    onClick={() =>
                                      setObj3({ ...obj3, frontImage: "" })
                                    }
                                  >
                                    <CloseIcon />
                                  </span>
                                  <figure>
                                    <img
                                      src={
                                        obj3.frontImage.includes(".pdf")
                                          ? `/static/images/pdf_icon.svg`
                                          : obj3.frontImage
                                      }
                                      alt="Icon"
                                    />
                                  </figure>
                                </div>
                              </div>
                            )}
                            {obj3?.backImage?.length <= 0 ? (
                              <div className="upload_doc">
                                <input
                                  accept="image/png, image/jpeg, application/pdf"
                                  type="file"
                                  onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                  ) => handleImageUpload(e, "inputF2b")}
                                />
                                <figure>
                                  <img
                                    src={`/static/images/upload_icon.svg`}
                                    alt="Icon"
                                  />
                                </figure>
                                <h3>Upload back image</h3>
                              </div>
                            ) : (
                              <div className="doc_preview">
                                <div className="single">
                                  <span
                                    className="close"
                                    onClick={() =>
                                      setObj3({ ...obj3, backImage: "" })
                                    }
                                  >
                                    <CloseIcon />
                                  </span>
                                  <figure>
                                    <img
                                      src={
                                        obj3.backImage.includes(".pdf")
                                          ? `/static/images/pdf_icon.svg`
                                          : obj3.backImage
                                      }
                                      alt="Icon"
                                    />
                                  </figure>
                                </div>
                              </div>
                            )}
                          </div>
                        </>
                      ) : (
                        ""
                      )}

                      <FormControlLabel
                        value="value4"
                        control={
                          <Radio
                            checked={inputF3}
                            onClick={handleRadioToggle3}
                          />
                        }
                        label="Headshot image with visible card having national identification card number of the document submitted"
                      />

                      {inputF3 && obj4.frontImage?.length <= 0 ? (
                        <div className="upload_doc">
                          <input
                            accept="image/png, image/jpeg, application/pdf"
                            type="file"
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => handleImageUpload(e, "inputF3")}
                          />
                          <figure>
                            <img
                              src={`/static/images/upload_icon.svg`}
                              alt="Icon"
                            />
                          </figure>
                          <h3>Upload Document</h3>
                        </div>
                      ) : inputF3 && obj4.frontImage?.length > 0 ? (
                        <div className="doc_preview">
                          <div className="single">
                            <span
                              className="close"
                              onClick={() =>
                                setObj4({ ...obj4, frontImage: "" })
                              }
                            >
                              <CloseIcon />
                            </span>
                            <figure>
                              <img
                                src={
                                  obj4.frontImage.includes(".pdf")
                                    ? `/static/images/pdf_icon.svg`
                                    : obj4.frontImage
                                }
                                alt="Icon"
                              />
                            </figure>
                          </div>
                        </div>
                      ) : null}

                      <FormControlLabel
                        value="value5"
                        control={
                          <Radio
                            checked={inputF4}
                            onClick={handleRadioToggle4}
                          />
                        }
                        label="Scan facial biometric (Selfie Scan)"
                      />
                      {inputF4 && obj5.frontImage?.length <= 0 ? (
                        <div className="upload_doc">
                          <input
                            accept="image/png, image/jpeg, application/pdf"
                            type="file"
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => handleImageUpload(e, "inputF4")}
                          />
                          <figure>
                            <img
                              src={`/static/images/upload_icon.svg`}
                              alt="Icon"
                            />
                          </figure>
                          <h3>Upload Document</h3>
                        </div>
                      ) : inputF4 && obj5.frontImage?.length > 0 ? (
                        <div className="doc_preview">
                          <div className="single">
                            <span
                              className="close"
                              onClick={() =>
                                setObj5({ ...obj5, frontImage: "" })
                              }
                            >
                              <CloseIcon />
                            </span>
                            <figure>
                              <img
                                src={
                                  obj5.frontImage.includes(".pdf")
                                    ? `/static/images/pdf_icon.svg`
                                    : obj5.frontImage
                                }
                                alt="Icon"
                              />
                            </figure>
                          </div>
                        </div>
                      ) : null}
                    </RadioGroup>
                  </div>
                </div>
                <div className="form_btn">
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() =>
                      navigate("/tutor/profile")
                    }
                  >
                    Cancel
                  </Button>
                  <Button onClick={() => postDocuments()}>Continue</Button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default TutorDocumentStatusEdit;
