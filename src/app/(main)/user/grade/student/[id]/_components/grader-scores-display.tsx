"use client";

import { User, Calendar, FileText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import { GraderScore, GradingRubric } from "../../../types";

interface GraderScoresDisplayProps {
  graderScores: GraderScore[];
  rubrics: GradingRubric[];
  averageScore?: number;
}

export function GraderScoresDisplay({
  graderScores,
  rubrics,
  averageScore,
}: GraderScoresDisplayProps) {
  if (graderScores.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Kết quả chấm điểm</h3>
        <p className="text-sm text-muted-foreground">
          {graderScores.length} chấm viên đã chấm bài này
        </p>
      </div>

      {averageScore !== undefined && graderScores.length > 1 && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Điểm số trung bình</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="text-3xl font-bold text-green-600">{averageScore}</div>
              <Progress value={averageScore} className="flex-1 h-2" />
              <span className="text-sm text-muted-foreground">/ 100</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Individual Grader Scores */}
      <div className="space-y-3">
        {graderScores.map((graderScore, idx) => (
          <Card key={graderScore.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      Chấm viên {idx + 1}
                    </Badge>
                  </div>
                  <h4 className="font-semibold mt-1">{graderScore.graderName}</h4>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{graderScore.score}</div>
                  <span className="text-xs text-muted-foreground">/ 100</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Score by Rubric */}
              <div className="space-y-2">
                <h5 className="text-sm font-medium">Chi tiết điểm:</h5>
                <div className="space-y-2">
                  {rubrics.map((rubric) => {
                    const score = graderScore.rubricScores[rubric.id] || 0;
                    const percentage = Math.round((score / rubric.maxScore) * 100);

                    return (
                      <div key={rubric.id} className="text-sm">
                        <div className="flex justify-between mb-1">
                          <span className="text-muted-foreground">{rubric.name}</span>
                          <span className="font-medium">
                            {score}/{rubric.maxScore} ({percentage}%)
                          </span>
                        </div>
                        <Progress value={percentage} className="h-1.5" />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Feedback */}
              {graderScore.feedback && (
                <div className="bg-muted/50 rounded p-3">
                  <div className="flex gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Nhận xét:</p>
                      <p className="text-sm">{graderScore.feedback}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div className="flex gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>{graderScore.graderName}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(graderScore.timestamp).toLocaleDateString("vi-VN")}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
