/**
 * Grading Types
 * Types for the student grading/examination workflow
 */

export type GradingStatus = "pending" | "graded" | "reviewed";

export interface GradingRubric {
  id: string;
  name: string;
  description: string;
  maxScore: number;
  weight: number; // Percentage weight in final score
}

export interface GraderScore {
  id: string;
  graderId: string;
  graderName: string;
  score: number;
  feedback: string;
  timestamp: string;
  rubricScores: Record<string, number>; // rubricId -> score
}

export interface SubmissionGrade {
  id: string;
  submissionId: string;
  studentId: string;
  studentName: string;
  studentCode: string;
  classCode: string;
  status: GradingStatus;
  finalScore?: number; // Average of all graders if double-graded
  graderScores: GraderScore[]; // Array of scores from different graders
  submittedAt: string;
  gradedAt?: string;
}

export interface GradeListItem {
  id: string;
  studentId: string;
  studentName: string;
  studentCode: string;
  classCode: string;
  status: GradingStatus;
  finalScore?: number;
  graderCount: number;
  submittedAt: string;
}

export interface GradingCriteria {
  rubrics: GradingRubric[];
  totalWeight: number;
  minScore: number;
  maxScore: number;
}
