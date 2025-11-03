"use client";

import { Plus, Edit, Trash2, Clock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { handleDeleteExam } from "../../handlers";
import { generateMockExams, getStatusColor, getStatusLabel } from "../../utils";

export default function AdminExamsPage() {
  const exams = generateMockExams();
  const publishedExams = exams.filter((e) => e.status === "published").length;
  const totalSubmissions = exams.reduce((sum, e) => sum + e.totalSubmissions, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Exams</h1>
          <p className="text-muted-foreground">Create and configure exams</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Exam
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{exams.length}</div>
            <p className="text-xs text-muted-foreground">All exams</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{publishedExams}</div>
            <p className="text-xs text-muted-foreground">Active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSubmissions}</div>
            <p className="text-xs text-muted-foreground">Expected</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Draft</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{exams.filter((e) => e.status === "draft").length}</div>
            <p className="text-xs text-muted-foreground">Not yet published</p>
          </CardContent>
        </Card>
      </div>

      {/* Exams Table */}
      <Card>
        <CardHeader>
          <CardTitle>Exam List</CardTitle>
          <CardDescription>All scheduled exams</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Expected</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exams.map((exam) => (
                  <TableRow key={exam.id}>
                    <TableCell className="font-mono text-sm font-semibold">{exam.code}</TableCell>
                    <TableCell className="font-medium">{exam.name}</TableCell>
                    <TableCell className="text-sm">{exam.subjectId}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {exam.examDate} {exam.examTime}
                    </TableCell>
                    <TableCell className="text-sm flex items-center gap-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      {exam.duration} min
                    </TableCell>
                    <TableCell className="text-sm font-medium">{exam.totalSubmissions}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(exam.status)}>
                        {getStatusLabel(exam.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteExam(exam.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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
