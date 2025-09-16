import { END_POINTS } from "../constants/url";
import { BankAccount, DocumentsList, TeachingProfile } from "../types/General";
import emptySplitApi from "../utils/rtk";


type CommonResponseType = {
    statusCode: number;
    message: string;
};


export const tutorProfileApi = emptySplitApi.injectEndpoints({
    endpoints: (builder) => ({
        //bank details 
        postBank: builder.mutation<
            CommonResponseType & { data: any }, BankAccount>({
                query: (body) => ({
                    url: `${END_POINTS.addBank}`,
                    method: "POST",
                    body
                })
            }),
        updateBank: builder.mutation<
            CommonResponseType & { data: any }, { body: BankAccount, id: string }>({
                query: ({ body, id }) => ({
                    url: `${END_POINTS.updateBank}/${id}`,
                    method: "PUT",
                    body
                })
            }),
        getBank: builder.query<
            CommonResponseType & { data: any }, {}>({
                query: (body) => ({
                    url: `${END_POINTS.getBank}`,
                    method: "GET",
                })
            }),
        deleteBank: builder.query<
            CommonResponseType & { data: any }, { id: string }>({
                query: (id) => ({
                    url: `${END_POINTS.deleteBank}`,
                    method: "DELETE",
                })
            }),

        //teaching details
        postTeachingDetails: builder.mutation<
            CommonResponseType & { data: any }, {}>({
                query: (body) => ({
                    url: `${END_POINTS.teachingDetails}`,
                    method: "POST",
                    body
                })
            }),
        editTeachingDetails: builder.mutation<
            CommonResponseType & { data: any }, { body: any, id: string }>({
                query: ({ body, id }) => ({
                    url: `${END_POINTS.teachingDetails}/${id}`,
                    method: "PUT",
                    body
                })
            }),
        getTeachingDetails: builder.query<
            CommonResponseType & { data: any }, {}>({
                query: (body) => ({
                    url: `${END_POINTS.getTeachingDetails}`,
                    method: "GET",
                })
            }),
        deleteTeachingDetails: builder.query<
            CommonResponseType & { data: any }, { id: string }>({
                query: (id) => ({
                    url: `${END_POINTS.deleteTeachingDetails}`,
                    method: "DELETE",
                })
            }),
        deleteSubjectDetails: builder.query<
            CommonResponseType & { data: any }, { id: string }>({
                query: (id) => ({
                    url: `${END_POINTS.deleteSubjectDetails}`,
                    method: "DELETE",
                })
            }),

        //documents
        postDocs: builder.mutation<
            CommonResponseType & { data: any }, any>({
                query: (body) => ({
                    url: `${END_POINTS.addDocuments}`,
                    method: "POST",
                    body
                })
            }),
        updateDocs: builder.mutation<
            CommonResponseType & { data: any }, { body: any, id: string }>({
                query: ({ body, id }) => ({
                    url: `${END_POINTS.updateDocuments}/${id}`,
                    method: "PUT",
                    body
                })
            }),
        getDocs: builder.query<
            CommonResponseType & { data: any }, { documentType: number }>({
                query: ({ documentType }) => ({
                    url: `${END_POINTS.getDocuments}?documentType=${documentType}`,
                    method: "GET",
                })
            }),
        deleteDocs: builder.query<
            CommonResponseType & { data: any }, { id: string }>({
                query: (id) => ({
                    url: `${END_POINTS.deleteDocuments}`,
                    method: "DELETE",
                })
            }),



    }),

});

export const {
    usePostBankMutation,
    useUpdateBankMutation,
    useLazyGetBankQuery,
    useLazyDeleteBankQuery,

    usePostTeachingDetailsMutation,
    useLazyGetTeachingDetailsQuery,
    useEditTeachingDetailsMutation,
    useLazyDeleteTeachingDetailsQuery,
    useLazyDeleteSubjectDetailsQuery,

    usePostDocsMutation,
    useUpdateDocsMutation,
    useLazyGetDocsQuery,
    useLazyDeleteDocsQuery


} = tutorProfileApi;
