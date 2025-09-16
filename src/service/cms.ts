import { END_POINTS } from "../constants/url";
import { CMSData } from "../types/General";
import emptySplitApi from "../utils/rtk";


type CommonResponseType = {
  statusCode: number;
  message: string;
};

 
export const cmsApi = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
  fetchCms:builder.query<
  CommonResponseType & {data:CMSData},{}>({
    query:()=>({
        url:`${END_POINTS.cms}`,
        method:"GET"
    })
  })
  }),
});

export const {
 useFetchCmsQuery
} = cmsApi;
