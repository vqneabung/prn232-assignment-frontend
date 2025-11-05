import { commonGet } from "../common/common"

const ruleBasePath = "/api/rule"

export const ruleApi = {
    getAll: async () => {
        return commonGet(ruleBasePath);
    }
}