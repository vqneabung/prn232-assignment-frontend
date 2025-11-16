import { commonApiGet, commonApiPost, commonApiPut, commonApiDelete } from "../common/common-api";
import { authStore } from "@/stores/auth/authStore";
import type { BaseResponse, ClassResponse, ClassRequest } from "@/types/type";

const classBasePath = "/Class";

const getBearerHeaders = () => {
  const token = authStore.getState().token;
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const classApi = {
  getAll: async (): Promise<BaseResponse<ClassResponse[]>> => {
    return commonApiGet(classBasePath, getBearerHeaders());
  },

  getById: async (id: number): Promise<BaseResponse<ClassResponse>> => {
    return commonApiGet(`${classBasePath}/${id}`, getBearerHeaders());
  },

  create: async (data: ClassRequest): Promise<BaseResponse<ClassResponse>> => {
    return commonApiPost(classBasePath, data, getBearerHeaders());
  },

  update: async (id: number, data: ClassRequest): Promise<BaseResponse<ClassResponse>> => {
    return commonApiPut(`${classBasePath}/${id}`, data, getBearerHeaders());
  },

  delete: async (id: number): Promise<BaseResponse<boolean>> => {
    return commonApiDelete(`${classBasePath}/${id}`, getBearerHeaders());
  },

  getByLecturer: async (lecturerId: number) => {
    return commonApiGet(`${classBasePath}/by-lecturer/${lecturerId}`, getBearerHeaders());
  },

  getByExaminer: async (examinerId: number) => {
    return commonApiGet(`${classBasePath}/by-examiner/${examinerId}`, getBearerHeaders());
  },

  getBySemester: async (semester: string) => {
    return commonApiGet(`${classBasePath}/by-semester/${semester}`, getBearerHeaders());
  },

  getStudents: async (classId: number) => {
    return commonApiGet(`${classBasePath}/${classId}/students`, getBearerHeaders());
  },

  addStudent: async (classId: number, studentId: number) => {
    return commonApiPost(`${classBasePath}/${classId}/students/${studentId}`, {}, getBearerHeaders());
  },

  removeStudent: async (classId: number, studentId: number) => {
    return commonApiDelete(`${classBasePath}/${classId}/students/${studentId}`, getBearerHeaders());
  },

  checkExistence: async (className: string, semester: string) => {
    return commonApiGet(
      `${classBasePath}/check-existence?className=${className}&semester=${semester}`,
      getBearerHeaders(),
    );
  },
};
