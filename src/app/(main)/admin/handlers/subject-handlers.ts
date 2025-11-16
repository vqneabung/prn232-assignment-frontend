"use client";

import { toast } from "sonner";
import { subjectApi } from "@/lib/api/subject/subject";

/**
 * Admin Subject Management Handlers
 */

export async function handleCreateSubject(data: {
  code: string;
  name: string;
  credits: number;
  description?: string;
}): Promise<void> {
  try {
    const response = await subjectApi.create({
      name: data.name,
      code: data.code,
      credits: data.credits,
      description: data.description,
    });

    if (response.success) {
      toast.success("Subject created successfully");
      // set...(response.data) - BaseResponse<Subject>
    } else {
      toast.error(`Failed to create subject: ${response.message}`);
    }
  } catch (error) {
    console.error("Error creating subject:", error);
    toast.error("An error occurred while creating subject");
  }
}

export async function handleUpdateSubject(
  subjectId: string,
  data: Partial<{
    code: string;
    name: string;
    credits: number;
    description?: string;
  }>,
): Promise<void> {
  try {
    const response = await subjectApi.update(Number(subjectId), {
      name: data.name ?? "",
      code: data.code ?? "",
      credits: data.credits ?? 0,
      description: data.description,
    });

    if (response.success) {
      toast.success("Subject updated successfully");
      // set...(response.data) - BaseResponse<Subject>
    } else {
      toast.error(`Failed to update subject: ${response.message}`);
    }
  } catch (error) {
    console.error("Error updating subject:", error);
    toast.error("An error occurred while updating subject");
  }
}

export async function handleDeleteSubject(subjectId: string): Promise<void> {
  try {
    const response = await subjectApi.delete(Number(subjectId));

    if (response.success) {
      toast.success("Subject deleted successfully");
    } else {
      toast.error(`Failed to delete subject: ${response.message}`);
    }
  } catch (error) {
    console.error("Error deleting subject:", error);
    toast.error("An error occurred while deleting subject");
  }
}
