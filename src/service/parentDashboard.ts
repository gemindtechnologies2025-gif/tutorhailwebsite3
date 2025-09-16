import { END_POINTS } from "../constants/url";
import {
  CurrentBooking,
  MaterialResponse,
  ParentDashBoardResponse,
  SearchData,
  Subject,
  TutorFilterResponse,
} from "../types/General";

import emptySplitApi from "../utils/rtk";

type CommonResponseType = {
  statusCode: number;
  message: string;
};

export const ParentDashBoardApi = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    getPopularTutor: builder.query<
      CommonResponseType & { data: ParentDashBoardResponse },
      { limit: number }
    >({
      query: ({ limit }) => ({
        url: `${END_POINTS.DashBoard}?limit=${limit}`,
        method: "GET",
      }),
      keepUnusedDataFor: 1, // Cache data for 5 minutes (300 seconds)
      providesTags: ["Parent"],
    }),

    getCurrentBooking: builder.query<
      CommonResponseType & { data: CurrentBooking },
      {}
    >({
      query: ({}) => ({
        url: `${END_POINTS.homepage}`,
        method: "GET",
      }),
    }),
    getSubjects: builder.query<CommonResponseType & { data: Subject[] }, void>({
      query: () => ({
        url: `${END_POINTS.subject}`,
        method: "GET",
      }),
      keepUnusedDataFor: 1, // Cache data for 5 minutes (300 seconds)
      providesTags: ["Subjects"],
    }),

    getSearchQuery: builder.query<
      CommonResponseType & { data: SearchData },
      { query: string }
    >({
      query: ({ query }) => ({
        url: `${END_POINTS.search}?search=${query}`,
        method: "GET",
      }),
    }),

    getPopularTutorListing: builder.query<
      CommonResponseType & { data: TutorFilterResponse },
      { limit: number; page: number }
    >({
      query: ({ limit, page }) => ({
        url: `${END_POINTS.popularTutor}?limit=${limit}&page=${page}`,
        method: "POST",
      }),
      keepUnusedDataFor: 1,
      providesTags: ["PopularTutor", "WISHLIST"],
    }),
    getRecommendedTutorListing: builder.mutation<
      CommonResponseType & { data: TutorFilterResponse },
      { limit: number; page: number; body: any }
    >({
      query: ({ limit, page, body }) => ({
        url: `${END_POINTS.recommendedTutor}?limit=${limit}&page=${page}`,
        method: "POST",
        body,
      }),
      // providesTags:["WISHLIST"]
    }),

    getStudyMaterial: builder.query<
      CommonResponseType & { data: MaterialResponse },
      {page:number,limit?:number}
    >({
      query: ({page,limit}) => ({
        url: `${END_POINTS.studyMaterial}?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      keepUnusedDataFor: 300,
      providesTags: ["STUDYMATERIAL"],
    }),

    postReviews: builder.mutation<CommonResponseType & { data: any }, any>({
      query: (body) => ({
        url: `${END_POINTS.addRating}`,
        method: "POST",
        body,
      }),
    }),

    getAllTypeTutor: builder.query<
      CommonResponseType & { data: any },
      { limit: number; page: number; type: number,body?:any }
    >({
      query: ({ limit, page, type,body }) => ({
        url: `${END_POINTS.tutor}?limit=${limit}&page=${page}&type=${type}`,
        method: "POST",
        body:body
      }),
      keepUnusedDataFor: 120,
      providesTags: ["PopularTutor", "WISHLIST"],
    }),

    
  }),
});
export const {
  useGetPopularTutorQuery,
  useGetCurrentBookingQuery,
  useLazyGetSubjectsQuery,
  useGetSubjectsQuery,
  useGetSearchQueryQuery,
  useGetPopularTutorListingQuery,
  useGetRecommendedTutorListingMutation,
  useGetStudyMaterialQuery,
  usePostReviewsMutation,
  useGetAllTypeTutorQuery,
} = ParentDashBoardApi;
