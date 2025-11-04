export interface ViolationRecord {
  id: string;
  studentName: string;
  studentId: string;
  classCode: string;
  violations: ViolationDetail[];
}

export type ViolationType =
  | "incorrect_filename"
  | "invalid_naming_convention"
  | "source_code_duplicate"
  | "suspicious_code_pattern"
  | "missing_documentation";

export interface ViolationDetail {
  type: ViolationType;
  message: string;
  severity: "low" | "medium" | "high";
}

export const VIOLATION_LABELS: Record<ViolationType, string> = {
  incorrect_filename: "Tên file không chính xác",
  invalid_naming_convention: "Vi phạm quy ước đặt tên",
  source_code_duplicate: "Mã sao chép",
  suspicious_code_pattern: "Mẫu mã bất thường",
  missing_documentation: "Thiếu tài liệu",
};

export const VIOLATION_SEVERITY_COLOR: Record<"low" | "medium" | "high", string> = {
  low: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  medium: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};
