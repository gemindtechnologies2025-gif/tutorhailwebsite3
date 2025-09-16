import { END_POINTS } from "../constants/url";
import { TutorDetailsById, TutorFilterResponse } from "../types/General";

import emptySplitApi from "../utils/rtk";

type CommonResponseType = {
  statusCode: number;
  message: string;
};

type Booking = {
  bookingStatus: number | null;
  cancelReason: string;
};

type AcceptBooking = {
  bookingId: string;
  pairingType: number;
  bookingDetailId: string;
};

type Study = {
  bookingId: string;
  bookingDetailId: string;
  title: string;
  description: string;
  content: string;
};

export const TutorApi = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    getTutorById: builder.query<
      CommonResponseType & { data: TutorDetailsById[] },
      { id: string | any }
    >({
      query: ({ id }) => ({
        url: `${END_POINTS.tutor}/${id}`,
        method: "GET",
      }),
      keepUnusedDataFor: 1,
      providesTags: (result, error, { id }) =>
        result ? [{ type: "Tutor", id }] : [],
    }),

    getFilteredTutor: builder.query<
      CommonResponseType & { data: TutorFilterResponse },
      { page: number; body: any; limit: number }
    >({
      query: ({ page, body, limit }) => ({
        url: `${END_POINTS.popularTutor}?limit=${limit}&page=${page}`,
        method: "POST",
        body,
      }),
    }),

    getTutorDashboard: builder.query<
      CommonResponseType & { data: any },
      { type: string }
    >({
      query: ({ type }) => ({
        url: `${END_POINTS.DashBoard}?type=${type}`,
        method: "GET",
      }),
    }),
    PostTutorWithdraw: builder.mutation<
      CommonResponseType & { data: any },
      { body: any }
    >({
      query: ({ body }) => ({
        url: `${END_POINTS.withdraw}`,
        method: "POST",
        body,
      }),
    }),
    getBookings: builder.query<
      CommonResponseType & { data: any },
      { bookingType?: any; bookingStatus?: any; page: any }
    >({
      query: ({ bookingType, page, bookingStatus }) => ({
        url: `${END_POINTS.getBooking}?page=${page}&limit=12${bookingStatus ? `&bookingStatus=${bookingStatus}` : ""}${bookingType ? `&bookingType=${bookingType}` : ""}`,
        method: "GET",
      }),
    }),
    getBookingById: builder.query<CommonResponseType & { data: any }, any>({
      query: (id) => ({
        url: `${END_POINTS.getBooking}/${id}`,
        method: "GET",
      }),
    }),

    updateBooking: builder.mutation<
      CommonResponseType & { data: any },
      {
        bookingId: string | undefined;
        body: Booking;
      }
    >({
      query: ({ bookingId, body }) => ({
        url: `${END_POINTS.updateBooking}/${bookingId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Booking", "Pairing"],
    }),

    acceptBooking: builder.mutation<
      CommonResponseType & { data: any },
      AcceptBooking
    >({
      query: (body) => ({
        url: `${END_POINTS.pairingOtp}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Booking", "Pairing"],
    }),

    jobStatus: builder.mutation<
      CommonResponseType & { data: any },
      { body: any }
    >({
      query: ({ body }) => ({
        url: END_POINTS.verifyPairingOtp,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Booking", "Pairing"],
    }),

    // upload study material
    uploadStudyMat: builder.mutation<CommonResponseType & { data: any }, Study>(
      {
        query: (body) => ({
          url: END_POINTS.contentMaterial,
          method: "POST",
          body,
        }),
      }
    ),

    deleteStudyMat: builder.mutation<CommonResponseType, { id: string }>({
      query: ({ id }) => ({
        url: `${END_POINTS.contentMaterial}/${id}`,
        method: "DELETE",
      }),
    }),

    //reviews

    getReviews: builder.query<CommonResponseType & { data: any }, {}>({
      query: () => ({
        url: `${END_POINTS.reviews}`,
        method: "GET",
      }),
    }),

    //notifications
    getNotifications: builder.query<CommonResponseType & { data: any }, {page:number,limit:number}>({
      query: ({page,limit}) => ({
        url: `${END_POINTS.notification}?page=${page}&limit=${limit}`,
        method: "GET",
      }),
    }),

    getQualifiedTutor: builder.query<
      CommonResponseType & { data: TutorFilterResponse },
      {}
    >({
      query: () => ({
        url: `${END_POINTS.homepageTutor}`,
        method: "GET",
      }),
      keepUnusedDataFor: 1,
    }),
    joinVideoCall: builder.mutation<CommonResponseType & { data: any }, { bookingDetailId: string | undefined; }>(
      {
        query: (body) => ({
          url: END_POINTS.joinVideoCall,
          method: "POST",
          body,
        }),
      }
    ),


    getClassList: builder.query<CommonResponseType & { data: any }, { type: any }>({
      query: ({ type }) => ({
        url: `${END_POINTS.subClassList}?type=${type}`,
        method: "GET",
      }),
    }),
    getTutorList: builder.query<CommonResponseType & { data: any }, {}>({
      query: () => ({
        url: `${END_POINTS.tutorList}`,
        method: "GET",
      }),
    }),
    getFollowers: builder.query<CommonResponseType & { data: any }, { limit: number, page: number }>({
      query: ({ page, limit }) => ({
        url: `${END_POINTS.followers}?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      keepUnusedDataFor: 300,
    }),
    getViewers: builder.query<CommonResponseType & { data: any }, { limit: number, page: number }>({
      query: ({ page, limit }) => ({
        url: `${END_POINTS.viewers}?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      keepUnusedDataFor: 300,
    }),
  }),

});
export const {
  useGetTutorByIdQuery,
  useLazyGetFilteredTutorQuery,
  useLazyGetTutorDashboardQuery,
  usePostTutorWithdrawMutation,
  useLazyGetBookingsQuery,
  useGetBookingsQuery,
  useLazyGetBookingByIdQuery,
  useUpdateBookingMutation,
  useAcceptBookingMutation,
  useJobStatusMutation,
  useUploadStudyMatMutation,
  useDeleteStudyMatMutation,
  useLazyGetReviewsQuery,
  useLazyGetNotificationsQuery,
  useLazyGetQualifiedTutorQuery,
  useJoinVideoCallMutation,
  useGetClassListQuery,
  useGetTutorListQuery,
  useGetFollowersQuery,
  useGetViewersQuery

} = TutorApi;
