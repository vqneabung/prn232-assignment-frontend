"use client";

import { toast } from "sonner";
import { classApi } from "@/lib/api/class/class";

/**
 * Admin Class Management Handlers
 */

export async function handleCreateClass(data: {
  className: string;
  semester: string;
  lecturer?: number;
  examiner?: number;
}): Promise<void> {
  try {
    const response = await classApi.create(data);

    if (response.success) {
      toast.success("Class created successfully");
      // set...(response.data) - BaseResponse<Class>
    } else {
      toast.error(`Failed to create class: ${response.message}`);
    }
  } catch (error) {
    console.error("Error creating class:", error);
    toast.error("An error occurred while creating class");
  }
}

export async function handleUpdateClass(
  classId: string,
  data: Partial<{
    className: string;
    semester: string;
    lecturer?: number;
    examiner?: number;
  }>,
): Promise<void> {
  try {
    const response = await classApi.update(Number(classId), {
      className: data.className ?? "",
      semester: data.semester ?? "",
      lecturer: data.lecturer,
      examiner: data.examiner,
    });

    if (response.success) {
      toast.success("Class updated successfully");
      // set...(response.data) - BaseResponse<Class>
    } else {
      toast.error(`Failed to update class: ${response.message}`);
    }
  } catch (error) {
    console.error("Error updating class:", error);
    toast.error("An error occurred while updating class");
  }
}

export async function handleDeleteClass(classId: string): Promise<void> {
  try {
    const response = await classApi.delete(Number(classId));

    if (response.success) {
      toast.success("Class deleted successfully");
    } else {
      toast.error(`Failed to delete class: ${response.message}`);
    }
  } catch (error) {
    console.error("Error deleting class:", error);
    toast.error("An error occurred while deleting class");
  }
}

export async function handleAddStudentToClass(classId: string, studentId: string): Promise<void> {
  try {
    const response = await classApi.addStudent(Number(classId), Number(studentId));

    if (response.success) {
      toast.success("Student added to class successfully");
    } else {
      toast.error(`Failed to add student: ${response.message}`);
    }
  } catch (error) {
    console.error("Error adding student to class:", error);
    toast.error("An error occurred while adding student");
  }
}

export async function handleRemoveStudentFromClass(classId: string, studentId: string): Promise<void> {
  try {
    const response = await classApi.removeStudent(Number(classId), Number(studentId));

    if (response.success) {
      toast.success("Student removed from class successfully");
    } else {
      toast.error(`Failed to remove student: ${response.message}`);
    }
  } catch (error) {
    console.error("Error removing student from class:", error);
    toast.error("An error occurred while removing student");
  }
}
