import { GradeListItem, SubmissionGrade, GradingRubric, GraderScore, GradingCriteria } from "./types";

/**
 * Generate mock grading rubrics
 */
export function generateMockRubrics(): GradingRubric[] {
  return [
    {
      id: "rubric-1",
      name: "Tính chính xác của code",
      description: "Code hoạt động đúng theo yêu cầu",
      maxScore: 30,
      weight: 30,
    },
    {
      id: "rubric-2",
      name: "Chất lượng code",
      description: "Code sạch, dễ đọc, và tuân theo best practices",
      maxScore: 25,
      weight: 25,
    },
    {
      id: "rubric-3",
      name: "Hiệu suất",
      description: "Hiệu suất tối ưu, không có memory leak",
      maxScore: 20,
      weight: 20,
    },
    {
      id: "rubric-4",
      name: "Tài liệu & Comment",
      description: "Có documentation và comment rõ ràng",
      maxScore: 15,
      weight: 15,
    },
    {
      id: "rubric-5",
      name: "Test Coverage",
      description: "Có test cases hợp lý",
      maxScore: 10,
      weight: 10,
    },
  ];
}

/**
 * Generate grading criteria from rubrics
 */
export function generateGradingCriteria(): GradingCriteria {
  const rubrics = generateMockRubrics();
  return {
    rubrics,
    totalWeight: rubrics.reduce((sum, r) => sum + r.weight, 0),
    minScore: 0,
    maxScore: 100,
  };
}

/**
 * Generate mock grade list items
 */
export function generateMockGradeList(): GradeListItem[] {
  const statuses = ["pending", "graded", "reviewed"] as const;
  const classNames = ["IT1", "IT2", "IT3"];
  const count = 12;

  const items: GradeListItem[] = [];

  for (let i = 0; i < count; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const isGraded = status !== "pending";

    items.push({
      id: `grade-${i}`,
      studentId: `${20}IT${String(i).padStart(3, "0")}`,
      studentName: `Nguyễn Văn ${String.fromCharCode(65 + (i % 26))}`,
      studentCode: `SV${String(i).padStart(5, "0")}`,
      classCode: classNames[i % 3],
      status,
      finalScore: isGraded ? Math.floor(Math.random() * 40) + 60 : undefined,
      graderCount: isGraded ? Math.floor(Math.random() * 2) + 1 : 0,
      submittedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    });
  }

  return items;
}

/**
 * Generate mock submission grade detail
 */
export function generateMockSubmissionGrade(studentId: string): SubmissionGrade {
  const rubrics = generateMockRubrics();
  const statuses = ["pending", "graded", "reviewed"] as const;
  const status = statuses[Math.floor(Math.random() * statuses.length)];

  // Generate grader scores for double grading
  const graderScores: GraderScore[] = [];

  if (status !== "pending") {
    // First grader
    const rubricScores1: Record<string, number> = {};
    let totalScore1 = 0;

    rubrics.forEach((rubric) => {
      const score = Math.floor(Math.random() * (rubric.maxScore * 0.6)) + rubric.maxScore * 0.4;
      rubricScores1[rubric.id] = score;
      totalScore1 += (score / rubric.maxScore) * rubric.weight;
    });

    graderScores.push({
      id: `grader-score-1`,
      graderId: `examiner-1`,
      graderName: "Trần Thị Lệ",
      score: Math.round(totalScore1),
      feedback: "Code tốt, cần cải thiện documentation",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      rubricScores: rubricScores1,
    });

    // Second grader (if double-graded)
    if (status === "reviewed") {
      const rubricScores2: Record<string, number> = {};
      let totalScore2 = 0;

      rubrics.forEach((rubric) => {
        const score = Math.floor(Math.random() * (rubric.maxScore * 0.6)) + rubric.maxScore * 0.4;
        rubricScores2[rubric.id] = score;
        totalScore2 += (score / rubric.maxScore) * rubric.weight;
      });

      graderScores.push({
        id: `grader-score-2`,
        graderId: `examiner-2`,
        graderName: "Phạm Văn Đông",
        score: Math.round(totalScore2),
        feedback: "Tổng thể tốt, hiệu suất có thể tối ưu hơn",
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        rubricScores: rubricScores2,
      });
    }
  }

  // Calculate final score (average if multiple graders)
  let finalScore: number | undefined;
  if (graderScores.length > 0) {
    finalScore = Math.round(graderScores.reduce((sum, score) => sum + score.score, 0) / graderScores.length);
  }

  return {
    id: `submission-${studentId}`,
    submissionId: `sub-${Date.now()}`,
    studentId,
    studentName: `Nguyễn Văn A`,
    studentCode: `SV00001`,
    classCode: "IT1",
    status,
    finalScore,
    graderScores,
    submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    gradedAt: status !== "pending" ? new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() : undefined,
  };
}

/**
 * Calculate final score from rubric scores
 */
export function calculateFinalScore(rubricScores: Record<string, number>, rubrics: GradingRubric[]): number {
  let totalScore = 0;

  rubrics.forEach((rubric) => {
    const score = rubricScores[rubric.id] || 0;
    totalScore += (score / rubric.maxScore) * rubric.weight;
  });

  return Math.round(totalScore);
}

/**
 * Format status badge text
 */
export function getStatusLabel(status: string): string {
  switch (status) {
    case "pending":
      return "Chưa chấm";
    case "graded":
      return "Đã chấm";
    case "reviewed":
      return "Đã duyệt";
    default:
      return status;
  }
}

/**
 * Format status badge color
 */
export function getStatusColor(status: string): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "pending":
      return "destructive";
    case "graded":
      return "default";
    case "reviewed":
      return "default";
    default:
      return "default";
  }
}
