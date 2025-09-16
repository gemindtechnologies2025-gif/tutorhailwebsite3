import * as React from "react";
import Box from "@mui/material/Box";
import { useFollowTutorMutation } from "../service/content";
import { showError } from "../constants/toast";
import { useNavigate } from "react-router-dom";
import { useGetAllTypeTutorQuery } from "../service/parentDashboard";
import { TUTOR_TYPE } from "../constants/enums";
import { getFromStorage } from "../constants/storage";
import { STORAGE_KEYS } from "../constants/storageKeys";
import LoginAlertModal from "../Modals/LoginAlertModal";

const TutorListing = ({ tutor }: any) => {
    const [followTutor] = useFollowTutorMutation();
    const navigate = useNavigate();
    const token = getFromStorage(STORAGE_KEYS.token);
    const [open2, setOpen2] = React.useState<boolean>(false);
    const handleClose2 = () => {
        setOpen2(false);
    };

    const { data: recommended, isSuccess, isLoading, isFetching, refetch } = useGetAllTypeTutorQuery({
        page: 1,
        limit: 4,
        type: TUTOR_TYPE.POPULAR,
        body: {}
    });

    const followTutorFunc = async (item: any) => {
        const body = {
            tutorId: item?._id || "",
        };
        try {
            const res = await followTutor(body).unwrap();
            if (res?.statusCode == 200) {
                refetch()
            }
        } catch (error: any) {
            showError(error?.data?.message || "Something went wrong");
        }
    };

    return (
        <>
            {tutor ? null : (
                <section className=" side_menu_wrap tutor_wrp">
                    <div className="title_hd">
                        <h2>Tutor Listing</h2>
                    </div>
                    <ul className="tutor_list">
                        {recommended?.data?.data?.map((item: any) => {
                            return (
                                <li>
                                    <div className="inr_dtl">
                                        <figure className={item?.isActive ? 'active_border' : ''} onClick={() => navigate(`/parent/tutorProfieDetails/${item?._id}`)}>
                                            <img src={item?.image || `/static/images/emaa.png`} alt="emaa" />
                                        </figure>
                                        <div className="dtls">
                                            <h2>{item?.name || ""}</h2>
                                            <p>{''} <span>{item?.followers || "0"} Followers</span></p>
                                            <small>Exp: {item?.teachingdetails?.totalTeachingExperience ? item?.teachingdetails?.totalTeachingExperience + " years" : ""}</small>
                                        </div>
                                    </div>
                                    <button onClick={() => token ? followTutorFunc(item):setOpen2(true)} className="btn transparent">{item?.isFollowing ? "Following" : "Follow"}</button>
                                </li>
                            )
                        })}


                    </ul>
                </section>
            )}


            <section className="side_menu_wrap unlock_bg ">
                <div className="group">
                    <h4>Unlock Learning, Book Your Perfect Tutor Today!</h4>
                    <button >Book Now</button>
                </div>
                <figure>
                    <img src={`/static/images/unlock_men.png`} alt="unlock_men" />
                </figure>
            </section>
            {/* <section className="side_menu_wrap  page_link">
                <ul>
                    <li onClick={()=>navigate('/about-us')}>
                        <a>About Us</a>
                    </li>
                    <li onClick={()=>navigate('/contact-us')}>
                        <a>Contact Us</a>
                    </li>
                    <li onClick={()=>navigate('/about-us')}>
                        <a>Help Center</a>
                    </li>
                    <li onClick={()=>navigate('/parent/terms-and-conditions')}>
                        <a>Terms & conditions</a>
                    </li>
                    <li onClick={()=>navigate('/privacy-policy')}>
                        <a>Privacy Policy</a>
                    </li>
                    <li onClick={()=>navigate('/about-us')}>
                        <a>FAQ’s</a>
                    </li>
                </ul>
            </section> */}
            <LoginAlertModal
                open={open2}
                setOpen={setOpen2}
                onClose={handleClose2}
                msg="Please login"
            />
        </>
    );
};

export default TutorListing;
