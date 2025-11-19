/**
 * Manager Handlers
 * Handlers for manager role to manage submissions, violations, rules, and assignments
 */

import { toast } from "sonner";
import { ruleApi } from "@/lib/api/rule/rule";
import { submissionApi } from "@/lib/api/submission/submission";
import { plagiarismApi } from "@/lib/api/plagiarism/plagiarism";
import { classApi } from "@/lib/api/class/class";
import { lecturerApi, type LecturerResponse } from "@/lib/api/lecturer/lecturer";
import type { RuleResponse, RuleRequest, SubmissionResponse, PlagiarismCheckResult, ClassResponse, StudentResponse } from "@/types/type";

/**
 * Fetch all classes for assignment management
 */
export const fetchAllClasses = async (): Promise<ClassResponse[]> => {
  try {
    const response = await classApi.getAll();
    if (response.success && Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching classes:", error);
    return [];
  }
};

/**
 * Fetch all lecturers for assignment management
 */
export const fetchAllLecturers = async (): Promise<LecturerResponse[]> => {
  try {
    const response = await lecturerApi.getAll();
    if (response.success && Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching lecturers:", error);
    toast.error("Failed to fetch lecturers");
    return [];
  }
};

/**
 * Fetch lecturer by ID
 */
export const fetchLecturerById = async (lecturerId: number): Promise<LecturerResponse | null> => {
  try {
    const response = await lecturerApi.getById(lecturerId);
    if (response.success && response.data) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching lecturer:", error);
    return null;
  }
};

/**
 * Fetch students in a class
 */
export const fetchStudentsInClass = async (classId: number): Promise<StudentResponse[]> => {
  try {
    const response = await classApi.getStudents(classId);
    if (response.success && Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching students in class:", error);
    toast.error("Failed to fetch class students");
    return [];
  }
};

/**
 * Add student to class
 */
export const addStudentToClass = async (classId: number, studentId: number): Promise<boolean> => {
  try {
    const response = await classApi.addStudent(classId, studentId);
    if (response.success) {
      toast.success("Student added to class successfully");
      return true;
    }
    toast.error(response.message ?? "Failed to add student to class");
    return false;
  } catch (error) {
    console.error("Error adding student to class:", error);
    toast.error("Failed to add student to class");
    return false;
  }
};

/**
 * Remove student from class
 */
export const removeStudentFromClass = async (classId: number, studentId: number): Promise<boolean> => {
  try {
    const response = await classApi.removeStudent(classId, studentId);
    if (response.success) {
      toast.success("Student removed from class successfully");
      return true;
    }
    toast.error(response.message ?? "Failed to remove student from class");
    return false;
  } catch (error) {
    console.error("Error removing student from class:", error);
    toast.error("Failed to remove student from class");
    return false;
  }
};

/**
 * Check if class exists (by name and semester)
 */
export const checkClassExists = async (className: string, semester: string): Promise<boolean> => {
  try {
    const response = await classApi.checkExistence(className, semester);
    return response.success ? true : false;
  } catch (error) {
    console.error("Error checking class existence:", error);
    return false;
  }
};

/**
 * Fetch submission statistics for a student
 */
export const fetchStudentSubmissionStats = async (studentId: number) => {
  try {
    const response = await submissionApi.getStatistics(studentId);
    if (response.success && response.data) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching submission statistics:", error);
    return null;
  }
};

/**
 * Fetch submissions by class for examiner assignment
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
 * Fetch all rules for violation management
 */
export const fetchAllRules = async (): Promise<RuleResponse[]> => {
  try {
    const response = await ruleApi.getAll();
    if (response.success && Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching rules:", error);
    toast.error("Failed to fetch rules");
    return [];
  }
};

/**
 * Fetch rule by ID
 */
export const fetchRuleById = async (ruleId: number): Promise<RuleResponse | null> => {
  try {
    const response = await ruleApi.getById(ruleId);
    if (response.success && response.data) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching rule:", error);
    return null;
  }
};

/**
 * Create new rule
 */
export const createRule = async (ruleData: RuleRequest): Promise<RuleResponse | null> => {
  try {
    const response = await ruleApi.create(ruleData);
    if (response.success && response.data) {
      toast.success("Rule created successfully");
      return response.data;
    }
    toast.error(response.message ?? "Failed to create rule");
    return null;
  } catch (error) {
    console.error("Error creating rule:", error);
    toast.error("Failed to create rule");
    return null;
  }
};

/**
 * Update existing rule
 */
export const updateRule = async (ruleId: number, ruleData: RuleRequest): Promise<RuleResponse | null> => {
  try {
    const response = await ruleApi.update(ruleId, ruleData);
    if (response.success && response.data) {
      toast.success("Rule updated successfully");
      return response.data;
    }
    toast.error(response.message ?? "Failed to update rule");
    return null;
  } catch (error) {
    console.error("Error updating rule:", error);
    toast.error("Failed to update rule");
    return null;
  }
};

/**
 * Delete rule
 */
export const deleteRule = async (ruleId: number): Promise<boolean> => {
  try {
    const response = await ruleApi.delete(ruleId);
    if (response.success) {
      toast.success("Rule deleted successfully");
      return true;
    }
    toast.error(response.message ?? "Failed to delete rule");
    return false;
  } catch (error) {
    console.error("Error deleting rule:", error);
    toast.error("Failed to delete rule");
    return false;
  }
};

/**
 * Fetch all submissions for violation tracking
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
 * Check plagiarism violations
 */
export const checkPlagiarismViolation = async (
  file: File,
  submissionId: string,
  threshold?: number,
): Promise<PlagiarismCheckResult | null> => {
  try {
    const response = await plagiarismApi.check(file, submissionId, threshold);
    if (response.success && response.data) {
      toast.success("Plagiarism check completed");
      return response.data;
    }
    toast.error(response.message ?? "Failed to check plagiarism");
    return null;
  } catch (error) {
    console.error("Error checking plagiarism:", error);
    toast.error("Failed to check plagiarism");
    return null;
  }
};

/**
 * Check plagiarism service health
 */
export const checkPlagiarismHealth = async (): Promise<boolean> => {
  try {
    const response = await plagiarismApi.health();
    return response.success ? true : false;
  } catch (error) {
    console.error("Error checking plagiarism service health:", error);
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
): Promise<boolean> => {
  try {
    const response = await submissionApi.upload(file, studentId, ruleIds);
    if (response.success) {
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error uploading submission:", error);
    return false;
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

/**
 * Re-export violation and assignment handlers from separate file
 * These are mock handlers that will be replaced with actual API endpoints
 */
export {
  handleAssignExaminers,
  handleReassignExaminer,
  handleRemoveExaminer,
  handleReviewViolation,
  handleResolveViolation,
  handleQuickResolveViolation,
  handleMarkViolationAsSpam,
} from "./handlers-violations";

