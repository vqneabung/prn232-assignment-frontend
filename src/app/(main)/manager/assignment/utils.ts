import { ExaminerAssignment, SubmissionAssignment } from "../types";

export interface ExaminerProfile {
  id: string;
  examId: string;
  examinerName: string;
  examinerId: string;
  assignedCount: number;
  gradedCount: number;
}

export function generateMockSubmissions(): SubmissionAssignment[] {
  const submissions: SubmissionAssignment[] = [];
  const examIds = ["EX-001", "EX-002", "EX-003"];
  const examNames = ["Midterm Exam - Spring 2024", "Final Exam - Spring 2024", "Quiz 1 - Spring 2024"];
  const statuses = ["pending", "assigned", "in-grading", "completed"] as const;

  for (let i = 1; i <= 20; i++) {
    const examIndex = Math.floor(Math.random() * examIds.length);
    const examiners: ExaminerAssignment[] = [];

    if (i % 3 === 0) {
      examiners.push(
        {
          id: `AS-${i}-1`,
          examId: examIds[examIndex],
          submissionId: `SUB-2024-${String(i).padStart(3, "0")}`,
          studentName: `Student ${i}`,
          studentCode: `STU-${String(2024001 + i).padStart(6, "0")}`,
          examinerId: "EX-001",
          examinerName: "Dr. Nguyen Van A",
          status: "assigned",
          assignedAt: new Date(2024, 10, 1).toISOString(),
        },
        {
          id: `AS-${i}-2`,
          examId: examIds[examIndex],
          submissionId: `SUB-2024-${String(i).padStart(3, "0")}`,
          studentName: `Student ${i}`,
          studentCode: `STU-${String(2024001 + i).padStart(6, "0")}`,
          examinerId: "EX-002",
          examinerName: "Prof. Tran Thi B",
          status: "assigned",
          assignedAt: new Date(2024, 10, 1).toISOString(),
        }
      );
    } else {
      examiners.push({
        id: `AS-${i}-1`,
        examId: examIds[examIndex],
        submissionId: `SUB-2024-${String(i).padStart(3, "0")}`,
        studentName: `Student ${i}`,
        studentCode: `STU-${String(2024001 + i).padStart(6, "0")}`,
        examinerId: "EX-003",
        examinerName: "Dr. Le Van C",
        status: "assigned",
        assignedAt: new Date(2024, 10, 1).toISOString(),
      });
    }

    submissions.push({
      id: `SUB-2024-${String(i).padStart(3, "0")}`,
      examId: examIds[examIndex],
      examName: examNames[examIndex],
      studentId: `STU-${String(2024001 + i).padStart(6, "0")}`,
      studentName: `Student ${i}`,
      studentCode: `STU-${String(2024001 + i).padStart(6, "0")}`,
      classCode: `CS-${Math.floor(i / 10) + 1}`,
      submittedAt: new Date(2024, 10, Math.random() * 25 + 1).toISOString(),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      assignedExaminers: examiners,
    });
  }

  return submissions;
}

export function generateMockExaminerProfiles(): ExaminerProfile[] {
  return [
    {
      id: "EX-001",
      examId: "EX-001",
      examinerName: "Dr. Nguyen Van A",
      examinerId: "EX-001",
      assignedCount: 12,
      gradedCount: 8,
    },
    {
      id: "EX-002",
      examId: "EX-001",
      examinerName: "Prof. Tran Thi B",
      examinerId: "EX-002",
      assignedCount: 15,
      gradedCount: 12,
    },
    {
      id: "EX-003",
      examId: "EX-001",
      examinerName: "Dr. Le Van C",
      examinerId: "EX-003",
      assignedCount: 10,
      gradedCount: 10,
    },
    {
      id: "EX-004",
      examId: "EX-001",
      examinerName: "Assoc. Prof. Pham Thi D",
      examinerId: "EX-004",
      assignedCount: 14,
      gradedCount: 5,
    },
    {
      id: "EX-005",
      examId: "EX-001",
      examinerName: "Dr. Hoang Van E",
      examinerId: "EX-005",
      assignedCount: 11,
      gradedCount: 9,
    },
  ];
}

export function getExamList(): { id: string; name: string }[] {
  return [
    { id: "EX-001", name: "Midterm Exam - Spring 2024" },
    { id: "EX-002", name: "Final Exam - Spring 2024" },
    { id: "EX-003", name: "Quiz 1 - Spring 2024" },
  ];
}

export function getStatusBadgeColor(
  status: "pending" | "assigned" | "in-grading" | "completed"
): string {
  switch (status) {
    case "pending":
      return "bg-gray-100 text-gray-800";
    case "assigned":
      return "bg-blue-100 text-blue-800";
    case "in-grading":
      return "bg-yellow-100 text-yellow-800";
    case "completed":
      return "bg-green-100 text-green-800";
  }
}

export function getStatusLabel(
  status: "pending" | "assigned" | "in-grading" | "completed"
): string {
  switch (status) {
    case "pending":
      return "Pending";
    case "assigned":
      return "Assigned";
    case "in-grading":
      return "Grading";
    case "completed":
      return "Completed";
  }
}

export function calculateProgress(examiner: ExaminerProfile): number {
  if (examiner.assignedCount === 0) return 0;
  return Math.round((examiner.gradedCount / examiner.assignedCount) * 100);
}
