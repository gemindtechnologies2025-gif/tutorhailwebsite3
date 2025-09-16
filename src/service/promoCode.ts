import { END_POINTS } from "../constants/url";
import emptySplitApi from "../utils/rtk";

type CommonResponseType = {
  statusCode: number;
  message: string;
};

export const PromoCodeApi = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    getPromoCodes: builder.query<
      CommonResponseType & { data: any },
      { page?: number; limit?: number; setting: number }
    >({
      query: ({ page, limit, setting }) => ({
        url: `${END_POINTS.getPromocode}?page=${page}&limit=${limit}&setting=${setting}`,
        method: "GET",
      }),
      keepUnusedDataFor: 120,
      providesTags: ["PROMO_CODE"],
    }),

    getPromoCodeListWithoutPagination: builder.query<
      CommonResponseType & { data: any },
      {}
    >({
      query: () => ({
        url: `${END_POINTS.promocodeList}`,
        method: "GET",
      }),
      keepUnusedDataFor: 120,
      providesTags: ["PROMO_CODE"],
    }),

    getPromoDashboard: builder.query<CommonResponseType & { data: any }, {}>({
      query: () => ({
        url: `${END_POINTS.promoDetails}`,
        method: "GET",
      }),
      keepUnusedDataFor: 120,
      providesTags: ["PROMO_CODE"],
    }),

    addPromoCode: builder.mutation<CommonResponseType & { data: any }, {}>({
      query: (body) => ({
        url: `${END_POINTS.addPromocode}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["PROMO_CODE"],
    }),

    getPromoById: builder.query<
      CommonResponseType & { data: any },
      { id: string | any }
    >({
      query: ({ id }) => ({
        url: `${END_POINTS.getPromocode}/${id}`,
        method: "GET",
      }),
      keepUnusedDataFor: 120,
      providesTags: ["PROMO_CODE"],
    }),

    deletePromoById: builder.mutation<
      CommonResponseType & { data: any },
      { id: string }
    >({
      query: ({ id }) => ({
        url: `${END_POINTS.deletePromoCode}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PROMO_CODE"],
    }),

    updatePromoById: builder.mutation<
      CommonResponseType & { data: any },
      { id: string; body: any }
    >({
      query: ({ id, body }) => ({
        url: `${END_POINTS.updatePromoCode}/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["PROMO_CODE"],
    }),
    getPromoCodeParent: builder.query<
      CommonResponseType & { data: any },
      { classId?: string,tutorId?: string }
    >({
      query: ({ classId,tutorId }) => ({
        url: `${END_POINTS.promocode}${classId ? `?classId=${classId}`:""}${tutorId ? `?tutorId=${tutorId}`:""}`,
        method: "GET",
      }),
      keepUnusedDataFor: 120,
    }),
  }),
});

export const {
  useGetPromoCodesQuery,
  useGetPromoCodeListWithoutPaginationQuery,
  useGetPromoDashboardQuery,
  useAddPromoCodeMutation,
  useGetPromoByIdQuery,
  useDeletePromoByIdMutation,
  useUpdatePromoByIdMutation,
  useGetPromoCodeParentQuery,
} = PromoCodeApi;
