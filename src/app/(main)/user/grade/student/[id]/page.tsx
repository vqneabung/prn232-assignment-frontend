"use client";

import { useState } from "react";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { generateGradingCriteria, generateMockSubmissionGrade, getStatusColor, getStatusLabel } from "../../utils";
import { GraderScoresDisplay } from "./_components/grader-scores-display";
import { GradingForm } from "./_components/grading-form";

interface PageProps {
  params: {
    id: string;
  };
}

export default function StudentGradePage({ params }: PageProps) {
  const { id } = params;
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load mock data
  const submission = generateMockSubmissionGrade(id);
  const { rubrics } = generateGradingCriteria();

  const handleSubmitGrade = async (data: {
    rubricScores: Record<string, number>;
    feedback: string;
    finalScore: number;
  }) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Grade submitted:", data);
      alert(`Điểm số đã gửi: ${data.finalScore}/100`);
    } catch (error) {
      console.error("Error submitting grade:", error);
      alert("Lỗi khi gửi điểm số");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="icon">
              <Link href="/user/grade/list">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Chi tiết chấm bài</h1>
          </div>
          <p className="text-muted-foreground">
            Quay lại{" "}
            <Link href="/user/grade/list" className="underline">
              danh sách bài chấm
            </Link>
          </p>
        </div>
      </div>

      {/* Student Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin sinh viên</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-muted-foreground text-sm">Tên sinh viên</p>
              <p className="font-semibold">{submission.studentName}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Mã sinh viên</p>
              <p className="font-semibold">{submission.studentCode}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Mã lớp</p>
              <p className="font-semibold">{submission.classCode}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Tình trạng</p>
              <Badge variant={getStatusColor(submission.status)} className="mt-1">
                {getStatusLabel(submission.status)}
              </Badge>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Ngày nộp</p>
              <p className="font-semibold">{new Date(submission.submittedAt).toLocaleDateString("vi-VN")}</p>
            </div>
            {submission.gradedAt && (
              <div>
                <p className="text-muted-foreground text-sm">Ngày chấm</p>
                <p className="font-semibold">{new Date(submission.gradedAt).toLocaleDateString("vi-VN")}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Show grading form if not yet graded or for re-grading */}
          {submission.status === "pending" && (
            <GradingForm rubrics={rubrics} onSubmit={handleSubmitGrade} isLoading={isSubmitting} />
          )}

          {/* Show existing grades if already graded */}
          {submission.graderScores.length > 0 && (
            <GraderScoresDisplay
              graderScores={submission.graderScores}
              rubrics={rubrics}
              averageScore={submission.finalScore}
            />
          )}
        </div>

        {/* Sidebar - Submission Info */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Chi tiết bài nộp</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground text-xs">ID Bài nộp</p>
                <p className="font-mono text-xs break-all">{submission.submissionId}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Số chấm viên</p>
                <p className="font-semibold">{submission.graderScores.length}</p>
              </div>
              {submission.finalScore !== undefined && (
                <div>
                  <p className="text-muted-foreground text-xs">Điểm cuối cùng</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {submission.finalScore}
                    <span className="text-muted-foreground text-sm">/100</span>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Download/View Submission */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Tài liệu</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm" className="w-full">
                Xem bài nộp
              </Button>
              <Button variant="outline" size="sm" className="mt-2 w-full">
                Tải xuống
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
