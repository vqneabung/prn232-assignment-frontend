/**
 * Rule Types
 */

export interface Rule {
  ruleId: string;
  name: string;
  pattern: string;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  detectionCount?: number;
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
