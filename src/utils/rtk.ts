//@ts-ignoreS
import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

import store, { type RootState } from "../app/store";
import { generateEncryptedKeyBody, generateSEKAndHash } from "./crypto";
import { resetAuth } from "../reducers/authSlice";
import { API_URL, REDIRECTLINK } from "../constants/url";
import { getFromStorage, removeFromStorage, setToStorage } from "../constants/storage";
import { STORAGE_KEYS } from "../constants/storageKeys";
import { useAppDispatch } from "../hooks/store";
import { toast } from "sonner";
import { showToast } from "../constants/toast";

type CommonBody = {
  hash: string;
  sek: string;
};

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers, { getState }) => {
    let { token } = (getState() as RootState).auth;
    if (!token) {
      token = getFromStorage(STORAGE_KEYS.token) as string;
    }
    const { tempToken } = (getState() as RootState).auth;
    const encryptData = generateSEKAndHash(token || tempToken || null);
    const fcmToken = getFromStorage(STORAGE_KEYS.fcmToken);
    if (encryptData) {
      headers.set("hash", encryptData?.hash);
      headers.set("sek", encryptData?.sek);
      headers.set("deviceType", "WEB");
      headers.set("deviceToken", fcmToken as string);
    }
   

    return headers;
  },
});

const baseQueryWithAuth: BaseQueryFn<
  string | FetchArgs | any,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const role = await getFromStorage(STORAGE_KEYS.roleName);
  
  let roleName = window.location.pathname==REDIRECTLINK ||  window.location.pathname?.includes('auth') ? role : window.location.pathname.split("/")?.[1];
    setToStorage(STORAGE_KEYS.roleName,roleName)
  if (roleName !== "tutor" && roleName !== "parent") {
    roleName =
      window.location.pathname.split("/")?.[2] == "as-tutor"
        ? "tutor"
        : "parent";
  }

  // const { roleName } = (api.getState() as RootState).auth;

  // let roleName="parent"
  //  console.log((api.getState() as RootState).auth, "roleName");

  if (args?.body) {
    const encryptedData = generateEncryptedKeyBody(args?.body) as CommonBody;

    if (encryptedData) {
      args.body = encryptedData;
    } else {
      return {
        error: {
          status: 400,
          data: { detail: "Failed to encrypt request body" },
        },
      };
    }
  }

  const data = args?.body
    ? {
      body: args?.body,
      method: args.method,
      url:
        role === "parent"
          ? `Parent/${args.url}`
          : role === "tutor"
            ? `Tutor/${args.url}`
            : `Parent/${args.url}`,
    }
    : {
      method: args?.method,
      url:
        role === "parent"
          ? `Parent/${args.url}`
          : role === "tutor"
            ? `Tutor/${args.url}`
            : `Parent/${args.url}`,
    };
  const result = await baseQuery(data, api, extraOptions);
  // if (result?.error?.status === 400) {
  //   const errors = Object.values(result?.error?.data || {});
  //   //    console.log({ errors });
  //   if (errors?.length > 1 && errors[1] === 400) {
  //     return result;
  //   }

  //   if (errors?.length) {
  //     const error = errors[0] as any;
  //     if (error?.length) {
  //       //        console.log(error[0]);
  //     }
  //   }
  // }

  if (result.error?.status === 401) {
    api.dispatch(resetAuth());
    if (window) {
      window.location.replace("/");
      removeFromStorage(STORAGE_KEYS.token);
      removeFromStorage(STORAGE_KEYS.user);
    }
  }

  // if (result.error?.status === "FETCH_ERROR") {
  //   if (window) {
  //     window.location.replace("/server-maintenance");
  //   }
  // }

  if (result?.error?.status === 429) {
    toast.dismiss();
    toast.error(result?.error?.status || "");
  }

  return result;
};

const emptySplitApi = createApi({
  baseQuery: baseQueryWithAuth,
  tagTypes: [
    "UNAUTHORIZED",
    "UNKNOWN_ERROR",
    "Parent",
    "Subjects",
    "Address",
    "Tutor",
    "Booking",
    "PopularTutor",
    "RecommendedTutor",
    "Pairing",
    "ChatList",
    "STUDYMATERIAL",
    "WISHLIST",
    "CONTENT",
    "COMMENT",
    "CLASS",
    "PROMO_CODE",
    "INQUIRY",
    "SOCIAL"
  ],
  endpoints: () => ({}),
});

export default emptySplitApi;
//changes for  build
