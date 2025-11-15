import { commonPost } from "../common/common";

export const authApi = {
  login: async (userName: string, password: string) => {
    const response = await commonPost("/api/auth/login", { userName, password });
    return response;
  },
};
