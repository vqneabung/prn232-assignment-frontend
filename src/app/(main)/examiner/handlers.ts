/**
 * Examiner Handlers
 * Handlers for examiner role to manage submissions and grading
 */

import { classApi } from "@/lib/api/class/class";
import { submissionApi } from "@/lib/api/submission/submission";
import { plagiarismApi } from "@/lib/api/plagiarism/plagiarism";
import { authApi } from "@/lib/api/auth/auth";
import type {
  ClassResponse,
  SubmissionResponse,
  PlagiarismCheckResult,
  SubmissionUploadResponse,
  AuthResponse,
} from "@/types/type";

/**
 * Fetch current user info
 */
export const fetchCurrentUser = async (): Promise<AuthResponse | null> => {
  try {
    const response = await authApi.me();
    if (response.success && response.data) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
};

/**
 * Fetch classes assigned to examiner
 */
export const fetchExaminerClasses = async (examinerId: number): Promise<ClassResponse[]> => {
  try {
    const response = await classApi.getByExaminer(examinerId);
    if (response.success && Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching examiner classes:", error);
    return [];
  }
};

/**
 * Fetch all submissions (examiner needs to see submissions in their classes)
 */
export const fetchAllSubmissions = async (): Promise<SubmissionResponse[]> => {
  try {
    const response = await submissionApi.getAll();
    if (response.success && Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return [];
  }
};

/**
 * Fetch submission by ID
 */
export const fetchSubmissionById = async (submissionId: number): Promise<SubmissionResponse | null> => {
  try {
    const response = await submissionApi.getById(submissionId);
    if (response.success && response.data) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching submission:", error);
    return null;
  }
};

/**
 * Fetch submissions by class
 */
export const fetchSubmissionsByClass = async (classId: number): Promise<SubmissionResponse[]> => {
  try {
    const response = await submissionApi.getByClass(classId);
    if (response.success && Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching submissions by class:", error);
    return [];
  }
};

/**
 * Fetch submissions by student
 */
export const fetchSubmissionsByStudent = async (studentId: number): Promise<SubmissionResponse[]> => {
  try {
    const response = await submissionApi.getByStudent(studentId);
    if (response.success && Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching submissions by student:", error);
    return [];
  }
};

/**
 * Check plagiarism for submission
 */
export const checkPlagiarism = async (
  file: File,
  submissionId: string,
  threshold?: number,
): Promise<PlagiarismCheckResult | null> => {
  try {
    const response = await plagiarismApi.check(file, submissionId, threshold);
    if (response.success && response.data) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Error checking plagiarism:", error);
    return null;
  }
};

/**
 * Store submission for plagiarism check
 */
export const storePlagiarismSubmission = async (file: File, submissionId: string): Promise<boolean> => {
  try {
    const response = await plagiarismApi.store(file, submissionId);
    if (response.success) {
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error storing submission:", error);
    return false;
  }
};

/**
 * Upload submission file
 */
export const uploadSubmission = async (
  file: File,
  studentId: number,
  ruleIds?: string,
): Promise<SubmissionUploadResponse | null> => {
  try {
    const response = await submissionApi.upload(file, studentId, ruleIds);
    if (response.success && response.data) {
      return response.data as SubmissionUploadResponse;
    }
    return null;
  } catch (error) {
    console.error("Error uploading submission:", error);
    return null;
  }
};

/**
 * Delete submission
 */
export const deleteSubmission = async (submissionId: number): Promise<boolean> => {
  try {
    const response = await submissionApi.delete(submissionId);
    if (response.success) {
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error deleting submission:", error);
    return false;
  }
};
