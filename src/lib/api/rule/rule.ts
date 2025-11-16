import { commonApiGet, commonApiPost, commonApiPut, commonApiDelete } from "../common/common-api";
import { authStore } from "@/stores/auth/authStore";
import type { BaseResponse, RuleResponse, RuleRequest } from "@/types/type";

const ruleBasePath = "/Rule";

const getBearerHeaders = () => {
  const token = authStore.getState().token;
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const ruleApi = {
  getAll: async (): Promise<BaseResponse<RuleResponse[]>> => {
    return commonApiGet(ruleBasePath, getBearerHeaders());
  },

  getById: async (id: number): Promise<BaseResponse<RuleResponse>> => {
    return commonApiGet(`${ruleBasePath}/${id}`, getBearerHeaders());
  },

  create: async (data: RuleRequest): Promise<BaseResponse<RuleResponse>> => {
    return commonApiPost(ruleBasePath, data, getBearerHeaders());
  },

  update: async (id: number, data: RuleRequest): Promise<BaseResponse<RuleResponse>> => {
    return commonApiPut(`${ruleBasePath}/${id}`, data, getBearerHeaders());
  },

  delete: async (id: number): Promise<BaseResponse<boolean>> => {
    return commonApiDelete(`${ruleBasePath}/${id}`, getBearerHeaders());
  },
};