/**
 * Rule Types
 */

export interface Rule {
  ruleId: string;
  name: string;
  pattern: string;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
}

export interface RuleCreateInput {
  name: string;
  pattern: string;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
}

export interface RuleUpdateInput {
  name?: string;
  pattern?: string;
  severity?: "low" | "medium" | "high" | "critical";
  description?: string;
  isActive?: boolean;
}
