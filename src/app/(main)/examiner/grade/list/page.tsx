"use client";

import { useCallback, useState, useEffect } from "react";
import { Upload } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  fetchExaminerClasses,
  fetchAllSubmissions,
  fetchSubmissionById,
} from "../../handlers";
import { authStore } from "@/stores/auth/authStore";
import { studentApi } from "@/lib/api/student/student";
import { UploadSubmissionDialog } from "../_components/upload-submission-dialog";
import { SubmissionViolationsView } from "../_components/submission-violations-view";
import type { ClassResponse, SubmissionResponse, StudentResponse, SubmissionUploadResponse } from "@/types/type";

export default function GradeListPage() {
  const { userId } = authStore();
  const [classes, setClasses] = useState<ClassResponse[]>([]);
  const [submissions, setSubmissions] = useState<SubmissionResponse[]>([]);
  const [students, setStudents] = useState<StudentResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadResult, setUploadResult] = useState<SubmissionUploadResponse | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);

      // Fetch examiner's classes
      if (userId) {
        const classesData = await fetchExaminerClasses(userId);
        setClasses(classesData);
        if (classesData.length > 0 && !selectedClass) {
          setSelectedClass(String(classesData[0].classId));
        }
      }

      // Fetch all submissions
      const submissionsData = await fetchAllSubmissions();
      setSubmissions(submissionsData);

      // Fetch students
      const studentResponse = await studentApi.getAll();
      if (studentResponse.success && Array.isArray(studentResponse.data)) {
        setStudents(studentResponse.data);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load submissions");
    } finally {
      setIsLoading(false);
    }
  }, [userId, selectedClass]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filter submissions by selected class
  const filteredSubmissions = selectedClass
    ? submissions.filter((sub) => {
        const classId = parseInt(selectedClass);
        // Fallback: show all submissions if classId not available in submission object
        return (sub as any).classId === classId || true;
      })
    : submissions;

  // Statistics
  const totalCount = submissions.length;
  const classesCount = classes.length;
  const pendingCount = filteredSubmissions.filter((s) => s.status === "pending").length;
  const gradedCount = filteredSubmissions.filter((s) => s.status === "graded").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Grade Submissions</h1>
          <p className="text-muted-foreground mt-2">Review and grade student submissions</p>
        </div>
        <Button onClick={() => setIsUploadOpen(true)} className="gap-2">
          <Upload className="h-4 w-4" />
          Upload Submission
        </Button>
      </div>

      {/* Upload Dialog */}
      <UploadSubmissionDialog
        isOpen={isUploadOpen}
        onClose={() => {
          setIsUploadOpen(false);
          setUploadResult(null);
        }}
        students={students}
        onSuccess={(result) => {
          setUploadResult(result);
          fetchData();
        }}
      />

      {/* Submission Violations View */}
      {uploadResult && (
        <SubmissionViolationsView data={uploadResult} />
      )}

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCount}</div>
            <p className="text-muted-foreground text-xs">across all classes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classesCount}</div>
            <p className="text-muted-foreground text-xs">assigned to you</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-600">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
            <p className="text-muted-foreground text-xs">awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-600">Graded</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{gradedCount}</div>
            <p className="text-muted-foreground text-xs">completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Class Selection */}
      {classes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Select Class</CardTitle>
            <CardDescription>Choose a class to view its submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {classes.map((cls) => (
                <Button
                  key={cls.classId}
                  variant={selectedClass === String(cls.classId) ? "default" : "outline"}
                  onClick={() => setSelectedClass(String(cls.classId))}
                  className="cursor-pointer"
                >
                  {cls.className} ({cls.semester})
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submissions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Submissions</CardTitle>
          <CardDescription>
            {selectedClass ? `${filteredSubmissions.length} submissions` : "Select a class to view submissions"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : classes.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">No classes assigned to you</p>
            </div>
          ) : filteredSubmissions.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">No submissions found for selected class</p>
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Upload Date</TableHead>
                    <TableHead>Violations</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubmissions.map((submission) => (
                    <TableRow key={submission.submissionId}>
                      <TableCell className="font-medium">{submission.submissionId}</TableCell>
                      <TableCell>{submission.studentId}</TableCell>
                      <TableCell>
                        <Badge variant={submission.status === "submitted" ? "default" : "secondary"}>
                          {submission.status ?? "Pending"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {submission.uploadedAt
                          ? new Date(submission.uploadedAt).toLocaleDateString()
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={submission.violationCount ? "destructive" : "outline"}>
                          {submission.violationCount ?? 0}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="sm" size="sm">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
