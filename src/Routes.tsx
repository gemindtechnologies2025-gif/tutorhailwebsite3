/* eslint-disable react/jsx-pascal-case */
import { Routes, Route } from "react-router-dom";
import Pages from "./pages";
import { FilterProvider } from "./context/filterContext";

import ProtectedRoutes from "./protectedRoutes";

const Routing = () => {
  return (
    <Routes>
      {/* common routes */}
      <Route path="/" element={<Pages.Home />} />
      <Route path="/faq" element={<Pages.Faq />} />
      <Route path="/eula" element={<Pages.Eula />} />
      <Route
        path="/terms-and-conditions"
        element={<Pages.TermsAndConditions />}
      />
      <Route path="/privacy-policy" element={<Pages.PrivacyPolicy />} />
      <Route path="/contact-us" element={<Pages.ContactUs />} />
      <Route path="/about-us" element={<Pages.AboutUs />} />
      <Route path="/refund-policy" element={<Pages.RefundPolicy />} />
      <Route path="/parent/inquiry" element={<Pages.InquireyPage />} />
      <Route path="/parent/recommendedClasses" element={<Pages.Recommended />} />
      <Route path="/parent/popularClasses" element={<Pages.PopularClasses />} />
      <Route path="/parent/freeClasses" element={<Pages.FreeClassesPage />} />

      <Route path="/parent/formdiscussion" element={<Pages.Formdiscussion />} />
      <Route path="/parent/my-forum" element={<Pages.MyFormDiscussion />} />
      <Route path="/parent/formDetails/:id" element={<Pages.MyFormDetails />} />
      <Route path="/parent/location" element={<Pages.Location />} />
      <Route path="/parent/code" element={<Pages.PairingCode />} />
      <Route path="/parent/videos" element={<Pages.Videos />} />
      <Route path="/parent/videos/all" element={<Pages.ParentShortVideosAll />} />
      <Route path="/parent/videos/:id" element={<Pages.VideosDetails />} />
      <Route path="/parent/BookingDetails" element={<Pages.BookingDetails />} />
      <Route path="/parent/ScheduleBookings/:id" element={<Pages.ScheduleBookings />} />
      <Route path="/parent/tutorProfieDetails/:id" element={<Pages.TutorProfieDetails />} />
      <Route path="/parent/teaserVideos/:id" element={<Pages.TeaserVideoDetailsParent />} />
      <Route path="/parent/teaserVideos" element={<Pages.ParentTeaserVideos />} />
      <Route path="/parent/ClassDetail/:id" element={<Pages.ParentClassDetail />} />
      <Route path="/parent/savedItems" element={<Pages.SavedItems />} />
      <Route path="/parent/posts" element={<Pages.PostListing />} />
      <Route path="/parent/classes" element={<Pages.ClassPageParent />} />

      <Route path="/parent/Calender" element={<Pages.calender />} />
      <Route path="/parent/contact-us" element={<Pages.ContactUs />} />
      <Route path="/parent/terms-and-conditions" element={<Pages.TermsAndConditions />} />
      <Route path="/parent/privacy-policy" element={<Pages.PrivacyPolicy />} />
      <Route path="/parent/about-us" element={<Pages.AboutUs />} />
      <Route path="/parent/faq" element={<Pages.Faq />} />
      <Route path="/parent/PaymentDetails/:id" element={<Pages.PaymentDetails />} />
      {/* parent routes unprotected */}
      <Route path="/auth/as-parent/login" element={<Pages.Login />} />
      <Route
        path="/auth/as-parent/login/linkedin/callback"
        element={<Pages.Login />}
      />
      <Route
        path="/parent/tutor-detail/:id"
        element={<Pages.ParentTutorDetail />}
      />
      <Route
        path="/parent/popular-tutor"
        element={
          <FilterProvider>
            <Pages.ParentPopularTutor />
          </FilterProvider>
        }
      />
      <Route path="/auth/as-parent/signup" element={<Pages.Signup />} />
      <Route path="/auth/as-parent/otp-verify" element={<Pages.OtpVerify />} />
      <Route
        path="/auth/as-parent/otp-verify-email"
        element={<Pages.OtpVerify />}
      />
      <Route
        path="/parent/schedule-booking/:id"
        element={<Pages.ParentScheduleBooking />}
      />
      <Route
        path="/auth/as-parent/signup-otp-verify-phone"
        element={<Pages.OtpVerify />}
      />
      <Route
        path="/auth/as-parent/signup-otp-verify-email"
        element={<Pages.OtpVerify />}
      />
      <Route
        path="/auth/as-parent/forgot-password"
        element={<Pages.ForgotPassword />}
      />
      <Route
        path="/auth/as-parent/reset-password"
        element={<Pages.ResetPassword />}
      />

      {/* tutor routes unprotected */}
      <Route path="/auth/as-tutor/login" element={<Pages.TutorLogin />} />
      <Route
        path="/auth/as-tutor/login/linkedin/callback"
        element={<Pages.TutorLogin />}
      />
      <Route path="/auth/as-tutor/signup" element={<Pages.TutorSignup />} />
      <Route
        path="/auth/as-tutor/signup/linkedin/callback"
        element={<Pages.TutorSignup />}
      />
      <Route
        path="/auth/as-tutor/otp-verify"
        element={<Pages.TutorOtpVerify />}
      />
      <Route
        path="/auth/as-tutor/otp-verify-email"
        element={<Pages.TutorOtpVerify />}
      />
      <Route
        path="/auth/as-tutor/signup-otp-verify-phone"
        element={<Pages.TutorOtpVerify />}
      />
      <Route
        path="/auth/as-tutor/signup-otp-verify-email"
        element={<Pages.TutorOtpVerify />}
      />
      <Route
        path="/auth/as-tutor/forgot-password"
        element={<Pages.TutorForgotPassword />}
      />
      <Route
        path="/auth/as-tutor/reset-password"
        element={<Pages.TutorResetPassword />}
      />
      <Route path="/tutor/contact-us" element={<Pages.ContactUs />} />
      <Route
        path="/tutor/terms-and-conditions"
        element={<Pages.TermsAndConditions />}
      />
      <Route path="/tutor/privacy-policy" element={<Pages.PrivacyPolicy />} />
      <Route path="/tutor/about-us" element={<Pages.AboutUs />} />
      <Route path="/tutor/faq" element={<Pages.Faq />} />

      {/* protected routes */}
      <Route element={<ProtectedRoutes />}>
        <Route
          path="/auth/as-parent/profile-setup"
          element={<Pages.ProfileSetup />}
        />
        <Route
          path="/auth/as-parent/congratulations"
          element={<Pages.Congratulations />}
        />
        <Route
          path="/parent/dashboard"
          element={
            <FilterProvider>
              <Pages.ParentDashboard />
            </FilterProvider>
          }
        />
        <Route
          path="/parent/search-result"
          element={
            <FilterProvider>
              <Pages.ParentSearchResult />
            </FilterProvider>
          }
        />
        <Route path="/parent/profile" element={<Pages.ParentProfile />} />
        <Route path="/parent/chat" element={<Pages.ParentChat />} />
        <Route path="/parent/pairing" element={<Pages.ParentPairing />} />
        <Route
          path="/parent/study-material"
          element={<Pages.ParentStudyMaterial />}
        />
        <Route path="/parent/wishlist" element={<Pages.ParentWishlist />} />
        <Route path="/parent/my-address" element={<Pages.ParentAddress />} />
        <Route path="/parent/my-bookings" element={<Pages.ParentBookings />} />
        <Route
          path="/parent/booking-detail/accepted/:id"
          element={<Pages.ParentBookingDetail />}
        />
        <Route
          path="/parent/booking-detail/pending"
          element={<Pages.ParentBookingDetail />}
        />
        <Route
          path="/parent/booking-detail/ongoing"
          element={<Pages.ParentBookingDetail />}
        />
        <Route
          path="/parent/booking-detail/completed"
          element={<Pages.ParentBookingDetail />}
        />
        <Route
          path="/parent/booking-detail/cancelled"
          element={<Pages.ParentBookingDetail />}
        />
        <Route
          path="/parent/edit-booking"
          element={<Pages.ParentEditBooking />}
        />
        {/* <Route path="/parent/checkout" element={<Pages.ParentCheckout />} /> */}
        <Route path="/parent/checkout" element={<Pages.CheckoutBookings />} />

        <Route path="/parent/payment" element={<Pages.ParentPayment />} />
        <Route
          path="/parent/booked-tutor"
          element={<Pages.ParentBookedTutor />}
        />

        <Route
          path="/parent/recomended-tutor"
          element={
            <FilterProvider>
              <Pages.ParentRecomendedTutor />
            </FilterProvider>
          }
        />
        <Route
          path="/auth/as-tutor/profile-setup/step1/1"
          element={<Pages.TutorProfileSetup />}
        />
        <Route
          path="/auth/as-tutor/profile-setup/step1/2"
          element={<Pages.TutorBankDetail />}
        />
        <Route
          path="/auth/as-tutor/profile-setup/step2"
          element={<Pages.TutorTeachingDetail />}
        />
        <Route
          path="/auth/as-tutor/profile-setup/step3"
          element={<Pages.TutorEducationBackground />}
        />
        <Route
          path="/auth/as-tutor/profile-setup/step4"
          element={<Pages.TutorDocumentStatus />}
        />
        <Route
          path="/auth/as-tutor/profile-setup/step5"
          element={<Pages.TutorExperience />}
        />
        <Route path="/tutor/dashboard" element={<Pages.TutorDashboard />} />
        <Route path="/tutor/my-bookings" element={<Pages.TutorBookings />} />
        <Route
          path="/tutor/booking-detail/accepted/:id"
          element={<Pages.TutorBookingDetail />}
        />
        <Route path="/tutor/formdiscussion" element={<Pages.TutorFormdiscussion />} />
        <Route path="/tutor/posts" element={<Pages.TutorPosts />} />
        <Route path="/tutor/formDetails/:id" element={<Pages.MyFormDetailsTutor />} />
        <Route path="/tutor/inquries" element={<Pages.TutorInquireyPage />} />
        <Route path="/tutor/classes" element={<Pages.TutorClasses />} />
        <Route path="/tutor/classes/drafts" element={<Pages.TutorClassDrafts />} />
        <Route path="/tutor/home" element={<Pages.TutorHomePage />} />
        <Route
          path="/tutor/booking-detail/pending/:id"
          element={<Pages.TutorBookingDetail />}
        />
        <Route
          path="/tutor/booking-detail/ongoing/:id"
          element={<Pages.TutorBookingDetail />}
        />
        <Route
          path="/tutor/booking-detail/completed/:id"
          element={<Pages.TutorBookingDetail />}
        />
        <Route
          path="/tutor/booking-detail/cancelled/:id"
          element={<Pages.TutorBookingDetail />}
        />
        <Route path="/tutor/manage-reviews" element={<Pages.TutorReviews />} />
        <Route
          path="/tutor/manage-earnings"
          element={<Pages.TutorEarnings />}
        />
        <Route path="/tutor/manage-users" element={<Pages.TutorUsers />} />
        <Route path="/tutor/manage-followers" element={<Pages.TutorFollowers />} />
        <Route
          path="/tutor/user-detail/:id"
          element={<Pages.TutorUserDetail />}
        />
        <Route path="/tutor/chat" element={<Pages.TutorChat />} />

        <Route path="/tutor/profile" element={<Pages.TutorProfile />} />
        <Route
          path="/tutor/profile-edit-step1"
          element={<Pages.TutorProfileSetupEdit />}
        />
        <Route
          path="/tutor/profile-edit-step2"
          element={<Pages.TutorBankDetailEdit />}
        />
        <Route
          path="/tutor/profile-edit-step3"
          element={<Pages.TutorTeachingDetailEdit />}
        />
        <Route
          path="/tutor/profile-edit-step4"
          element={<Pages.TutorEducationBackgroundEdit />}
        />
        <Route
          path="/tutor/profile-edit-step5"
          element={<Pages.TutorDocumentStatusEdit />}
        />
        <Route
          path="/tutor/profile-edit-step6"
          element={<Pages.TutorExperienceEdit />}
        />

        <Route
          path="/tutor/TutorTeaserVideos"
          element={<Pages.TutorTeaserVideos />}
        />
        <Route
          path="/tutor/TutorTeaserVideos/drafts"
          element={<Pages.TutorTeaserVideosDraft />}
        />
        <Route
          path="/tutor/teaserVideos/:id"
          element={<Pages.TeaserVideoDetailsTutor />}
        />
        <Route
          path="/tutor/create-class"
          element={<Pages.CreateClassTutor />}
        />

        <Route
          path="/tutor/create-class/:id"
          element={<Pages.CreateClassTutor />}
        />
        <Route
          path="/tutor/TutorShortVideos"
          element={<Pages.TutorShortVideos />}
        />
        <Route
          path="/tutor/shortVideos/:id"
          element={<Pages.ShortVideoDetailsTutor />}
        />
        <Route
          path="/tutor/promo-codes"
          element={<Pages.TutorPromoCodes />}
        />
        <Route
          path="/tutor/promo-codes/active-promotions"
          element={<Pages.ActivePromotions />}
        />
        <Route
          path="/tutor/promo-codes/drafts"
          element={<Pages.Drafts />}
        />
        <Route
          path="/tutor/classes/details/:id"
          element={<Pages.ClassDetail />}
        />

        <Route path="/zoom-call/:id" element={<Pages.ZoomCall />} />
      </Route>
    </Routes>
  );
};

export default Routing;
