import { commonApiGet, commonApiPost } from "../common/common-api";
import { authStore } from "@/stores/auth/authStore";
import type { BaseResponse, AuthResponse } from "@/types/type";

const authBasePath = "/Auth";

const getBearerHeaders = () => {
  const token = authStore.getState().token;
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const authApi = {
  login: async (userName: string, password: string): Promise<BaseResponse<AuthResponse>> => {
    return commonApiPost<AuthResponse>(`${authBasePath}/login`, { userName, password });
  },
  register: async (userName: string, password: string, roleId: number): Promise<BaseResponse<AuthResponse>> => {
    return commonApiPost<AuthResponse>(`${authBasePath}/register`, { userName, password, roleId });
  },
  me: async (): Promise<BaseResponse<AuthResponse>> => {
    return commonApiGet<AuthResponse>(`${authBasePath}/me`, getBearerHeaders());
  },
  logout: async (): Promise<BaseResponse<unknown>> => {
    return commonApiPost(`${authBasePath}/logout`);
  },
};
