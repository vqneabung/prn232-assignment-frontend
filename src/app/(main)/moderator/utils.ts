import { Complaint, ZeroPointSubmission } from "./types";

export function generateMockComplaints(): Complaint[] {
  const complaints: Complaint[] = [];
  const complaintTypes = [
    "grading_dispute",
    "unfair_treatment",
    "technical_issue",
    "marking_error",
    "missing_submission",
  ];
  const statuses = ["submitted", "under-review", "resolved", "rejected"] as const;
  const priorities = ["low", "medium", "high"] as const;

  for (let i = 1; i <= 12; i++) {
    complaints.push({
      id: `COMP-${String(i).padStart(3, "0")}`,
      submissionId: `SUB-2024-${String(i * 2).padStart(3, "0")}`,
      studentCode: `STU-${String(2024001 + i * 2).padStart(6, "0")}`,
      studentName: `Student ${i * 2}`,
      examName: i % 2 === 0 ? "Midterm Exam - Spring 2024" : "Final Exam - Spring 2024",
      complaintType: complaintTypes[Math.floor(Math.random() * complaintTypes.length)],
      description: `Complaint description for submission ${i * 2}. This is a detailed description of the issue raised by the student.`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      submittedAt: new Date(2024, 10, Math.random() * 20 + 1).toISOString(),
      submittedBy: `STU-${String(2024001 + i * 2).padStart(6, "0")}`,
      assignedTo: i % 2 === 0 ? "Dr. Moderator" : undefined,
      resolution: statuses[Math.floor(Math.random() * statuses.length)] === "resolved"
        ? "Reviewed and resolved"
        : undefined,
      resolvedAt: statuses[Math.floor(Math.random() * statuses.length)] === "resolved"
        ? new Date(2024, 10, Math.random() * 20 + 15).toISOString()
        : undefined,
    });
  }

  return complaints;
}

export function generateMockZeroPointSubmissions(): ZeroPointSubmission[] {
  const submissions: ZeroPointSubmission[] = [];
  const reasons = [
    "No submission received",
    "Blank/Empty submission",
    "Plagiarism - Full copy",
    "Off-topic submission",
    "Technical incompatibility",
    "Incomplete attempt",
  ];
  const statuses = ["pending", "verified", "dismissed", "needs-investigation"] as const;

  for (let i = 1; i <= 8; i++) {
    submissions.push({
      id: `ZERO-${String(i).padStart(3, "0")}`,
      submissionId: `SUB-2024-${String(50 + i).padStart(3, "0")}`,
      studentCode: `STU-${String(2025001 + i).padStart(6, "0")}`,
      studentName: `Student ${50 + i}`,
      examName: i % 2 === 0 ? "Midterm Exam - Spring 2024" : "Final Exam - Spring 2024",
      reason: reasons[Math.floor(Math.random() * reasons.length)],
      giaderedBy: i % 2 === 0 ? "Dr. Nguyen Van A" : "Prof. Tran Thi B",
      gradedAt: new Date(2024, 10, Math.random() * 15 + 1).toISOString(),
      verificationStatus: statuses[Math.floor(Math.random() * statuses.length)],
      verifiedBy: i % 3 === 0 ? "Dr. Moderator" : undefined,
      verifiedAt: i % 3 === 0 ? new Date(2024, 10, Math.random() * 20 + 10).toISOString() : undefined,
      notes: i % 3 === 0 ? "Verified as legitimate zero-point case" : undefined,
    });
  }

  return submissions;
}

export function generateMockFairnessData() {
  return [
    {
      submissionId: "SUB-2024-001",
      examiner1: "Dr. Nguyen Van A",
      examiner1Score: 85,
      examiner2: "Prof. Tran Thi B",
      examiner2Score: 92,
      delta: 7,
      deltaPercent: 8.2,
    },
    {
      submissionId: "SUB-2024-005",
      examiner1: "Dr. Le Van C",
      examiner1Score: 70,
      examiner2: "Dr. Hoang Van E",
      examiner2Score: 45,
      delta: 25,
      deltaPercent: 35.7,
    },
    {
      submissionId: "SUB-2024-012",
      examiner1: "Prof. Tran Thi B",
      examiner1Score: 88,
      examiner2: "Dr. Nguyen Van A",
      examiner2Score: 82,
      delta: 6,
      deltaPercent: 6.8,
    },
    {
      submissionId: "SUB-2024-018",
      examiner1: "Dr. Hoang Van E",
      examiner1Score: 65,
      examiner2: "Dr. Le Van C",
      examiner2Score: 55,
      delta: 10,
      deltaPercent: 15.4,
    },
    {
      submissionId: "SUB-2024-025",
      examiner1: "Dr. Nguyen Van A",
      examiner1Score: 92,
      examiner2: "Prof. Tran Thi B",
      examiner2Score: 78,
      delta: 14,
      deltaPercent: 15.2,
    },
  ];
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case "low":
      return "bg-blue-100 text-blue-800";
    case "medium":
      return "bg-yellow-100 text-yellow-800";
    case "high":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "open":
    case "pending-verification":
      return "bg-red-100 text-red-800";
    case "under-review":
      return "bg-yellow-100 text-yellow-800";
    case "resolved":
    case "verified":
      return "bg-green-100 text-green-800";
    case "rejected":
      return "bg-gray-100 text-gray-800";
    case "closed":
      return "bg-gray-200 text-gray-900";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export function getStatusLabel(status: string): string {
  return status
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
