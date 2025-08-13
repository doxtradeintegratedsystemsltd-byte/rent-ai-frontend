import { useMutation } from "@tanstack/react-query";
import api from "@/service/api";
import type { ApiResponse } from "@/types/user";

export type SingleImageUploadResponse = string;

export interface MultipleImageUploadResponse {
  urls: string[];
  [key: string]: any;
}

// Single image upload mutation
export const useSingleImageUpload = () => {
  return useMutation({
    mutationFn: async (
      file: File,
    ): Promise<ApiResponse<SingleImageUploadResponse>> => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post("/uploads/single", formData);
      return response.data;
    },
    onSuccess: (data) => {
      console.log("Image uploaded successfully:", data.data);
    },
    onError: (error) => {
      console.error("Image upload error:", error);
    },
  });
};

// Multiple images upload mutation
export const useMultipleImageUpload = () => {
  return useMutation({
    mutationFn: async (
      files: File[],
    ): Promise<ApiResponse<MultipleImageUploadResponse>> => {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append(`files`, file);
      });

      const response = await api.post("/uploads/multi", formData);
      return response.data;
    },
    onSuccess: (data) => {
      console.log("Images uploaded successfully:", data.data?.urls);
    },
    onError: (error) => {
      console.error("Images upload error:", error);
    },
  });
};

// Utility hook for property form image upload
export const usePropertyImageUpload = () => {
  const singleImageUpload = useSingleImageUpload();

  return {
    ...singleImageUpload,
    uploadImageForProperty: async (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        singleImageUpload.mutate(file, {
          onSuccess: (data) => {
            if (data.data) {
              resolve(data.data);
            } else {
              reject(new Error("No URL returned from upload"));
            }
          },
          onError: (error) => {
            reject(error);
          },
        });
      });
    },
  };
};
