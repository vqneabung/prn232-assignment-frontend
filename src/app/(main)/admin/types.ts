/**
 * Admin Types
 * Types for system management, approvals, and reporting
 */

export type SubjectStatus = "active" | "inactive";

export interface Subject {
  id: string;
  code: string;
  name: string;
  credits: number;
  description: string;
  status: SubjectStatus;
  createdAt: string;
  updatedAt: string;
}

export type SemesterStatus = "planning" | "ongoing" | "finished";

export interface Semester {
  id: string;
  code: string;
  name: string;
  startDate: string;
  endDate: string;
  status: SemesterStatus;
  description: string;
  createdAt: string;
}

export type ExamStatus = "draft" | "published" | "active" | "closed";

export interface Exam {
  id: string;
  code: string;
  name: string;
  subjectId: string;
  semesterId: string;
  examDate: string;
  examTime: string;
  duration: number; // minutes
  totalSubmissions: number;
  status: ExamStatus;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export type ApprovalStatus = "pending" | "approved" | "rejected";

export interface ResultApproval {
  id: string;
  examId: string;
  examName: string;
  totalStudents: number;
  completedGrading: number;
  status: ApprovalStatus;
  averageScore: number;
  submittedAt: string;
  approvedAt?: string;
  approvedBy?: string;
}

export interface ReportData {
  examId: string;
  examName: string;
  subject: string;
  semester: string;
  totalStudents: number;
  gradedStudents: number;
  averageScore: number;
  passCount: number;
  failCount: number;
  distributionChart: Record<string, number>; // score ranges -> count
  exportedAt: string;
}
