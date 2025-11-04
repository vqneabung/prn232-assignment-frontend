"use client";

import Link from "next/link";
import { CheckCircle2, Clock, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { generateMockGradeList } from "../utils";
import { getStatusLabel, getStatusColor } from "../utils";

export default function GradeListPage() {
  const grades = generateMockGradeList();

  // Statistics
  const totalCount = grades.length;
  const pendingCount = grades.filter((g) => g.status === "pending").length;
  const gradedCount = grades.filter((g) => g.status === "graded").length;
  const reviewedCount = grades.filter((g) => g.status === "reviewed").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Danh sách bài chấm</h1>
        <p className="text-muted-foreground mt-2">Quản lý và chấm bài nộp của sinh viên</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tổng bài nộp</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCount}</div>
            <p className="text-muted-foreground text-xs">bài chưa chấm hoặc đã chấm</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-600">Chưa chấm</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
            <p className="text-muted-foreground text-xs">đang chờ xử lý</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">Đã chấm</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{gradedCount}</div>
            <p className="text-muted-foreground text-xs">đã nhập điểm</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-600">Đã duyệt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{reviewedCount}</div>
            <p className="text-muted-foreground text-xs">double-graded</p>
          </CardContent>
        </Card>
      </div>

      {/* Grades Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách chi tiết</CardTitle>
          <CardDescription>Nhấn vào sinh viên để chấm bài hoặc xem chi tiết</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên sinh viên</TableHead>
                  <TableHead>Mã sinh viên</TableHead>
                  <TableHead>Mã lớp</TableHead>
                  <TableHead>Tình trạng</TableHead>
                  <TableHead className="text-right">Điểm số</TableHead>
                  <TableHead className="text-right">Chấm viên</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {grades.map((grade) => (
                  <TableRow key={grade.id}>
                    <TableCell className="font-medium">{grade.studentName}</TableCell>
                    <TableCell>{grade.studentCode}</TableCell>
                    <TableCell>{grade.classCode}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(grade.status)}>{getStatusLabel(grade.status)}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {grade.finalScore !== undefined ? (
                        <span className="font-semibold">{grade.finalScore}/100</span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {grade.graderCount > 0 ? (
                        <Badge variant="secondary">{grade.graderCount}</Badge>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/user/grade/student/${grade.id}`}>
                          {grade.status === "pending" ? (
                            <>
                              <Clock className="mr-2 h-4 w-4" />
                              Chấm bài
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              Xem chi tiết
                            </>
                          )}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
