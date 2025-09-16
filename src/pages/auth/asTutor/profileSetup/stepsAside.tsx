/* eslint-disable jsx-a11y/anchor-is-valid */
import { useNavigate } from 'react-router-dom';
import { useLazyGetUserQuery } from '../../../../service/auth';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '../../../../hooks/store';
import { getFromStorage } from '../../../../constants/storage';
import { STORAGE_KEYS } from '../../../../constants/storageKeys';
import { setCredentials } from '../../../../reducers/authSlice';
import { showError } from '../../../../constants/toast';

type props = {
    active: boolean;
    name: string;
}

const TutorStepsAside = ({ active, name }: props) => {

    const navigate = useNavigate();
    const [getProfile] = useLazyGetUserQuery();
    const [profileData, setProfileData] = useState<any>();
    const dispatch = useAppDispatch();


    const token = getFromStorage(STORAGE_KEYS.token);
    const fetchUser = async () => {
        try {
            const res = await getProfile({}).unwrap();
            if (res?.statusCode === 200 && token) {
                setProfileData(res?.data);
                dispatch(
                    setCredentials({
                        user: res?.data,
                        token: token,
                    })
                );
            }
        } catch (error: any) {
            showError(error?.data?.message)
        }
    }

//    console.log(profileData, "my profile");

    useEffect(() => {
        if (token) {
            fetchUser();
        }
    }, [active])

    return (
        <aside className="aside_lt">
            <h1>Register Yourself as a Tutor</h1>
            <p>Information you give will help us to verify and list you as a tutor</p>
            <ul>
                <li className={
                    profileData?.profileCompletedAt >= 1
                        ? "completed"
                        : active === true && name === "profile"
                            ? "active"
                            : ""}
                    // onClick={() => navigate('/auth/as-tutor/profile-setup/step1/1')}
                    >
                    <span>Step 1</span>
                    <strong>Profile Setup</strong>
                </li>
                <li className={
                    profileData?.profileCompletedAt >= 2
                        ? "completed"
                        : active === true && name === "bank"
                            ? "active"
                            : ""} 
                            // onClick={() => navigate('/auth/as-tutor/profile-setup/step1/2')}
                            >
                    <span>Step 2</span>
                    <strong>Add Bank A/C Details</strong>
                </li>
                <li className={
                    profileData?.profileCompletedAt >= 3
                        ? "completed"
                        : active === true && name === "teaching"
                            ? "active"
                            : ""} 
                            // onClick={() => navigate('/auth/as-tutor/profile-setup/step2')}
                            >
                    <span>Step 3</span>
                    <strong>Add Teaching Details</strong>
                </li>
                <li className={
                    profileData?.profileCompletedAt >= 5
                        ? "completed"
                        : active === true && name === "education"
                            ? "active"
                            : ""} 
                            // onClick={() => navigate('/auth/as-tutor/profile-setup/step3')}
                            >
                    <span>Step 4</span>
                    <strong>Education Details</strong>
                </li>
                <li className={
                    profileData?.profileCompletedAt >= 6
                        ? "completed"
                        : active === true && name === "docs"
                            ? "active"
                            : ""} 
                            // onClick={() => navigate('/auth/as-tutor/profile-setup/step4')}
                            >
                    <span>Step 5</span>
                    <strong>Add Documents</strong>
                </li>
                <li className={
                    profileData?.profileCompletedAt >= 7
                        ? "completed"
                        : active === true && name === "exp"
                            ? "active"
                            : ""}
                            //  onClick={() => navigate('/auth/as-tutor/profile-setup/step5')}
                            >
                    <span>Step 6</span>
                    <strong>Add Experience</strong>
                </li>
            </ul>
        </aside>
    )
}

export default TutorStepsAside;