import { Subject, Semester, Exam, ResultApproval } from "./types";

export function generateMockSubjects(): Subject[] {
  return [
    {
      id: "SUBJ-001",
      code: "CS101",
      name: "Introduction to Computer Science",
      description: "Fundamentals of computer science and programming",
      credits: 3,
      status: "active",
      createdAt: new Date(2024, 9, 1).toISOString(),
      updatedAt: new Date(2024, 10, 1).toISOString(),
    },
    {
      id: "SUBJ-002",
      code: "CS102",
      name: "Data Structures",
      description: "Core data structures and algorithms",
      credits: 4,
      status: "active",
      createdAt: new Date(2024, 9, 1).toISOString(),
      updatedAt: new Date(2024, 10, 2).toISOString(),
    },
    {
      id: "SUBJ-003",
      code: "MATH101",
      name: "Calculus I",
      description: "Differential and integral calculus",
      credits: 4,
      status: "active",
      createdAt: new Date(2024, 9, 5).toISOString(),
      updatedAt: new Date(2024, 10, 3).toISOString(),
    },
    {
      id: "SUBJ-004",
      code: "PHYS101",
      name: "Physics I",
      description: "Classical mechanics and thermodynamics",
      credits: 4,
      status: "active",
      createdAt: new Date(2024, 9, 10).toISOString(),
      updatedAt: new Date(2024, 10, 4).toISOString(),
    },
    {
      id: "SUBJ-005",
      code: "CHEM101",
      name: "General Chemistry",
      description: "Basic chemistry principles",
      credits: 3,
      status: "active",
      createdAt: new Date(2024, 9, 15).toISOString(),
      updatedAt: new Date(2024, 10, 5).toISOString(),
    },
  ];
}

export function generateMockSemesters(): Semester[] {
  return [
    {
      id: "SEM-001",
      code: "SPRING-2024",
      name: "Spring 2024",
      startDate: "2024-02-01",
      endDate: "2024-05-31",
      status: "finished",
      description: "Spring 2024 semester",
      createdAt: new Date(2024, 0, 1).toISOString(),
    },
    {
      id: "SEM-002",
      code: "SUMMER-2024",
      name: "Summer 2024",
      startDate: "2024-06-01",
      endDate: "2024-08-31",
      status: "finished",
      description: "Summer 2024 semester",
      createdAt: new Date(2024, 5, 1).toISOString(),
    },
    {
      id: "SEM-003",
      code: "FALL-2024",
      name: "Fall 2024",
      startDate: "2024-09-01",
      endDate: "2024-12-31",
      status: "ongoing",
      description: "Fall 2024 semester",
      createdAt: new Date(2024, 8, 1).toISOString(),
    },
    {
      id: "SEM-004",
      code: "WINTER-2024",
      name: "Winter 2024",
      startDate: "2025-01-01",
      endDate: "2025-01-31",
      status: "planning",
      description: "Winter 2024 semester",
      createdAt: new Date(2024, 10, 1).toISOString(),
    },
  ];
}

export function generateMockExams(): Exam[] {
  return [
    {
      id: "EXAM-001",
      code: "CS101-MIDTERM",
      name: "CS101 Midterm Exam",
      subjectId: "SUBJ-001",
      semesterId: "SEM-003",
      examDate: "2024-10-15",
      examTime: "09:00",
      duration: 120,
      totalSubmissions: 120,
      status: "published",
      description: "Midterm examination for Introduction to Computer Science",
      createdAt: new Date(2024, 9, 1).toISOString(),
      updatedAt: new Date(2024, 10, 1).toISOString(),
    },
    {
      id: "EXAM-002",
      code: "CS101-FINAL",
      name: "CS101 Final Exam",
      subjectId: "SUBJ-001",
      semesterId: "SEM-003",
      examDate: "2024-12-20",
      examTime: "14:00",
      duration: 180,
      totalSubmissions: 120,
      status: "draft",
      description: "Final examination for Introduction to Computer Science",
      createdAt: new Date(2024, 9, 1).toISOString(),
      updatedAt: new Date(2024, 10, 1).toISOString(),
    },
    {
      id: "EXAM-003",
      code: "MATH101-MIDTERM",
      name: "MATH101 Midterm Exam",
      subjectId: "SUBJ-003",
      semesterId: "SEM-003",
      examDate: "2024-10-22",
      examTime: "10:00",
      duration: 120,
      totalSubmissions: 95,
      status: "published",
      description: "Midterm examination for Calculus I",
      createdAt: new Date(2024, 9, 5).toISOString(),
      updatedAt: new Date(2024, 10, 2).toISOString(),
    },
  ];
}

export function generateMockResultApprovals(): ResultApproval[] {
  return [
    {
      id: "APPR-001",
      examId: "EXAM-002",
      examName: "CS101 Final Exam",
      totalStudents: 120,
      completedGrading: 118,
      averageScore: 76.5,
      status: "pending",
      submittedAt: new Date(2024, 10, 3).toISOString(),
      approvedBy: undefined,
      approvedAt: undefined,
    },
    {
      id: "APPR-002",
      examId: "EXAM-001",
      examName: "CS101 Midterm Exam",
      totalStudents: 120,
      completedGrading: 120,
      averageScore: 72.3,
      status: "approved",
      submittedAt: new Date(2024, 10, 1).toISOString(),
      approvedBy: "Admin",
      approvedAt: new Date(2024, 10, 2).toISOString(),
    },
    {
      id: "APPR-003",
      examId: "EXAM-003",
      examName: "MATH101 Midterm Exam",
      totalStudents: 85,
      completedGrading: 83,
      averageScore: 68.9,
      status: "pending",
      submittedAt: new Date(2024, 10, 4).toISOString(),
      approvedBy: undefined,
      approvedAt: undefined,
    },
  ];
}

export function getStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    finished: "bg-green-100 text-green-800",
    ongoing: "bg-blue-100 text-blue-800",
    planning: "bg-gray-100 text-gray-800",
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    active: "bg-blue-100 text-blue-800",
    published: "bg-green-100 text-green-800",
    draft: "bg-gray-100 text-gray-800",
    closed: "bg-gray-200 text-gray-900",
  };
  return colorMap[status] || "bg-gray-100 text-gray-800";
}

export function getStatusLabel(status: string): string {
  return status
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
