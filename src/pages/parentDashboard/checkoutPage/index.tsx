import React, { useEffect, useState } from 'react'
import { ParentLayout } from '../../../layout/parentLayout'
import SessionSummary from '../../../components/SessionSummary'
import { ProfileCard } from '../../../components/ProfileCard'
import BookingDateTime from '../../../components/BookingDateTime'
import RightBottomLinks from '../../../components/RightBottomLinks'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { BookingResponse, SettingResponse, TutorDetailsById } from '../../../types/General'
import { TutorApi } from '../../../service/tutorApi'
import { Box, Input, InputAdornment, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material'
import dayjs from 'dayjs'
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import AddIcon from '@mui/icons-material/Add';
import moment from 'moment'
import { useLazyGetSubjectsAndCategoryQuery } from '../../../service/auth'
import { GRADE_TYPE_NAME, TYPE_SUBJECT_LISTING } from '../../../constants/enums'
import { useGetAddressQuery } from '../../../service/address'
import { useAddBookingCheckoutMutation, useAddBookingMutation } from '../../../service/booking'
import CheckoutSummary from '../../../components/CheckoutSummry'
import { getFromStorage } from '../../../constants/storage'
import { showWarning } from '../../../constants/toast'
import { STORAGE_KEYS } from '../../../constants/storageKeys'
import { socket } from '../../../utils/socket'

interface TimeSlotBody {
    date: string; // ISO date string
    startTime: string; // ISO date string for start time
    endTime: string; // ISO date string for end time
    tutorId: string | undefined; // ID of the tutor
}

interface BookingBody {
    tutorId: string | undefined; // ID of the tutor
    subjectId: string[]; // ID of the subject
    parentAddressId?: string; // ID of the parent address
    distance: number; // Distance in kilometers
    latitude?: number | undefined; // Latitude of the location
    longitude?: number | undefined; // Longitude of the location
    timeSlots: TimeSlotBody[]; // Array of time slots
}
export const CheckoutBookings = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { state } = location;
    const id = state.id;
    const dataProfile = state.dataProfile;
    const selectedDates = state.selectedDates;
    const time = state.time;
    const learning = state.learning;
    const additional = state.additional;
    const addressObj = state.address;

    const subject = state.subject;
    const className = state.class;
    const alignment = state.mode;
    const [addBooking] = useAddBookingCheckoutMutation();
    const [bookingDetails, setBookingDetails] =
        useState<BookingResponse | null>();

    const [settings, setSettings] = useState<SettingResponse | null>();

    const addBookingMutation = async () => {
        try {
            setLoading(true);
            let body: BookingBody = getFromStorage(STORAGE_KEYS.body) as BookingBody;
            console.log(body, 'body');

            const res = await addBooking({
                isCartScreen: false,
                body: body,
            }).unwrap();
            if (res?.statusCode === 200) {
                setLoading(false);
                window.open(res?.data?.link?.redirect_url, "_self");
            }
        } catch (error: any) {
            //      console.log(error);
            setLoading(false);
            showWarning(error?.data?.message);
            navigate(`/parent/tutor-detail/${id}`);
        }
    };




    const handlePaymentOk = (res: any) => {
        const paymentStatus =
            res?.data?.paymentDetails?.payment_status_description || "";
        //    console.log(res, "socket");
        if (paymentStatus === "Completed") {
            navigate("/parent/my-bookings");
        } else {
            navigate("/parent/schedule-booking/" + bookingDetails?.tutorId);
        }
    };
    useEffect(() => {
        socket?.on("payment_ok", handlePaymentOk);
        return () => {
            // Clean up the socket listener when the component is unmounted
            socket?.off("payment_ok", handlePaymentOk);
        };
    }, []);

    const children = [
        <ToggleButton value="left" key="left">
            Online
        </ToggleButton>,

        <ToggleButton value="right" key="right">
            Offline
        </ToggleButton>,
    ];



    const control = {
        value: alignment,
        exclusive: true,
    };

    useEffect(() => {
        const bookingData = getFromStorage(STORAGE_KEYS.bookingDetails);
        const settingData = getFromStorage(STORAGE_KEYS.bookingSettings);
        if (bookingData) {
            setBookingDetails(bookingData as BookingResponse);
        } else {
            setBookingDetails(null);
        }

        if (settingData) {
            setSettings(settingData as SettingResponse);
        } else {
            setSettings(null);
        }
    }, []);




    return (
        <>
            <ParentLayout className="role-layout" >
                <main className="content">
                    <section className="uh_spc  home_wrp bkng_dtlss">
                        <div className="conta_iner v2">
                            <div className="tutor_profile gap_m">
                                <div className="role_body rt_v2">
                                    <div className='tutor_profile_details mn_booking_dtls'>
                                        <div className="card_inr">
                                            <figure>
                                                <img src={dataProfile?.bannerImg || "/static/images/profile_bg.png"} alt="" />
                                                <figcaption>
                                                    <span className="dot"></span>{dataProfile?.isActive ? 'Online' : "Offline"}
                                                </figcaption>
                                            </figure>
                                            <ProfileCard data={dataProfile} />
                                        </div>
                                    </div>

                                    <div className='bkng_mn_bg'>
                                        <div className='booking_scs'>
                                            <div className='title_fdx'>
                                                <h2>Booking Date & Time</h2>
                                                <div className='btn_groups'>
                                                    <ToggleButtonGroup size="small" {...control} aria-label="Small sizes">
                                                        {children}
                                                    </ToggleButtonGroup>
                                                </div>
                                            </div>

                                            {selectedDates?.length > 0 && (
                                                <ul className='cal_fdx'>
                                                    <li>
                                                        <div className="selected-dates-container">
                                                            {selectedDates?.map((item: any, index: number) => (
                                                                <p className="available" key={index}>
                                                                    {item}
                                                                </p>
                                                            ))}

                                                        </div>
                                                    </li>
                                                </ul>
                                            )}
                                            {time && (
                                                <ul className='cal_fdx'>
                                                    <li>
                                                        <div className="selected-dates-container">
                                                            <p className="available">
                                                                {time || ""}
                                                            </p>

                                                        </div>
                                                    </li>
                                                </ul>)}
                                        </div>

                                        <div className=' sub_list ut_spc home_wrp ' >
                                            <div className="title_fdx">
                                                <h2>Select Subject</h2>
                                            </div>

                                            <ul className="cstmm_tabs ">
                                                {subject &&
                                                    <li className={"green"}  >{subject || "-"}</li>

                                                }
                                            </ul>
                                        </div>

                                        <div className=' sub_list ut_spc home_wrp ' >
                                            <div className="title_fdx">
                                                <h2>Select Level</h2>
                                            </div>

                                            <ul className="cstmm_tabs ">
                                                <li className="green">{GRADE_TYPE_NAME[className]}</li>
                                            </ul>
                                        </div>
                                        <div className=' sub_list ut_spc'>
                                            <div className="title_fdx">
                                                <h2>What would you want to learn today?</h2>
                                            </div>
                                            <div className='input_group'>
                                                <Input disabled placeholder='Type here..' className="form_control" inputProps={{ maxLength: 80 }} value={learning} />
                                            </div>
                                        </div>
                                        <div className=' sub_list ut_spc'>
                                            <div className="title_fdx">
                                                <h2>Additional Information</h2>
                                            </div>
                                            <div className='input_group'>
                                                <Input disabled placeholder='Type here..' className="form_control" inputProps={{ maxLength: 80 }} value={additional} />
                                            </div>
                                        </div>

                                        <div className=' sub_list ut_spc'>
                                            <div className="title_fdx">
                                                <h2>Select Address</h2>
                                            </div>
                                            <ul className='address_mn ut_spc'>
                                                <li>
                                                    <h4>{addressObj?.addressType === 1
                                                        ? "Home Address"
                                                        : addressObj?.addressType === 2
                                                            ? "Office Address"
                                                            : "Other Address"}</h4>
                                                    <p>{addressObj?.houseNumber || ""}&nbsp;
                                                        {addressObj?.city || ""}{" "}
                                                        {addressObj?.country || ""}{" "}</p>

                                                    <p>  {addressObj?.parentId?.phoneNo
                                                        ? `${addressObj?.parentId?.dialCode}-${addressObj?.parentId?.phoneNo}`
                                                        : null}</p>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    ``
                                </div>
                                <div className="sidebar_rt">
                                    <CheckoutSummary
                                        classFee={dataProfile?.teachingdetails?.usdPrice}
                                        serviceFeeName={settings?.serviceType === 1 ? "flat" : "%"}
                                        serviceFee={settings?.serviceFees}
                                        transportationFee={bookingDetails?.totalTransportationFees}
                                        total={bookingDetails?.grandTotal}
                                        isLoading={loading}
                                        submit={addBookingMutation}
                                        isPromo={bookingDetails?.promocodeId ? true : false}
                                        discount={bookingDetails?.discountAmount}
                                        hours={bookingDetails?.totalNoOfHours}
                                    />
                                    <RightBottomLinks />
                                </div>
                            </div>
                        </div>
                    </section>
                </main>

            </ParentLayout>



        </>
    )
}

export default CheckoutBookings;