import { register } from "module";
import { commonPost } from "../common/common";

export const authApi = {
  login: async (userName: string, password: string) => {
    const response = await commonPost("/api/auth/login", { userName, password });
    return response;
  },
  register: async (userName: string, password: string, roleId: number) => {
    const response = await commonPost("/api/auth/register", { userName, password, roleId });
    return response;
  },
};
