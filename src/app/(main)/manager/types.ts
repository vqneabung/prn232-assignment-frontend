/**
 * Manager Types
 * Types for examiner assignment and violation management
 */

export type AssignmentStatus = "assigned" | "in-progress" | "completed";

export interface ExaminerAssignment {
  id: string;
  examId: string;
  submissionId: string;
  studentName: string;
  studentCode: string;
  examinerId: string;
  examinerName: string;
  status: AssignmentStatus;
  startedAt?: string;
  completedAt?: string;
  assignedAt: string;
}

export interface SubmissionAssignment {
  id: string;
  examId: string;
  examName: string;
  studentId: string;
  studentName: string;
  studentCode: string;
  classCode: string;
  submittedAt: string;
  assignedExaminers: ExaminerAssignment[];
  status: "pending" | "assigned" | "in-grading" | "completed";
}

export type ViolationType =
  | "incorrect_filename"
  | "invalid_naming_convention"
  | "source_code_duplicate"
  | "suspicious_code_pattern"
  | "missing_documentation"
  | "plagiarism"
  | "unauthorized_collaboration";

export type ViolationSeverity = "low" | "medium" | "high" | "critical";

export interface ViolationManagementItem {
  id: string;
  submissionId: string;
  studentName: string;
  studentCode: string;
  examName: string;
  violationType: ViolationType;
  severity: ViolationSeverity;
  description: string;
  detectedAt: string;
  status: "flagged" | "under-review" | "resolved" | "dismissed";
  resolution?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}
