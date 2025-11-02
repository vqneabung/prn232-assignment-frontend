/**
 * Moderator Types
 * Types for complaint handling and verification
 */

export type ComplaintStatus = "submitted" | "under-review" | "resolved" | "rejected";
export type ComplaintPriority = "low" | "medium" | "high";

export interface Complaint {
  id: string;
  submissionId: string;
  studentName: string;
  studentCode: string;
  examName: string;
  complaintType: string; // "grading_dispute" | "unfair_treatment" | "technical_issue"
  description: string;
  attachments?: string[];
  status: ComplaintStatus;
  priority: ComplaintPriority;
  submittedAt: string;
  submittedBy: string;
  assignedTo?: string;
  resolution?: string;
  resolvedAt?: string;
}

export type VerificationStatus = "pending" | "verified" | "dismissed" | "needs-investigation";

export interface ZeroPointSubmission {
  id: string;
  submissionId: string;
  studentName: string;
  studentCode: string;
  examName: string;
  reason: string; // Reason for zero points
  violationDetails?: string;
  giaderedBy: string;
  gradedAt: string;
  verificationStatus: VerificationStatus;
  verifiedBy?: string;
  verifiedAt?: string;
  notes?: string;
}
