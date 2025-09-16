/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState } from "react";
import { TutorLayout } from "../../../layout/tutorLayout";
import { useNavigate } from 'react-router-dom';
import { Box } from "@mui/material";
import ChangePasswordModal from "../../../Modals/changePassword";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useLazyGetUserQuery } from "../../../service/auth";
import { showError } from "../../../constants/toast";
import Loader from "../../../constants/Loader";
import { getFromStorage } from "../../../constants/storage";
import { STORAGE_KEYS } from "../../../constants/storageKeys";
import { getToken, setCredentials } from "../../../reducers/authSlice";
import { useAppDispatch, useAppSelector } from "../../../hooks/store";

export default function TutorProfile() {

    const navigate = useNavigate();
    const [getProfile] = useLazyGetUserQuery();
    const [details, setDetails] = useState<any>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [open1, setOpen1] = useState(false);
    const handleCloseModal1 = () => {
        setOpen1(false);
    };
    const tokenFromRed = useAppSelector(getToken)
    const dispatch = useAppDispatch();
    const token = getFromStorage(STORAGE_KEYS.token)

    const getProfileFun = async () => {
        setIsLoading(true)
        try {
            const res = await getProfile({}).unwrap();
            setIsLoading(false)
            if (res?.statusCode === 200) {
                setDetails(res?.data);
                dispatch(
                    setCredentials({
                        user: res?.data || null,
                        token: token || null,
                    }),
                );
            }
        } catch (error: any) {
            setIsLoading(false)
            showError(error?.data?.message)
        }
    }

    useEffect(() => {
        if (tokenFromRed) {
            getProfileFun();
        }
    }, [tokenFromRed])



    return (
        <>
            <TutorLayout className="role-layout">
                <Loader isLoad={isLoading} />
                <main className="content">
                    <section className="uhb_spc tBooking_sc">
                        <div className="conta_iner v2">
                            <div className="role_head">
                                <button className="back_arrow" onClick={() => navigate('/tutor/dashboard')}>
                                    <img src={`/static/images/back.png`} alt="Back" />
                                </button>
                                <h1 className="hd_3">My Profile</h1>
                            </div>
                            <div className="role_body">
                                <div className="profile_box2">
                                    <div className="inner">
                                        <figure>
                                            <img src={details?.image ? details?.image : `/static/images/user.png`} alt="logo" />
                                        </figure>
                                        <p>
                                            <strong>{details?.name ? details?.name : `-`}</strong>
                                            <span>{details?.email ? details?.email : `-`}</span>
                                        </p>
                                    </div>
                                    <ul className="gap_m">
                                        <li onClick={() => navigate('/tutor/profile-edit-step1', { state: "edit" })}>Personal Info <ArrowForwardIosIcon /></li>
                                        <li onClick={() => navigate('/tutor/profile-edit-step2', { state: "edit" })}>Bank A/C Deatils <ArrowForwardIosIcon /></li>
                                        <li onClick={() => navigate('/tutor/profile-edit-step3', { state: "edit" })}>Teaching Details <ArrowForwardIosIcon /></li>
                                        <li onClick={() => navigate('/tutor/profile-edit-step4', { state: "edit" })}>Educational Details <ArrowForwardIosIcon /></li>
                                        <li onClick={() => navigate('/tutor/profile-edit-step5', { state: "edit" })}>Documents <ArrowForwardIosIcon /></li>
                                        <li onClick={() => navigate('/tutor/profile-edit-step6', { state: "edit" })}>Experience Details <ArrowForwardIosIcon /></li>
                                    </ul>
                                </div>
                                <div className="pass_box">
                                    <p>Change Password</p>
                                    <Box component="a" onClick={() => setOpen1(true)}>Change</Box>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </TutorLayout>

            <ChangePasswordModal
                open={open1}
                onClose={handleCloseModal1}
                setOpen={setOpen1}
            />
        </>
    );
}
