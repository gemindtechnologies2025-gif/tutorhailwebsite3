import * as React from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShareIcon from "@mui/icons-material/Share";
import GradeIcon from "@mui/icons-material/Grade";
import { CHAT_TYPE, EDUCATION_ENUM_DISPLAY, GRADE_TYPE_NAME, HIGHER_EDUCATION_TYPE } from "../constants/enums";
import { useNavigate } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useAddWishListMutation } from "../service/wishListApi";
import { wishList } from "../types/General";
import { showError, showToast, showWarning } from "../constants/toast";
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import StarIcon from '@mui/icons-material/Star';
import HowToRegOutlinedIcon from '@mui/icons-material/HowToRegOutlined';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import QueryBuilderOutlinedIcon from '@mui/icons-material/QueryBuilderOutlined';
import SupervisorAccountOutlinedIcon from '@mui/icons-material/SupervisorAccountOutlined';
import FavoriteBorderSharpIcon from '@mui/icons-material/FavoriteBorderSharp';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import IosShareSharpIcon from '@mui/icons-material/IosShareSharp';
import { RWebShare } from "react-web-share";
import { useFollowTutorMutation } from "../service/content";
import { REDIRECTLINK } from "../constants/url";
import { convertCurrency } from "../utils/currency";
import { useAppSelector } from "../hooks/store";
import { currencyMode, currencySymbol, selectCurrencyRates, selectCurrentCurrency } from "../reducers/currencySlice";
import { getFromStorage } from "../constants/storage";
import { STORAGE_KEYS } from "../constants/storageKeys";
import LoginAlertModal from "../Modals/LoginAlertModal";

type TeachingDetails = {
  totalTeachingExperience: number;
  price?: number;
  specialization: string;
  achievement: string;
  higherEdu: number;
};
type props = {
  isWishlist?: boolean;
  wishlistUpdate?: any;
  item: {
    bannerImg: string;
    usdPrice: number;
    isActive: any;
    bannerImage: string;
    isFollowing: any;
    views: number;
    totalReviews: number;
    banner: string;
    _id: string;
    name: string;
    image: string;
    address: string;
    documentVerification: boolean;
    longitude: number;
    latitude: number;
    role: number;
    teachingdetails: any;
    subjects: string[];
    classes: string[];
    avgRating: number | null;
    isFav: boolean;
    price: number;
    tutorId?: string;
    tutors?: any;
    followers: string | number;
  };
};

const TutorsCard = React.forwardRef<HTMLDivElement, props>(
  ({ item, isWishlist, wishlistUpdate }, ref) => {

    const navigate = useNavigate();
    const [addWishlist] = useAddWishListMutation();
    const [follow, setFollow] = React.useState<boolean>(item?.isFollowing);
    const [showIcon, setShowIcon] = React.useState<boolean>(item.isFav || false);
    const [followTutor] = useFollowTutorMutation();
    const currencyRates = useAppSelector(selectCurrencyRates);
    const currentCurrency = useAppSelector(selectCurrentCurrency);
    const currentCurrencyMode = useAppSelector(currencyMode);
    const currentCurrencySymbol = useAppSelector(currencySymbol);
    const token = getFromStorage(STORAGE_KEYS.token);
     const [open2, setOpen2] = React.useState<boolean>(false);
      const handleClose2 = () => {
        setOpen2(false);
      };

    const followTutorFunc = async () => {
      const body = {
        tutorId: item?._id || "",
      };
      try {
        const res = await followTutor(body).unwrap();
        if (res?.statusCode == 200) {
          setFollow(!follow)
        }
      } catch (error: any) {
        showError(error?.data?.message || "Something went wrong");
      }
    };

    const handleWishList = async (item: any) => {
      try {
        let body = {
          tutorId: isWishlist ? item?.tutorId : item?._id,
        };

        const res = await addWishlist({ body }).unwrap();
        if (res?.statusCode === 200) {
          if (showIcon) {
            showToast("Tutor removed to wishlist");
            setShowIcon(false);
          } else {
            showToast("Tutor added to wishlist");
            setShowIcon(true);
          } 
          // wishlistUpdate && wishlistUpdate();
        }
      } catch (error: any) { }
    };

    return (
      <div ref={ref} className="tutors_card tutor_card_v2">
        {/* Banner */}
        <div className="banner">
          <img onClick={() => navigate(`/parent/tutorProfieDetails/${isWishlist ? item?.tutorId : item?._id}`)} src={item?.bannerImg || `/static/images/profile_bg.png`} alt="tutors_bg" />

          <div className="wishlist_icons">

            {/* Wishlist */}
            <button className="icon_btn" onClick={() =>token ?  handleWishList(item):setOpen2(true)}>
              {showIcon ? <FavoriteIcon /> : <FavoriteBorderSharpIcon />}
            </button>

            <RWebShare
              data={{
                text: "Click on link to see the tutor details",
                url: `${REDIRECTLINK}tutorProfieDetails/${item?._id}`,
                title: item?.name || "",
              }}
            >
              <button className="icon_btn">
                <IosShareSharpIcon />
              </button>
            </RWebShare>
            



          </div>
        </div>

        {/* Profile Details */}
        <div className="profile_area">
          {/* Avatar */}
          <figure onClick={() => navigate(`/parent/tutorProfieDetails/${isWishlist ? item?.tutorId : item?._id}`)} className={`avatar ${item?.isActive || item?.tutors?.isActive ?  "active_border":""}`}>
            <img
           
              src={
                isWishlist
                  ? item?.tutors?.image || `/static/images/emaa.png`
                  : item?.image || `/static/images/emaa.png`
              }
              alt={item?.name || "profile"}
            />
          </figure>

          {/* Name + Verify */}
          <h3 className="name">
            {isWishlist ? item?.tutors?.name || "User" : item?.name || "User"}
            <div>

              {item?.documentVerification ? (
                <span className="verify_icon" >
                  <img width={25} src='/static/images/verified.png' />

                </span>
              ) : null}

              <span className="verify_icon" onClick={() =>token ?  followTutorFunc():setOpen2(true)}>
                {follow ? (<HowToRegOutlinedIcon />) : (<PersonAddAltOutlinedIcon />)}

              </span>
            </div>
          </h3>

          {/* Education */}
          <p className="edu">
            <span>
              <SchoolOutlinedIcon />
            </span>
            {isWishlist
              ? EDUCATION_ENUM_DISPLAY[item?.teachingdetails?.[0]?.higherEdu] +", "+ item?.teachingdetails?.[0]?.specialization || ""
              : EDUCATION_ENUM_DISPLAY[item?.teachingdetails?.higherEdu] +", "+item?.teachingdetails?.specialization || ""}
          </p>

          {/* Rating */}
          <div onClick={() => navigate(`/parent/tutorProfieDetails/${isWishlist ? item?.tutorId : item?._id}`)} className="rating">
            <span className="star">
              <StarIcon />
            </span>
            <span>{item?.avgRating || 0} </span>
          </div>

          {/* Subjects */}
          <div onClick={() => navigate(`/parent/tutorProfieDetails/${isWishlist ? item?.tutorId : item?._id}`)} className="subjects">
            {item?.subjects?.length ? (
              <>
                {item?.subjects?.slice(0, 1)?.map((sub: any, idx) => (
                  <span key={idx} className="tag">
                    {isWishlist ? sub?.name :sub|| ""}
                  </span>
                ))}
                {item.subjects.length > 1 && (
                  <span className="tag">+{item.subjects.length - 1}</span>
                )}
              </>
            ) : (
              <span className="tag">N/A</span>
            )}
          </div>

          {/* Stats */}
          <div onClick={() => navigate(`/parent/tutorProfieDetails/${isWishlist ? item?.tutorId : item?._id}`)} className="stats">
            <div>
              <QueryBuilderOutlinedIcon />{" "}
              {isWishlist
                ? item?.teachingdetails?.[0]?.totalTeachingExperience
                : item?.teachingdetails?.totalTeachingExperience || 0}{" "}
              years
            </div>
            <div>
              <SupervisorAccountOutlinedIcon /> {item?.teachingdetails?.classes?.length ? GRADE_TYPE_NAME[item?.teachingdetails?.classes?.[0]] : ""}
            </div>
            <div>
              <SupervisorAccountOutlinedIcon />{" "}
              {item?.tutors?.followers ? item?.tutors?.followers : item?.followers ? item?.followers : 0}
            </div>
            <div>
              <RemoveRedEyeOutlinedIcon /> {item?.views || 0}
            </div>
          </div>

          {/* Price */}
          <div className="price">
            {`${currentCurrencySymbol} ${convertCurrency({
              price: item?.usdPrice
                ? item?.usdPrice
                : item?.teachingdetails?.usdPrice
                  ? item?.teachingdetails?.usdPrice
                  : item?.teachingdetails?.[0]?.usdPrice
                    ? item?.teachingdetails?.[0]?.usdPrice
                    : 0,
              rate: currencyRates[currentCurrency],
            })?.toLocaleString(`${currentCurrencyMode}`)}`
            }


            <span>/hr</span>
          </div>

          {/* Action Buttons */}
          <div className="actions">
            <button
              onClick={() => { !token ? setOpen2(true) : 
                follow ? navigate('/parent/chat', {
                  state: {
                    bookingId: '',
                    connectionId: '',
                    bookingStatus: '',
                    name: item?.name || '',
                    image: item?.image || '',
                    tutorId: item?._id,
                    type: CHAT_TYPE.NORMAL,
                    tutorVerified: item?.documentVerification,
                  }
                }) : showWarning("Please follow tutor to send a message")
              }}
              className="chat_btn">
              <i className="fa fa-comment-o"></i> Chat
            </button>
            <button disabled={item?.isActive ? false : true} style={!item?.isActive ? { backgroundColor: 'grey', color: "black" } : {}} onClick={() => token ? navigate(`/parent/ScheduleBookings/${item?._id}`):setOpen2(true)} className="book_btn">{item?.isActive ? "Book Now" : "Schedule"}</button>
          </div>
        </div>
         <LoginAlertModal
                open={open2}
                setOpen={setOpen2}
                onClose={handleClose2}
                msg="Please login"
              />
      </div>

    );
  }
)
export default TutorsCard;
