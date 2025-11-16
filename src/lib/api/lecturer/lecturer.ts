"use client";

import { authStore } from "@/stores/auth/authStore";
import type { BaseResponse } from "@/types/type";
import { commonApiGet } from "@/lib/api/common/common-api";

const lecturerBasePath = "/api/user/lecturers";

const getBearerHeaders = () => {
  const token = authStore.getState().token;
  return {
    Authorization: `Bearer ${token}`,
  };
};

export interface LecturerResponse {
  userId: number;
  userName: string;
  roleId?: number;
  roleName?: string;
  [key: string]: unknown;
}

export const lecturerApi = {
  getAll: async (): Promise<BaseResponse<LecturerResponse[]>> => {
    return commonApiGet<LecturerResponse[]>(lecturerBasePath, getBearerHeaders());
  },

  getById: async (id: number): Promise<BaseResponse<LecturerResponse>> => {
    return commonApiGet<LecturerResponse>(`${lecturerBasePath}/${id}`, getBearerHeaders());
  },
};
