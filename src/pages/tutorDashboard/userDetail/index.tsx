/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState } from "react";
import { TutorLayout } from "../../../layout/tutorLayout";
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import UploadMaterialModal from "../../../Modals/uploadMaterial";
import { useDeleteStudyMatMutation, useLazyGetBookingByIdQuery } from "../../../service/tutorApi";
import { showError, showToast } from "../../../constants/toast";
import Loader from "../../../constants/Loader";
import moment from "moment";
import NewSideBarTutor from "../../../components/NewSideBarTutor";

export default function TutorUserDetail() {

    const navigate = useNavigate();
    const [open1, setOpen1] = useState(false);
    const handleCloseModal1 = () => {
        setOpen1(false);
    };
    const [deleteDocs] = useDeleteStudyMatMutation();
    const [getById] = useLazyGetBookingByIdQuery();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [data, setData] = useState<any>();
    const { id } = useParams();

    const fetchDelete = async (id: string) => {
        try {
            const res = await deleteDocs({ id: id }).unwrap();
            if (res?.statusCode === 200) {
                showToast("Document removed sucessfully")
                fetchBooking();
            }
        } catch (error: any) {
            showError(error?.data?.message)
        }
    }

    const fetchBooking = async () => {
        setIsLoading(true);
        try {
            const res = await getById(id).unwrap();
            setIsLoading(false);
            if (res?.statusCode === 200) {
                setData(res?.data)
            }
        } catch (error: any) {
            setIsLoading(false);
            showError(error?.data?.message)
        }
    }

    useEffect(() => {
        fetchBooking()
    }, [])

    return (
        <>
            <TutorLayout className="role-layout">
                <Loader isLoad={isLoading} />
                <main className="content">
                    <section className="uhb_spc tBookingDetail_sc home_wrp tutor_usr_dtl">
                        {/* <div className="role_head">
                                <button className="back_arrow" onClick={() => navigate('/tutor/manage-users')}>
                                    <img src={`/static/images/back.png`} alt="Back" />
                                </button>
                                <h1 className="hd_3">User Detail</h1>
                            </div> */}
                        <div className="conta_iner v2">
                            <div className="gap_m grid_2">
                                <NewSideBarTutor />
                                <div style={{ paddingTop: '40px' }} className="role_body   rt_v2">
                                    <div className="user_card">
                                        <figure>
                                            <img src={data?.parents?.image ? data?.parents?.image : ` /static/images/user.png`} alt="Image" />
                                        </figure>
                                        <div className="rt_s">
                                            <h2>{data?.parents?.name ? data?.parents.name : "-"}</h2>
                                            <ul>
                                                <li>
                                                    <span>Subject</span>
                                                    <strong>
                                                        {data?.subjects?.length
                                                            ? data?.subjects.map((item: any) => item?.name).join(", ")
                                                            : "-"}
                                                    </strong>


                                                </li>
                                                {/* <li>
                                                <span>Grade</span>
                                                <strong>12th</strong>
                                            </li> */}
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="card_box">
                                        <div className="cardBox_head">
                                            <h2>Booking Details</h2>
                                            <div className="rt_s">
                                                <p>Invoice Number - <strong>#{data?.invoiceNo}</strong></p>
                                            </div>
                                        </div>
                                        <div className="cardBox_body">
                                            <ul className="detail_list">
                                                {data?.bookingdetails?.length ? (
                                                    <>
                                                        {/* Map only Dates */}
                                                        <li>
                                                            <span>Date</span>
                                                            <strong>
                                                                {data?.bookingdetails
                                                                    .map((item: any) => moment(item?.date).format("DD/MM/YYYY"))
                                                                    .join(", ")}
                                                            </strong>
                                                        </li>

                                                        {/* Time (same always, so no map) */}
                                                        <li>
                                                            <span>Time</span>
                                                            <strong>
                                                                {moment(data?.bookingdetails?.[0]?.startTime).format("hh:mmA")} -{" "}
                                                                {moment(data?.bookingdetails?.[0]?.endTime).format("hh:mmA") || "-"}
                                                            </strong>
                                                        </li>

                                                        {/* Subjects */}
                                                        <li>
                                                            <span>Subjects</span>
                                                            <strong>
                                                                {data?.subjects?.length
                                                                    ? data?.subjects.map((item: any) => item?.name).join(", ")
                                                                    : "-"}
                                                            </strong>
                                                        </li>

                                                        {/* Address */}
                                                        <li>
                                                            <span>Address</span>
                                                            <strong>Home Address</strong>
                                                            <p>
                                                                {data?.address?.houseNumber + " " + data?.address?.country || "-"}
                                                            </p>
                                                        </li>
                                                    </>
                                                ) : (
                                                    ""
                                                )}
                                            </ul>

                                        </div>
                                    </div>
                                    <div className="card_box">
                                        <div className="cardBox_head">
                                            <h2>Study Material</h2>
                                            <div className="rt_s">
                                                <button className="btn primary" onClick={() => setOpen1(true)}>Upload Material</button>
                                            </div>
                                        </div>
                                        <div className="cardBox_body">
                                            <div className="doc_preview">
                                                {data?.contentMaterial?.length ? (
                                                    data?.contentMaterial?.map((item: any, index: number) => {
                                                        return (
                                                            <div className="single" >
                                                                <span className="close" onClick={() => fetchDelete(item?._id)}><CloseIcon /></span>
                                                                <figure onClick={() => window.open(item?.content)}
                                                                ><img src={item?.content.includes(".pdf") ? `/static/images/pdf_icon.svg` : item?.content} alt="Icon" /></figure>
                                                                <p>
                                                                    <strong>{item?.title || "-"}</strong>
                                                                    {/* <span>{item?.description || "-"}</span> */}
                                                                    <span>Uploaded on - {moment(item?.createdAt).format('DD/MM/YYYY') || "-"}</span>
                                                                </p>
                                                            </div>

                                                        )
                                                    })
                                                ) : ("")}

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </TutorLayout>

            <UploadMaterialModal
                open={open1}
                onClose={handleCloseModal1}
                setOpen={setOpen1}
                bookingId={id ? id : ""}
                bookingDetailId={data?.bookingdetails?.[0]?._id ? data?.bookingdetails?.[0]?._id : ""}
                parentId={data?.parents?._id ? data?.parents._id : "-"}
                fetchBooking={fetchBooking}
            />
        </>
    );
}
