import { END_POINTS } from "../constants/url";
import {
  BankAccount,
  CommentEngagementType,
  Content,
  DocumentsList,
  EngagementType,
  TeachingProfile,
} from "../types/General";
import emptySplitApi from "../utils/rtk";

type CommonResponseType = {
  statusCode: number;
  message: string;
};

export const contentApi = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    createContent: builder.mutation<
      CommonResponseType & { data: any },
      Content | any
    >({
      query: (body) => ({
        url: `${END_POINTS.createContent}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["CONTENT"]
    }),
    updateContent: builder.mutation<
      CommonResponseType & { data: any },
      { body: Content | any; id: string }
    >({
      query: ({ body, id }) => ({
        url: `${END_POINTS.updateContent}/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["CONTENT"]
    }),
    getContent: builder.query<
      CommonResponseType & { data: any },
      { type?: number; contentType: number; page: number; limit: number, tutorId?: string, setting?: number, subjectId?: string, categoryId?: string, search?: string, grade?: string, following?: boolean }
    >({
      query: ({ type, page, contentType, limit, tutorId, setting, subjectId, categoryId, search, grade, following }) => ({
        url: `${END_POINTS.getContent}?page=${page}&limit=${limit}${type ? `&type=${type}` : ""}${contentType ? `&contentType=${contentType}` : ""}${setting ? `&setting=${setting}` : ""}${tutorId ? `&tutorId=${tutorId}` : ""}${subjectId ? `&subjectId=${subjectId}` : ""}${categoryId ? `&categoryId=${categoryId}` : ""}${search ? `&search=${search}` : ""}${grade ? `&grade=${grade}` : ""}${following ? `&following=${following}` : ""}&sortBy=1`,
        method: "GET",
      }),
      providesTags: ["CONTENT"],
    }),
    getContentById: builder.query<CommonResponseType & { data: any }, { id: string | any }>({
      query: ({ id }) => ({
        url: `${END_POINTS.getContentById}/${id}`,
        method: "GET",
      }),
      providesTags: ["CONTENT"],
    }),
    deleteContent: builder.mutation<
      CommonResponseType & { data: any },
      { id: string | any }
    >({
      query: ({ id }) => ({
        url: `${END_POINTS.deleteContent}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CONTENT"],
    }),

    engagement: builder.mutation<
      CommonResponseType & { data: any },
      EngagementType
    >({
      query: (body) => ({
        url: `${END_POINTS.engagement}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["CONTENT"],
    }),
    commentEngagement: builder.mutation<
      CommonResponseType & { data: any },
      CommentEngagementType
    >({
      query: (body) => ({
        url: `${END_POINTS.commentEngagement}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["CONTENT"],
    }),
    comments: builder.query<CommonResponseType & { data: any }, { id: string | any }>({
      query: ({ id }) => ({
        url: `${END_POINTS.comments}/${id}`,
        method: "GET",
      }),
      providesTags: ["CONTENT"]
    }),
    followTutor: builder.mutation<
      CommonResponseType & { data: any },
      {}
    >({
      query: (body) => ({
        url: `${END_POINTS.follow}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["CONTENT", 'Tutor', 'Parent'],
    }),

    getSavedContent: builder.query<CommonResponseType & { data: any }, { page: number, limit: number, contentType: number }>({
      query: ({ page, limit, contentType }) => ({
        url: `${END_POINTS.saveContent}?contentType=${contentType}&page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["CLASS", 'CONTENT']
    }),

    getSavedClass: builder.query<CommonResponseType & { data: any }, { page: number, limit: number }>({
      query: ({ page, limit }) => ({
        url: `${END_POINTS.saveClass}?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["CLASS", 'CONTENT']
    }),

    saveClass: builder.mutation<
      CommonResponseType & { data: any },
      { body: any }

    >({
      query: ({ body }) => ({
        url: `${END_POINTS.saveClass}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["CLASS", 'CONTENT'],
    }),

    reportContent: builder.mutation<
      CommonResponseType & { data: any },
      { body: any }

    >({
      query: ({ body }) => ({
        url: `${END_POINTS.reportContent}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ['CONTENT'],
    }),

    addPoll: builder.mutation<
      CommonResponseType & { data: any },
      { body: any }

    >({
      query: ({ body }) => ({
        url: `${END_POINTS.pollVote}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ['CONTENT'],
    }),

    pollResult: builder.query<CommonResponseType & { data: any }, {id:string}>({
      query: ({id}) => ({
        url: `${END_POINTS.pollResult}/${id}`,
        method: "GET",
      }),
      providesTags: [ 'CONTENT']
    }),

    usersListVoted: builder.query<CommonResponseType & { data: any }, {contentId:string}>({
      query: ({contentId}) => ({
        url: `${END_POINTS.usersVoted}?contentId=${contentId}`,
        method: "GET",
      }),
      providesTags: [ 'CONTENT']
    }),


  }),
});
export const {
  useLazyGetContentQuery,
  useGetContentQuery,
  useCommentEngagementMutation,
  useCommentsQuery,
  useEngagementMutation,
  useGetContentByIdQuery,
  useCreateContentMutation,
  useUpdateContentMutation,
  useDeleteContentMutation,
  useFollowTutorMutation,
  useGetSavedContentQuery,
  useGetSavedClassQuery,
  useSaveClassMutation,
  useReportContentMutation,
  useAddPollMutation,
  usePollResultQuery,
  useUsersListVotedQuery,

} = contentApi;
