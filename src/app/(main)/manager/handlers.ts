/**
 * Manager Handlers
 * Handlers for manager role to manage submissions, violations, rules, and assignments
 */

import { toast } from "sonner";
import { ruleApi } from "@/lib/api/rule/rule";
import { submissionApi } from "@/lib/api/submission/submission";
import { plagiarismApi } from "@/lib/api/plagiarism/plagiarism";
import { classApi } from "@/lib/api/class/class";
import type { RuleResponse, RuleRequest, SubmissionResponse, PlagiarismCheckResult, ClassResponse } from "@/types/type";

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
 * Manager Assignment Handlers (Original mock handlers below for reference)
 */

export async function handleAssignExaminers(submissionIds: string[], examinerIds: string[]): Promise<void> {
  try {
    console.log("Assigning examiners to submissions", {
      submissionIds,
      examinerIds,
    });

    // TODO: Implement actual examiner assignment API
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success(`Assigned ${examinerIds.length} examiners to ${submissionIds.length} submissions`);
  } catch (error) {
    console.error("Error assigning examiners:", error);
    toast.error("Failed to assign examiners");
  }
}

export async function handleReassignExaminer(
  submissionId: string,
  oldExaminerId: string,
  newExaminerId: string,
): Promise<void> {
  try {
    console.log("Reassigning examiner", {
      submissionId,
      oldExaminerId,
      newExaminerId,
    });

    await new Promise((resolve) => setTimeout(resolve, 800));
    toast.success("Examiner reassigned successfully");
  } catch (error) {
    console.error("Error reassigning examiner:", error);
    toast.error("Failed to reassign examiner");
  }
}

export async function handleRemoveExaminer(submissionId: string, examinerId: string): Promise<void> {
  try {
    console.log("Removing examiner from submission", {
      submissionId,
      examinerId,
    });

    await new Promise((resolve) => setTimeout(resolve, 600));
    toast.success("Examiner removed from submission");
  } catch (error) {
    console.error("Error removing examiner:", error);
    toast.error("Failed to remove examiner");
  }
}

/**
 * Manager Violation Management Handlers
 */

export async function handleReviewViolation(violationId: string): Promise<void> {
  try {
    console.log("Opening violation review for:", violationId);
    toast.info("Opening violation details...");
  } catch (error) {
    console.error("Error reviewing violation:", error);
    toast.error("Failed to load violation details");
  }
}

export async function handleResolveViolation(violationId: string, action: "give_zero" | "dismiss"): Promise<void> {
  try {
    console.log("Resolving violation", { violationId, action });

    // TODO: Replace with actual API call
    // const response = await fetch(`/api/manager/violations/${violationId}`, {
    //   method: "PATCH",
    //   body: JSON.stringify({ action, status: "resolved" }),
    // });

    await new Promise((resolve) => setTimeout(resolve, 800));

    const actionLabel = action === "give_zero" ? "Zero points assigned" : "Violation dismissed";
    toast.success(`${actionLabel}`);
  } catch (error) {
    console.error("Error resolving violation:", error);
    toast.error("Failed to resolve violation");
  }
}

export async function handleQuickResolveViolation(violationId: string, resolution: string): Promise<void> {
  try {
    console.log("Quick resolving violation", { violationId, resolution });

    // TODO: Replace with actual API call
    // const response = await fetch(`/api/manager/violations/${violationId}/quick-resolve`, {
    //   method: "POST",
    //   body: JSON.stringify({ resolution }),
    // });

    await new Promise((resolve) => setTimeout(resolve, 600));

    toast.success("Violation resolved quickly");
  } catch (error) {
    console.error("Error quick resolving violation:", error);
    toast.error("Failed to resolve violation");
  }
}

export async function handleMarkViolationAsSpam(violationId: string): Promise<void> {
  try {
    console.log("Marking violation as spam:", violationId);

    // TODO: Replace with actual API call
    // const response = await fetch(`/api/manager/violations/${violationId}/spam`, {
    //   method: "PATCH",
    // });

    await new Promise((resolve) => setTimeout(resolve, 600));

    toast.success("Violation marked as spam and hidden");
  } catch (error) {
    console.error("Error marking violation as spam:", error);
    toast.error("Failed to mark violation as spam");
  }
}
