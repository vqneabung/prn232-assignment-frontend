/**
 * Single violation detected in a file
 */
export interface Violation {
  violationId: number;
  submissionId: number;
  ruleId: number;
  filePath: string;
  message: string;
}

/**
 * Rule definition for detecting violations
 */
export interface DetectionRule {
  ruleId: number;
  name: string;
  pattern: string;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  violations: Violation[];
}

/**
 * File with violations - grouped by file
 */
export interface ViolationRecord {
  filePath: string;
  message: string;
  rule: DetectionRule;
}

/**
 * API Response structure for detect violations
 */
export interface DetectViolationsResponse {
  message: string;
  zipFileName: string;
  uploadedAt: string;
  checkedAt: string;
  violations: ViolationRecord[];
}

/**
 * Severity colors for violations
 */
export const VIOLATION_SEVERITY_COLOR: Record<"low" | "medium" | "high" | "critical", string> = {
  low: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  medium: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  critical: "bg-red-600 text-white dark:bg-red-700 dark:text-red-100",
};

/**
 * Get severity label
 */
export function getSeverityLabel(severity: "low" | "medium" | "high" | "critical"): string {
  switch (severity) {
    case "low":
      return "Thấp";
    case "medium":
      return "Trung bình";
    case "high":
      return "Cao";
    case "critical":
      return "Nghiêm trọng";
    default:
      return "Unknown";
  }
}
