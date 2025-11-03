 "use client";

import { toast } from "sonner";

/**
 * Manager Assignment Handlers
 */

export async function handleAssignExaminers(
  submissionIds: string[],
  examinerIds: string[]
): Promise<void> {
  try {
    console.log("Assigning examiners to submissions", {
      submissionIds,
      examinerIds,
    });

    // TODO: Replace with actual API call
    // const response = await fetch("/api/manager/assignments", {
    //   method: "POST",
    //   body: JSON.stringify({ submissionIds, examinerIds }),
    // });

    // Simulate API delay
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
  newExaminerId: string
): Promise<void> {
  try {
    console.log("Reassigning examiner", {
      submissionId,
      oldExaminerId,
      newExaminerId,
    });

    // TODO: Replace with actual API call
    // const response = await fetch(`/api/manager/assignments/${submissionId}`, {
    //   method: "PUT",
    //   body: JSON.stringify({ oldExaminerId, newExaminerId }),
    // });

    await new Promise((resolve) => setTimeout(resolve, 800));

    toast.success("Examiner reassigned successfully");
  } catch (error) {
    console.error("Error reassigning examiner:", error);
    toast.error("Failed to reassign examiner");
  }
}

export async function handleRemoveExaminer(
  submissionId: string,
  examinerId: string
): Promise<void> {
  try {
    console.log("Removing examiner from submission", {
      submissionId,
      examinerId,
    });

    // TODO: Replace with actual API call
    // const response = await fetch(`/api/manager/assignments/${submissionId}/${examinerId}`, {
    //   method: "DELETE",
    // });

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

    // TODO: Fetch violation details from API
    // const response = await fetch(`/api/manager/violations/${violationId}`);
    // const data = await response.json();

    toast.info("Opening violation details...");
  } catch (error) {
    console.error("Error reviewing violation:", error);
    toast.error("Failed to load violation details");
  }
}

export async function handleResolveViolation(
  violationId: string,
  action: "give_zero" | "dismiss"
): Promise<void> {
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

export async function handleQuickResolveViolation(
  violationId: string,
  resolution: string
): Promise<void> {
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
