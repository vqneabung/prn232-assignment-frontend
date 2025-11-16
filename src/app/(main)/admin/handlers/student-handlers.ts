"use client";

import { toast } from "sonner";
import { studentApi } from "@/lib/api/student/student";

/**
 * Admin Student Management Handlers
 */

export async function handleCreateStudent(data: {
  studentCode: string;
  fullName?: string;
  email?: string;
}): Promise<void> {
  try {
    const response = await studentApi.create(data);

    if (response.success) {
      toast.success("Student created successfully");
      // set...(response.data) - BaseResponse<Student>
    } else {
      toast.error(`Failed to create student: ${response.message}`);
    }
  } catch (error) {
    console.error("Error creating student:", error);
    toast.error("An error occurred while creating student");
  }
}

export async function handleUpdateStudent(
  studentId: string,
  data: Partial<{
    studentCode: string;
    fullName?: string;
    email?: string;
  }>,
): Promise<void> {
  try {
    const response = await studentApi.update(Number(studentId), {
      studentCode: data.studentCode ?? "",
      fullName: data.fullName,
      email: data.email,
    });

    if (response.success) {
      toast.success("Student updated successfully");
      // set...(response.data) - BaseResponse<Student>
    } else {
      toast.error(`Failed to update student: ${response.message}`);
    }
  } catch (error) {
    console.error("Error updating student:", error);
    toast.error("An error occurred while updating student");
  }
}

export async function handleDeleteStudent(studentId: string): Promise<void> {
  try {
    const response = await studentApi.delete(Number(studentId));

    if (response.success) {
      toast.success("Student deleted successfully");
    } else {
      toast.error(`Failed to delete student: ${response.message}`);
    }
  } catch (error) {
    console.error("Error deleting student:", error);
    toast.error("An error occurred while deleting student");
  }
}

export async function handleImportStudents(file: File, defaultSemester: string): Promise<void> {
  try {
    const response = await studentApi.importExcel(file, defaultSemester);

    if (response.success) {
      toast.success("Students imported successfully");
      // set...(response.data) - BaseResponse<{ importedCount: number; errors?: string[] }>
    } else {
      toast.error(`Failed to import students: ${response.message}`);
    }
  } catch (error) {
    console.error("Error importing students:", error);
    toast.error("An error occurred while importing students");
  }
}

export async function handleValidateImportFile(file: File, defaultSemester: string): Promise<void> {
  try {
    const response = await studentApi.validateImport(file, defaultSemester);

    if (response.success) {
      toast.success("File validation passed");
      // set...(response.data) - BaseResponse<{ isValid: boolean; errors?: string[]; warnings?: string[] }>
    } else {
      toast.error(`File validation failed: ${response.message}`);
    }
  } catch (error) {
    console.error("Error validating import file:", error);
    toast.error("An error occurred while validating file");
  }
}

export async function handleDownloadImportTemplate(): Promise<void> {
  try {
    const response = await studentApi.getImportTemplate();

    if (response.success) {
      // set...(response.data) - BaseResponse<Blob or file data>
      toast.success("Template downloaded successfully");
    } else {
      toast.error(`Failed to download template: ${response.message}`);
    }
  } catch (error) {
    console.error("Error downloading template:", error);
    toast.error("An error occurred while downloading template");
  }
}
