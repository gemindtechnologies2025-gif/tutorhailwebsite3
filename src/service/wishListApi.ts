import { END_POINTS } from "../constants/url";
import { wishListResponse } from "../types/General";

import emptySplitApi from "../utils/rtk";

type CommonResponseType = {
  statusCode: number;
  message: string;
};

export const wishListApi = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({

    addWishList:builder.mutation<
    CommonResponseType & {data:any},{body:any}>({
        query:({body})=>({
            url:`${END_POINTS.addWishlist}`,
            method:"POST",
            body
        }),
        invalidatesTags:["PopularTutor","RecommendedTutor","Tutor" ,"WISHLIST"]
    }),

    getWishList:builder.query<
    CommonResponseType & {data:wishListResponse},void
    >({
        query:()=>({
            url:`${END_POINTS.getWishlist}`,
            method:"GET"
        }),
        keepUnusedDataFor:3,
        providesTags:["WISHLIST"]
    })

  }),
});

export const {useAddWishListMutation,useGetWishListQuery} = wishListApi;
