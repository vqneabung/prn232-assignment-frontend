import { commonPost } from "../common/common";

export const authApi = {
  login: async (email: string, password: string) => {
    return commonPost("/api/auth/login", { email, password });
  },
};
