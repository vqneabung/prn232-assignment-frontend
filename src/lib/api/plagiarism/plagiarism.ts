import { commonApiGet, commonApiPost } from "../common/common-api";
import { authStore } from "@/stores/auth/authStore";
import type {
  BaseResponse,
  PlagiarismCheckResult,
  StoreSubmissionResult,
} from "@/types/type";

const plagiarismBasePath = "/Plagiarism";

const getBearerHeaders = () => {
  const token = authStore.getState().token;
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const plagiarismApi = {
  health: async (): Promise<BaseResponse<{ available: boolean }>> => {
    return commonApiGet(`${plagiarismBasePath}/health`, getBearerHeaders());
  },

  check: async (
    file: File,
    submissionId: string,
    threshold: number = 0.85,
  ): Promise<BaseResponse<PlagiarismCheckResult>> => {
    const formData = new FormData();
    formData.append("File", file);
    formData.append("SubmissionId", submissionId);
    formData.append("Threshold", threshold.toString());

    return commonApiPost(`${plagiarismBasePath}/check`, formData, getBearerHeaders());
  },

  store: async (file: File, submissionId: string): Promise<BaseResponse<StoreSubmissionResult>> => {
    const formData = new FormData();
    formData.append("File", file);
    formData.append("SubmissionId", submissionId);

    return commonApiPost(`${plagiarismBasePath}/store`, formData, getBearerHeaders());
  },
};
