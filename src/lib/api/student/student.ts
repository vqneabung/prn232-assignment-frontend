import { commonApiGet, commonApiPost, commonApiPut, commonApiDelete } from "../common/common-api";
import { authStore } from "@/stores/auth/authStore";
import type { BaseResponse, StudentResponse, StudentRequest } from "@/types/type";

const studentBasePath = "/Student";

const getBearerHeaders = () => {
  const token = authStore.getState().token;
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const studentApi = {
  getAll: async (): Promise<BaseResponse<StudentResponse[]>> => {
    return commonApiGet(studentBasePath, getBearerHeaders());
  },

  getById: async (id: number): Promise<BaseResponse<StudentResponse>> => {
    return commonApiGet(`${studentBasePath}/${id}`, getBearerHeaders());
  },

  getByCode: async (studentCode: string): Promise<BaseResponse<StudentResponse>> => {
    return commonApiGet(`${studentBasePath}/by-code/${studentCode}`, getBearerHeaders());
  },

  create: async (data: StudentRequest): Promise<BaseResponse<StudentResponse>> => {
    return commonApiPost(studentBasePath, data, getBearerHeaders());
  },

  update: async (id: number, data: StudentRequest): Promise<BaseResponse<StudentResponse>> => {
    return commonApiPut(`${studentBasePath}/${id}`, data, getBearerHeaders());
  },

  delete: async (id: number): Promise<BaseResponse<boolean>> => {
    return commonApiDelete(`${studentBasePath}/${id}`, getBearerHeaders());
  },

  importExcel: async (file: File, defaultSemester: string) => {
    const formData = new FormData();
    formData.append("ExcelFile", file);
    formData.append("DefaultSemester", defaultSemester);

    return commonApiPost(`${studentBasePath}/import-excel`, formData, getBearerHeaders());
  },

  getImportTemplate: async () => {
    return commonApiGet(`${studentBasePath}/import-template`, getBearerHeaders());
  },

  validateImport: async (file: File, defaultSemester: string) => {
    const formData = new FormData();
    formData.append("ExcelFile", file);
    formData.append("DefaultSemester", defaultSemester);

    return commonApiPost(`${studentBasePath}/validate-import`, formData, getBearerHeaders());
  },
};
