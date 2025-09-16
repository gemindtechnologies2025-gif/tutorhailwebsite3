/* eslint-disable import/no-anonymous-default-export */
import Home from "./Home";
import AboutUs from "./cms/aboutUs";
import ContactUs from "./cms/contactUs";
import PrivacyPolicy from "./cms/privacPolicy";
import TermsAndConditions from "./cms/terms&conditions";
import Faq from "./cms/faq's";
import Login from "./auth/asParent/login";
import OtpVerify from "./auth/asParent/otpVerify";
import ForgotPassword from "./auth/asParent/forgotPassword";
import ResetPassword from "./auth/asParent/resetPassword";
import Signup from "./auth/asParent/signup";
import ProfileSetup from "./auth/asParent/profile-setup";
import Congratulations from "./auth/asParent/congratulations";
import TutorLogin from "./auth/asTutor/login";
import TutorSignup from "./auth/asTutor/signup";
import TutorOtpVerify from "./auth/asTutor/otpVerify";
import TutorForgotPassword from "./auth/asTutor/forgotPassword";
import TutorResetPassword from "./auth/asTutor/resetPassword";
import TutorProfileSetup from "./auth/asTutor/profileSetup/step1-1";
import TutorBankDetail from "./auth/asTutor/profileSetup/step1-2";
import TutorTeachingDetail from "./auth/asTutor/profileSetup/step-2";
import TutorEducationBackground from "./auth/asTutor/profileSetup/step-3";
import TutorDocumentStatus from "./auth/asTutor/profileSetup/step-4";
import TutorExperience from "./auth/asTutor/profileSetup/step-5";
import ParentDashboard from "./parentDashboard/dashboard";
import ParentProfile from "./parentDashboard/profile";
import ParentWishlist from "./parentDashboard/Wishlist";
import ParentChat from "./parentDashboard/chat";
import ParentPairing from "./parentDashboard/pairing";
import ParentStudyMaterial from "./parentDashboard/studyMaterial";
import ParentAddress from "./parentDashboard/myAddress";
import ParentBookings from "./parentDashboard/myBookings";
import ParentBookingDetail from "./parentDashboard/bookingDetail";
import ParentEditBooking from "./parentDashboard/editBooking";
import ParentTutorDetail from "./parentDashboard/tutorDetail";
import ParentScheduleBooking from "./parentDashboard/scheduleBooking";
import ParentCheckout from "./parentDashboard/checkout";
import ParentPayment from "./parentDashboard/payment";
import TutorDashboard from "./tutorDashboard/dashboard";
import TutorBookingDetail from "./tutorDashboard/bookingDetail";
import TutorBookings from "./tutorDashboard/myBookings";
import TutorReviews from "./tutorDashboard/manageReviews";
import TutorEarnings from "./tutorDashboard/manageEarnings";
import TutorUsers from "./tutorDashboard/manageUsers";
import TutorChat from "./tutorDashboard/chat";
import TutorUserDetail from "./tutorDashboard/userDetail";
import ParentBookedTutor from "./parentDashboard/bookedTutor";
import ParentPopularTutor from "./parentDashboard/popularTutor";
import ParentRecomendedTutor from "./parentDashboard/recomendedTutor";
import ParentSearchResult from "./parentDashboard/searchResult";
import TutorProfile from "./tutorDashboard/profile";
import TutorProfileSetupEdit from "./auth/asTutor/editProfile/step1_edit";
import TutorBankDetailEdit from "./auth/asTutor/editProfile/step2_edit";
import TutorTeachingDetailEdit from "./auth/asTutor/editProfile/step3_edit";
import TutorEducationBackgroundEdit from "./auth/asTutor/editProfile/step4_edit";
import TutorDocumentStatusEdit from "./auth/asTutor/editProfile/step5_edit";
import TutorExperienceEdit from "./auth/asTutor/editProfile/step6_edit";
import RefundPolicy from "./cms/refundPolicy";
import Eula from "./cms/eula";
import ZoomCall from "./zoomCall";
import InquireyPage from "./parentDashboard/inquiry";
import Recommended from "./parentDashboard/recommendedClasses";
import { Formdiscussion } from "./parentDashboard/Discussion";
import { Location } from "./parentDashboard/location";
import Videos from "./parentDashboard/videos";
import BookingDetails from "./parentDashboard/bookingDetails";
import calender from "./parentDashboard/calender";
import { ScheduleBookings } from "./parentDashboard/scheduleBookings";
import PairingCode from "./parentDashboard/bookingCode";
import { MyFormDiscussion } from "./parentDashboard/Discussion/myForum";
import { TutorProfieDetails } from "./parentDashboard/tutorProfieDetails";
import CheckoutBookings from "./parentDashboard/checkoutPage";
import { TutorFormdiscussion } from "./tutorDashboard/formDiscussion";
import TutorInquireyPage from "./tutorDashboard/inquiries";
import TutorTeaserVideos from "./tutorDashboard/tutorTeasrVideos";
import TutorClasses from "./tutorDashboard/myClasses";
import { TeaserVideoDetailsTutor } from "./tutorDashboard/tutorTeasrVideos/details";
// import TutorShortVideos from "./tutorDashboard/tutorShortVideos ";
// import ShortVideoDetailsTutor from "./tutorDashboard/tutorShortVideos /details";
import { MyFormDetails } from "./parentDashboard/Discussion/formDetail";
import { MyFormDetailsTutor } from "./tutorDashboard/formDiscussion/formDetail";
import ParentTeaserVideos from "./parentDashboard/teaserVideos";
import { TeaserVideoDetailsParent } from "./parentDashboard/teaserVideos/details";
import TutorTeaserVideosDraft from "./tutorDashboard/tutorTeasrVideos/drafts";
import TutorClassDrafts from "./tutorDashboard/myClasses/drafts";
import TutorShortVideos from "./tutorDashboard/tutorShortVideos";
import ShortVideoDetailsTutor from "./tutorDashboard/tutorShortVideos/details";
import CreateClassTutor from "./tutorDashboard/myClasses/createClass";
import { TutorHomePage } from "./tutorDashboard/tutorHome";
import TutorPromoCodes from "./tutorDashboard/managePromocode";
import ActivePromotions from "./tutorDashboard/managePromocode/activePromotions";
import Drafts from "./tutorDashboard/managePromocode/drafts";
import ClassDetail from "./tutorDashboard/myClasses/classdetail";
import TutorFollowers from "./tutorDashboard/manageFollowers";
import SavedItems from "./parentDashboard/savedItems";
import ParentClassDetail from "./parentDashboard/classDetail";
import PaymentDetails from "./parentDashboard/paymentDetails";
import VideosDetails from "./parentDashboard/videos/details";
import { PostListing } from "./parentDashboard/PostListing";
import ParentShortVideosAll from "./parentDashboard/videos/allVideos";
import { TutorPosts } from "./tutorDashboard/myPosts";
import PopularClasses from "./parentDashboard/popularClasses";
import ClassPageParent from "./parentDashboard/classesPage";
import FreeClassesPage from "./parentDashboard/freeClasses";

export default {
  Home,
  AboutUs,
  ContactUs,
  PrivacyPolicy,
  TermsAndConditions,
  Faq,
  RefundPolicy,
  Eula,
  // Parent
  Login,
  Signup,
  OtpVerify,
  ForgotPassword,
  ResetPassword,
  ProfileSetup,
  Congratulations,
  ParentDashboard,
  ParentProfile,
  ParentChat,
  ParentPairing,
  ParentStudyMaterial,
  ParentWishlist,
  ParentAddress,
  ParentBookings,
  ParentBookingDetail,
  ParentTutorDetail,
  ParentEditBooking,
  ParentScheduleBooking,
  ParentCheckout,
  ParentPayment,
  ParentBookedTutor,
  ParentPopularTutor,
  ParentRecomendedTutor,
  ParentSearchResult,
  MyFormDetails,
  ParentTeaserVideos,
  TeaserVideoDetailsParent,
  TutorTeaserVideosDraft,
  TutorClassDrafts,
  ActivePromotions,
  SavedItems,
  ParentClassDetail,
  PaymentDetails,
  VideosDetails,
  // Tutor
  TutorLogin,
  TutorSignup,
  TutorOtpVerify,
  TutorForgotPassword,
  TutorResetPassword,
  TutorProfileSetup,
  TutorBankDetail,
  TutorTeachingDetail,
  TutorEducationBackground,
  TutorDocumentStatus,
  TutorExperience,
  TutorDashboard,
  TutorBookings,
  TutorBookingDetail,
  TutorReviews,
  TutorUsers,
  TutorUserDetail,
  Drafts,
  TutorEarnings,
  TutorChat,
  TutorProfile,
  TutorProfileSetupEdit,
  TutorBankDetailEdit,
  TutorTeachingDetailEdit,
  ClassDetail,
  TutorEducationBackgroundEdit,
  TutorDocumentStatusEdit,
  TutorExperienceEdit,
  TutorFormdiscussion,
  TutorInquireyPage,
  TutorClasses,
  TeaserVideoDetailsTutor,
  TutorShortVideos,
  ShortVideoDetailsTutor,
  MyFormDetailsTutor,
  CreateClassTutor,
  TutorHomePage,
  TutorPromoCodes,
  TutorFollowers,

  ZoomCall,
  InquireyPage,
  Recommended,
  Formdiscussion,
  Location,
  PairingCode,
  Videos,
  BookingDetails,
  calender,
  ScheduleBookings,
  MyFormDiscussion,
  TutorProfieDetails,
  CheckoutBookings,
  TutorTeaserVideos,
  PostListing,
  ParentShortVideosAll,
  TutorPosts,
  PopularClasses,
  ClassPageParent,
  FreeClassesPage
 
};
