import Compressor from "compressorjs";
import { getFromStorage } from "../constants/storage";
import { STORAGE_KEYS } from "../constants/storageKeys";
import {  MEDIA_UPLOAD } from "../constants/url";

interface UploadResponse {
  image: any;
  code: number;
  statusCode: number;
  url: string;
  data: any;
  message: string;
}
const accessToken = getFromStorage(STORAGE_KEYS.token);

export const UploadMedia = (imageObject: any): Promise<UploadResponse> => {
  return new Promise(async (resolve, reject) => {
    new Compressor(imageObject, {
      quality: 0.6,
      success: async (compressedResult) => {
        const formData = new FormData();
        formData.append("file", compressedResult as any);
        // const encryptedFormData = generateEncryptedKeyBody(formData);
        let headers = {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        };

        try {
          const res = await fetch(MEDIA_UPLOAD, {
            method: "POST",
            headers,
            body: formData,
          });
          let response = await res.json();
          resolve(response); // Resolve the Promise with the response
        } catch (error) {
          //          console.log(error, ">>>>>>>>>");
          reject(error); // Reject the Promise with the error
        }
      },
    });
  });
};


export const UploadVideo = (imageObject: any): Promise<UploadResponse> => {
  return new Promise(async (resolve, reject) => {
    
        const formData = new FormData();
        
        formData.append("file", imageObject as any);
        // const encryptedFormData = generateEncryptedKeyBody(formData);
        let headers = {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        };

        try {
          const res = await fetch(MEDIA_UPLOAD, {
            method: "POST",
            headers,
            body: formData,
          });
          let response = await res.json();
          resolve(response); // Resolve the Promise with the response
        } catch (error) {
          //          console.log(error, ">>>>>>>>>");
          reject(error); // Reject the Promise with the error
        }
    
  });
};

export const Uploadpdf = async (imageObject: any) => {
  //  console.log("imageObject, ", imageObject);

  const formData = new FormData();

  formData.append("file", imageObject as any);

  const getToken = await getFromStorage(STORAGE_KEYS.token);
  let headers = {
    // "Content-Type": "multipart/form-data",
    Accept: "application/json",
    Authorization: "Bearer " + getToken,
  };
  try {
    const res = await fetch(MEDIA_UPLOAD, {
      method: "POST",
      headers,
      body: formData,
    });
    let response = await res.json();
    return response;
  } catch (error) {
    return error;
  }
};
