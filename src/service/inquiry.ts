import { END_POINTS } from "../constants/url";
import emptySplitApi from "../utils/rtk";

type CommonResponseType = {
  statusCode: number;
  message: string;
};

export const InquiryApi = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    getInquiries: builder.query<
      CommonResponseType & { data: any },
      { page?: number; limit?: number }
    >({
      query: ({ page, limit }) => ({
        url: `${END_POINTS.inquiry}?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      keepUnusedDataFor: 120,
      providesTags: ["INQUIRY"],
    }),

    getInquiryById: builder.query<CommonResponseType & { data: any }, {}>({
      query: () => ({
        url: `${END_POINTS.inquiry}`,
        method: "GET",
      }),
      keepUnusedDataFor: 120,
      providesTags: ["INQUIRY"],
    }),

    addInquiry: builder.mutation<CommonResponseType & { data: any }, {}>({
      query: (body) => ({
        url: `${END_POINTS.inquiry}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["INQUIRY"],
    }),

    addTutorReport: builder.mutation<CommonResponseType & { data: any }, {}>({
      query: (body) => ({
        url: `${END_POINTS.tutorReport}`,
        method: "POST",
        body,
      }),
    }),

    revertInqueryByTutor: builder.mutation<
      CommonResponseType & { data: any },
      { body: any }
    >({
      query: ({ body }) => ({
        url: `${END_POINTS.inquiryRevert}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["INQUIRY"],
    }),
  }),
});

export const {
  useGetInquiriesQuery,
  useGetInquiryByIdQuery,
  useAddInquiryMutation,
  useAddTutorReportMutation,
  useRevertInqueryByTutorMutation,
} = InquiryApi;
