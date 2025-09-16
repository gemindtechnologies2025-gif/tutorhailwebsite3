import { END_POINTS } from "../constants/url";
import { Address, AddressResponse } from "../types/General";

import emptySplitApi from "../utils/rtk";

type CommonResponseType = {
  statusCode: number;
  message: string;
};
type DeleteAddressRes = {
  location: {
    type: string;
    coordinates: [number, number];
  };
  parentId: string;
  houseNumber: string;
  landMark: string;
  streetAddress: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  isDeleted: boolean;
  addressType: number;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  id: string;
};
export const addressApi = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    addAddress: builder.mutation<
      CommonResponseType & { data: any },
      { body: any }
    >({
      query: ({ body }) => ({
        url: END_POINTS.addAddress,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Address"],
    }),

    getAddress: builder.query<
      CommonResponseType & { data: AddressResponse },
      { name?: string }
    >({
      query: () => ({
        url: `${END_POINTS.getAddress}`,
        method: "GET",
      }),
      keepUnusedDataFor: 1,
      providesTags: ["Address"],
    }),

    deleteAddress: builder.mutation<
      CommonResponseType & { data: DeleteAddressRes },
      { id: string }
    >({
      query: ({ id }) => ({
        url: `${END_POINTS.deleteAddress}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Address"],
    }),

    getAddressById: builder.query<
      CommonResponseType & { data: Address },
      { id: string }
    >({
      query: ({ id }) => ({
        url: `${END_POINTS.getAddress}/${id}`,
        method: "GET",
      }),
      keepUnusedDataFor: 1,
      providesTags: (result, error, { id }) =>
        result ? [{ type: "Address", id }] : [],
    }),
    updateAddress: builder.mutation<
      CommonResponseType & { data: any },
      { body: any; id: string }
    >({
      query: ({ body, id }) => ({
        url: `${END_POINTS.updateAddress}/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Address"],
    }),
  }),
});

export const {
  useAddAddressMutation,
  useGetAddressQuery,
  useDeleteAddressMutation,
  useGetAddressByIdQuery,
  useUpdateAddressMutation,
} = addressApi;
