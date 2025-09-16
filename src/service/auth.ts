import { END_POINTS } from "../constants/url";
import { Login, ResetPassword, SignUpType, UpdateProfile, VerifyOtp } from "../types/General";
import { User } from "../types/User";
import emptySplitApi from "../utils/rtk";


type CommonResponseType = {
    statusCode: number;
    message: string;
};
interface LinkedinAuthResponse {
    sub: string;
    email_verified: boolean;
    name: string;
    locale: {
      country: string;
      language: string;
    };
    given_name: string;
    family_name: string;
    email: string;
    picture: string;
  }

export const authApi = emptySplitApi.injectEndpoints({
    endpoints: (builder) => ({
        postLogIn: builder.mutation<
            CommonResponseType & { data: User },
            Login
        >({
            query: (body) => ({
                url: END_POINTS.login,
                method: "POST",
                body,
            }),
        }),
        postSignUp: builder.mutation<
            CommonResponseType & { data: User },
            SignUpType
        >({
            query: (body) => ({
                url: END_POINTS.signup,
                method: "POST",
                body,
            }),
        }),
        getUser: builder.query<CommonResponseType & { data: User }, {}>({
            query: () => ({
                url: END_POINTS.get_user,
                method: "GET",
            }),
        }),
        postLogout: builder.mutation<CommonResponseType & { data: any }, {}>({
            query: () => ({
                url: END_POINTS.logout,
                method: "GET",
            }),
        }),
        forgotPassword: builder.mutation<CommonResponseType & { data: any }, { email: string, type: number }>({
            query: (body) => ({
                url: END_POINTS.forgotPassword,
                method: "POST",
                body,
            }),
        }),
        postVerifyOtp: builder.mutation<
            CommonResponseType & { data: User },
            VerifyOtp
        >({
            query: (body) => ({
                url: END_POINTS.verifyOtp,
                method: "POST",
                body,
            }),
        }),
        resetPassword: builder.mutation<CommonResponseType & { data: any }, { newPassword: string }>({
            query: (body) => ({
                url: END_POINTS.resetPassword,
                method: "POST",
                body,
            }),
        }),
        UpdateProfile: builder.mutation<
            CommonResponseType & { data: any },
            UpdateProfile
        >({
            query: (body) => ({
                url: END_POINTS.updateProfile,
                method: "PUT",
                body,
            }),
        }),
        postChangePassword: builder.mutation<CommonResponseType, any>({
            query: (body) => ({
                url: END_POINTS.changePassword,
                method: "PUT",
                body,
            }),
        }),
        resendOtp: builder.mutation<CommonResponseType, ResetPassword>({
            query: (body) => ({
                url: END_POINTS.sendOtp,
                method: "POST",
                body,
            }),
        }),
        postSocialLogin: builder.mutation<
            CommonResponseType & { data: User },
            any
        >({
            query: (body) => ({
                url: END_POINTS.socialLogin,
                method: "POST",
                body,
            }),
        }),

        getLinkedInToken:builder.mutation<
        CommonResponseType & {data:LinkedinAuthResponse},{body:any}>({
            query:({body})=>({
                url:`${END_POINTS.linkedinLogin}`,
                method:"POST",
                body
            })
        }),
        deleteAccount: builder.mutation<CommonResponseType & { data: any }, {}>({
            query: () => ({
                url: END_POINTS.deleteProfile,
                method: "DELETE",
            }),
        }),
         getSubjectsAndCategory: builder.query<CommonResponseType & { data: any }, {
            type:number,categoryId?:string,tutorId?:string
         }>({
            query: ({type,categoryId,tutorId}) => ({
                url:`${END_POINTS.catSubList}?type=${type}${categoryId ? `&categoryId=${categoryId}`:""}${tutorId ? `&tutorId=${tutorId}`:""}`,
                method: "GET",
            }),
        }),
        getSubjectListing:builder.mutation<
        CommonResponseType & {data:any},{body:any,search?:string}>({
            query:({body,search})=>({
                url:`${END_POINTS.subjectList}?search=${search}`,
                method:"POST",
                body
            })
        }),


    }),
});

export const {
    usePostLogInMutation,
    usePostSignUpMutation,
    useLazyGetUserQuery,
    usePostLogoutMutation,
    useForgotPasswordMutation,
    usePostVerifyOtpMutation,
    useResetPasswordMutation,
    useUpdateProfileMutation,
    usePostChangePasswordMutation,
    useResendOtpMutation,
    usePostSocialLoginMutation,
    useGetLinkedInTokenMutation,
    useDeleteAccountMutation,
    useLazyGetSubjectsAndCategoryQuery,
    useGetSubjectListingMutation
} = authApi;
