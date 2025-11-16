import { commonApiGet } from "../common/common-api";
import { authStore } from "@/stores/auth/authStore";

const ruleBasePath = "/rule";

const getBearerHeaders = () => {
  const token = authStore.getState().token;
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const ruleApi = {
  getAll: async () => {
    return commonApiGet(ruleBasePath, getBearerHeaders());
  },
};