import { END_POINTS } from "../constants/url";
import {
  BookingResponseData,
} from "../types/General";
import emptySplitApi from "../utils/rtk";

type CommonResponseType = {
  statusCode: number;
  message: string;
};



export const ClassApi = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    getClassesForParent: builder.query<
      CommonResponseType & { data: any },
      { page?: number, limit?: number, tutorId?: string | any, type?: number, canBePrivate?: boolean, search?: string, subjectId?: string, sortBy?: string, classMode?: string, language?: string,isFreeLesson?:boolean }
    >({
      query: ({ page, limit, tutorId, type, canBePrivate, search, subjectId, sortBy, classMode, language ,isFreeLesson}) => ({
        url: `${END_POINTS.getClass}?page=${page}&limit=${limit}${type ? `&type=${type}` : ""}${tutorId ? `&tutorId=${tutorId}` : ""}${canBePrivate ? `&canBePrivate=true:` : ``}${search ? `&search=${search}` : ``}${subjectId ? `&subjectId=${subjectId}` : ""}${sortBy ? `&sortBy=${sortBy}` : ""}${classMode ? `&classMode=${classMode}` : ""}${language ? `&language=${language}` : ""}${isFreeLesson ? `&isFreeLesson=${isFreeLesson}` : ""}`,
        method: "GET",
      }),
      keepUnusedDataFor: 120,
      providesTags: ['CLASS']
    }),

    getClassesForTutor: builder.query<
      CommonResponseType & { data: any },
      { page?: number, limit?: number, setting: number, canBePrivate?: boolean }
    >({
      query: ({ page, limit, setting, canBePrivate }) => ({
        url: `${END_POINTS.getClass}?page=${page}&limit=${limit}&setting=${setting}&canBePrivate=${canBePrivate ? 'true' : ""}`,
        method: "GET",
      }),
      keepUnusedDataFor: 120,
      providesTags: ['CLASS']
    }),


    addClass: builder.mutation<
      CommonResponseType & { data: BookingResponseData },
      {}
    >({
      query: (body) => ({
        url: `${END_POINTS.createClass}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["CLASS"],
    }),


    getClassesById: builder.query<
      CommonResponseType & { data: any },
      { id: string | any }
    >({
      query: ({ id }) => ({
        url: `${END_POINTS.getClass}/${id}`,
        method: "GET",
      }),
      keepUnusedDataFor: 120,
      providesTags: ['CLASS']
    }),

    deleteClassById: builder.mutation<
      CommonResponseType & { data: any },
      { id: string }
    >({
      query: ({ id }) => ({
        url: `${END_POINTS.deleteClass}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ['CLASS']
    }),


    updateClassById: builder.mutation<
      CommonResponseType & { data: any },
      { id: string, body: any }
    >({
      query: ({ id, body }) => ({
        url: `${END_POINTS.updateClass}/${id}`,
        method: "PUT",
        body
      }),
      invalidatesTags: ['CLASS']
    }),

    updateClassSlotsById: builder.mutation<
      CommonResponseType & { data: any },
      { body: any }
    >({
      query: ({ body }) => ({
        url: `${END_POINTS.classSlots}`,
        method: "PUT",
        body
      }),
      invalidatesTags: ['CLASS']
    }),

    bookClass: builder.mutation<
      CommonResponseType & { data: any },
      { isCartScreen?: boolean, body: any }
    >({
      query: ({ body, isCartScreen }) => ({
        url: `${END_POINTS.classBook}${isCartScreen ? `?isCartScreen=true` : "?isCartScreen=false"}`,
        method: "POST",
        body,
      }),

    }),

    getBookedClass: builder.query<
      CommonResponseType & { data: any },
      { classModeOnline?: boolean, date?: any, page: number, limit: number }
    >({
      query: ({ classModeOnline, date, page, limit }) => ({
        url: `${END_POINTS.classBook}?page=${page}&limit=${limit}${classModeOnline ? `&classModeOnline=true` : ""}${date ? `&date=${date}` : ""}`,
        method: "GET",
      }),
    }),

    reportClass: builder.mutation<
      CommonResponseType & { data: any },
      {}
    >({
      query: ( body ) => ({
        url: `${END_POINTS.reportClass}`,
        method: "POST",
        body,
      }),

    }),

    acceptCoTutorClass: builder.mutation<
      CommonResponseType & { data: any },
      {}
    >({
      query: ( body ) => ({
        url: `${END_POINTS.coTutorStatus}`,
        method: "POST",
        body,
      }),

    }),





  }),
});

export const {
  useGetClassesForParentQuery,
  useGetClassesForTutorQuery,
  useGetClassesByIdQuery,
  useUpdateClassByIdMutation,
  useDeleteClassByIdMutation,
  useAddClassMutation,
  useUpdateClassSlotsByIdMutation,
  useGetBookedClassQuery,
  useBookClassMutation,
  useReportClassMutation,
  useAcceptCoTutorClassMutation

} = ClassApi;
