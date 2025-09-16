import { END_POINTS } from "../constants/url";
import {
  BookingDataResponse,
  BookingDetailsByIdResponse,
  BookingResponseData,
  CheckoutResponse,
  CMSData,
  PairingResponse,
  ParenBookingResponse,
} from "../types/General";
import emptySplitApi from "../utils/rtk";

type CommonResponseType = {
  statusCode: number;
  message: string;
};

interface TimeSlotBody {
  date: string; // ISO date string
  startTime: string | null; // ISO date string for start time
  endTime: string | null; // ISO date string for end time
  tutorId: string | undefined; // ID of the tutor
}

interface BookingBody {
  tutorId: string | undefined; // ID of the tutor
  subjectId: string[]; // ID of the subject
  parentAddressId?: string; // ID of the parent address
  distance?: any; // Distance in kilometers
  latitude?: number | undefined; // Latitude of the location
  longitude?: number | undefined; // Longitude of the location
  timeSlots: TimeSlotBody[]; // Array of time slots
}

export const bookingApi = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchTimeSlots: builder.query<
      CommonResponseType & { data: BookingDataResponse },
      { id: string }
    >({
      query: ({ id }) => ({
        url: `${END_POINTS.timeCheck}/${id}`,
        method: "GET",
      }),
      keepUnusedDataFor: 1,
      providesTags: (result, error, { id }) =>
        result ? [{ type: "Booking", id }] : [],
    }),
    addBooking: builder.mutation<
      CommonResponseType & { data: BookingResponseData },
      { body: BookingBody; isCartScreen: boolean }
    >({
      query: ({ body, isCartScreen }) => ({
        url: `${END_POINTS.booking}?isCartScreen=${isCartScreen}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Booking"],
    }),
    addBookingCheckout: builder.mutation<
      CommonResponseType & { data: CheckoutResponse },
      { isCartScreen: boolean; body: BookingBody }
    >({
      query: ({ isCartScreen, body }) => ({
        url: `${END_POINTS.booking}?isCartScreen=${isCartScreen}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Booking"],
    }),

    getParentBooking: builder.query<
      CommonResponseType & { data: ParenBookingResponse },
      { tab: number; page: number; limit: number }
    >({
      query: ({ tab, page, limit }) => ({
        url: `${END_POINTS.getBooking}?bookingType=${tab}&page=${page}&limit=${limit}`,
        method: "GET",
      }),
      keepUnusedDataFor: 1,
      providesTags: (result, error, { tab, page }) =>
        result ? [{ type: "Booking", tab, page }] : [],
    }),

    getBookingDetails: builder.query<
      CommonResponseType & { data: BookingDetailsByIdResponse },
      { Bookingid: string }
    >({
      query: ({ Bookingid }) => ({
        url: `${END_POINTS.getBooking}/${Bookingid}`,
        method: "GET",
      }),
      keepUnusedDataFor: 1,
      providesTags: (result, error, { Bookingid }) =>
        result ? [{ type: "Booking", Bookingid }] : [],
    }),

    cancelBooking: builder.mutation<
      CommonResponseType & { data: any },
      {
        id: string | undefined;
        body: {
          cancelReason: string;
        };
      }
    >({
      query: ({ id, body }) => ({
        url: `${END_POINTS.cancelBooking}/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Booking"],
    }),

    getPairing: builder.query<
      CommonResponseType & { data: PairingResponse },
      { page: number; bookingStatus: number; limit: number }
    >({
      query: ({ page, bookingStatus, limit }) => ({
        url: `${END_POINTS.getBooking}?page=${page}&bookingStatus=${bookingStatus}&limit=${limit}`,
        method: "GET",
      }),
      keepUnusedDataFor: 300,
      providesTags: (result, error, { page }) =>
        result ? [{ type: "Pairing", page }] : [],
    }),
    joinVideoCall: builder.mutation<
      CommonResponseType & { data: any },
      { bookingDetailId: string | undefined }
    >({
      query: (body) => ({
        url: END_POINTS.joinVideoCall,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
    
  useFetchTimeSlotsQuery,
  useAddBookingMutation,
  useAddBookingCheckoutMutation,
  useGetParentBookingQuery,
  useGetBookingDetailsQuery,
  useCancelBookingMutation,
  useGetPairingQuery,
  useJoinVideoCallMutation,
} = bookingApi;
