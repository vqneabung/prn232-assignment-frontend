import { commonApiGet, commonApiPost } from "../common/common-api";
import { authStore } from "@/stores/auth/authStore";
import type { BaseResponse, AuthResponse } from "@/types/type";
import { commonPost } from "../common/common";

const authBasePath = "/Auth";

const getBearerHeaders = () => {
  const token = authStore.getState().token;
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const authApi = {
  login: async (userName: string, password: string): Promise<BaseResponse<AuthResponse>> => {
    return commonPost<AuthResponse>(`/api/auth/login`, { userName, password });
  },
  register: async (userName: string, password: string, roleId: number): Promise<BaseResponse<AuthResponse>> => {
    return commonPost<AuthResponse>(`/api/auth/register`, { userName, password, roleId });
  },
  me: async (): Promise<BaseResponse<AuthResponse>> => {
    return commonApiGet<AuthResponse>(`${authBasePath}/me`, getBearerHeaders());
  },
  logout: async (): Promise<BaseResponse<unknown>> => {
    return commonApiPost(`${authBasePath}/logout`);
  },
};
