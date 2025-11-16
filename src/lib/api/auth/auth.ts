import { commonPost } from "../common/common";
import type { BaseResponse, AuthResponse } from "@/types/type";

export const authApi = {
  login: async (userName: string, password: string): Promise<BaseResponse<AuthResponse>> => {
    const response = await commonPost<AuthResponse>("/api/auth/login", { userName, password });
    return response;
  },
  register: async (userName: string, password: string, roleId: number): Promise<BaseResponse<AuthResponse>> => {
    const response = await commonPost<AuthResponse>("/api/auth/register", { userName, password, roleId });
    return response;
  },
  logout: async (): Promise<BaseResponse<unknown>> => {
    const response = await commonPost("/api/auth/logout");
    return response;
  },
};
