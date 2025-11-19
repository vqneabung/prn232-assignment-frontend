import { commonApiGet, commonApiPost, commonApiDelete } from "../common/common-api";
import { authStore } from "@/stores/auth/authStore";
import type { BaseResponse, SubmissionResponse, SubmissionStatistics } from "@/types/type";

const submissionBasePath = "/Submission";

const getBearerHeaders = () => {
  const token = authStore.getState().token;
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const submissionApi = {
  upload: async (file: File, studentId: number, ruleIds?: string): Promise<BaseResponse> => {
    const formData = new FormData();
    formData.append("File", file);
    formData.append("StudentId", studentId.toString());
    if (ruleIds) {
      formData.append("RuleIds", ruleIds);
    }
    return commonApiPost(
      `${submissionBasePath}/upload`,
      formData,
      getBearerHeaders(),
    );
  },

  getAll: async (): Promise<BaseResponse<SubmissionResponse[]>> => {
    return commonApiGet(submissionBasePath, getBearerHeaders());
  },

  getById: async (id: number): Promise<BaseResponse<SubmissionResponse>> => {
    return commonApiGet(`${submissionBasePath}/${id}`, getBearerHeaders());
  },

  getByStudent: async (studentId: number): Promise<BaseResponse<SubmissionResponse[]>> => {
    return commonApiGet(`${submissionBasePath}/by-student/${studentId}`, getBearerHeaders());
  },

  getByClass: async (classId: number): Promise<BaseResponse<SubmissionResponse[]>> => {
    return commonApiGet(`${submissionBasePath}/by-class/${classId}`, getBearerHeaders());
  },

  getStatistics: async (studentId: number): Promise<BaseResponse<SubmissionStatistics>> => {
    return commonApiGet(
      `${submissionBasePath}/statistics/student/${studentId}`,
      getBearerHeaders(),
    );
  },

  delete: async (id: number): Promise<BaseResponse<boolean>> => {
    return commonApiDelete(`${submissionBasePath}/${id}`, getBearerHeaders());
  },

  batchGrading: async (
    archiveFile: File,
    ruleIds?: string,
    defaultSemester?: string,
    createClassIfNotExists?: boolean,
    createStudentsIfNotExist?: boolean,
  ): Promise<BaseResponse> => {
    const formData = new FormData();
    formData.append("ArchiveFile", archiveFile);
    if (ruleIds) {
      formData.append("RuleIds", ruleIds);
    }
    if (defaultSemester) {
      formData.append("DefaultSemester", defaultSemester);
    }
    if (createClassIfNotExists !== undefined) {
      formData.append("CreateClassIfNotExists", createClassIfNotExists.toString());
    }
    if (createStudentsIfNotExist !== undefined) {
      formData.append("CreateStudentsIfNotExist", createStudentsIfNotExist.toString());
    }
    return commonApiPost(
      `${submissionBasePath}/batch-grading`,
      formData,
      getBearerHeaders(),
    );
  },
};
