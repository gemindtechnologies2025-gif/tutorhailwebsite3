import { END_POINTS } from "../constants/url";
import { ChatData, chatHistoryResponse } from "../types/General";

import emptySplitApi from "../utils/rtk";

type CommonResponseType = {
  statusCode: number;
  message: string;
};

export const chatApi = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    getChatList: builder.query<
      CommonResponseType & { data: ChatData },
      { page: number }
    >({
      query: ({ page }) => ({
        url: `${END_POINTS.chatList}?page=${page}`,
        method: "GET",
      }),
      keepUnusedDataFor: 1,
      providesTags: (result, error, { page }) =>
        result ? [{ type: "ChatList", page }] : [],
    }),
    getChatHistory: builder.query<
      CommonResponseType & { data: chatHistoryResponse },
      { page: number; connectionId: string }
    >({
      query: ({ page, connectionId }) => ({
        url: `${END_POINTS.chating}/${connectionId}?page=${page}&limit=${20}`,
        method: "GET",
      }),
    }),
    reportChat: builder.mutation<
      CommonResponseType & { data: chatHistoryResponse },
      {}
    >({
      query: (body) => ({
        url: `${END_POINTS.blockReportChat}`,
        method: "POST",
        body,
      }),
    }),
    chatNotCount: builder.query<CommonResponseType & { data: any }, {}>({
      query: () => ({
        url: `${END_POINTS.iconCount}`,
        method: "GET",
      }),
    }),
    agreeChat: builder.mutation<CommonResponseType & { data: any }, {}>({
      query: (body) => ({
        url: `${END_POINTS.agreeChat}`,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetChatListQuery,
  useLazyGetChatListQuery,
  useLazyGetChatHistoryQuery,
  useReportChatMutation,
  useChatNotCountQuery,
  useAgreeChatMutation,
} = chatApi;
