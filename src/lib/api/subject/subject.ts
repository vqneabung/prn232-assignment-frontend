import { commonApiGet, commonApiPost, commonApiPut, commonApiDelete } from "../common/common-api";
import { authStore } from "@/stores/auth/authStore";
import type { BaseResponse, SubjectResponse, SubjectRequest } from "@/types/type";

const subjectBasePath = "/api/Subject";

const getBearerHeaders = () => {
  const token = authStore.getState().token;
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const subjectApi = {
  getAll: async (): Promise<BaseResponse<SubjectResponse[]>> => {
    return commonApiGet(subjectBasePath, getBearerHeaders());
  },

  getById: async (id: number): Promise<BaseResponse<SubjectResponse>> => {
    return commonApiGet(`${subjectBasePath}/${id}`, getBearerHeaders());
  },

  create: async (data: SubjectRequest): Promise<BaseResponse<SubjectResponse>> => {
    return commonApiPost(subjectBasePath, data, getBearerHeaders());
  },

  update: async (id: number, data: SubjectRequest): Promise<BaseResponse<SubjectResponse>> => {
    return commonApiPut(`${subjectBasePath}/${id}`, data, getBearerHeaders());
  },

  delete: async (id: number): Promise<BaseResponse<boolean>> => {
    return commonApiDelete(`${subjectBasePath}/${id}`, getBearerHeaders());
  },
};
