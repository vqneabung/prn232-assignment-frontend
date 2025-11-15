import { commonApiGet } from "../common/common-api";

const ruleBasePath = "/rule"

export const ruleApi = {
    getAll: async () => {
        return commonApiGet(ruleBasePath);
    }
};