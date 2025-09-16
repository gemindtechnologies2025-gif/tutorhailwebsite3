import { END_POINTS } from "../constants/url";
import emptySplitApi from "../utils/rtk";

type CommonResponseType = {
  statusCode: number;
  message: string;
};

export const socialLinkApi = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    getSocialLinks: builder.query<
      CommonResponseType & { data: any },
      {}
    >({
      query: () => ({
        url: `${END_POINTS.socialLinks}`,
        method: "GET",
      }),
      keepUnusedDataFor: 120,
      providesTags: ["SOCIAL"],
    }),

   

    
    addSocialLink: builder.mutation<CommonResponseType & { data: any }, {}>({
      query: (body) => ({
        url: `${END_POINTS.socialLinks}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["SOCIAL"],
    }),

    deleteSocialLink: builder.mutation<
      CommonResponseType & { data: any },
      { id: string }
    >({
      query: ({ id }) => ({
        url: `${END_POINTS.socialLinks}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SOCIAL"],
    }),

     getGifts: builder.query<
      CommonResponseType & { data: any },
      {id:string,page:number,limit:number}
    >({
      query: ({id,page,limit}) => ({
        url: `${END_POINTS.gifts}?contentId=${id}&page=${page}&limit=${limit}`,
        method: "GET",
      }),
    }),

  }),
});

export const {
    useGetSocialLinksQuery,
    useAddSocialLinkMutation,
    useDeleteSocialLinkMutation,
    useGetGiftsQuery
} = socialLinkApi;
