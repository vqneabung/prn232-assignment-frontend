"use client";

import { useCallback, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Upload, Loader2, Shield, Database } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import {
  fetchExaminerClasses,
  fetchSubmissionsByClass,
  fetchCurrentUser,
} from "../../handlers";
import { authStore } from "@/stores/auth/authStore";
import { studentApi } from "@/lib/api/student/student";
import { UploadSubmissionDialog } from "../_components/upload-submission-dialog";
import { SubmissionViolationsView } from "../_components/submission-violations-view";
import type { ClassResponse, SubmissionResponse, StudentResponse, SubmissionUploadResponse } from "@/types/type";

export default function GradeListPage() {
  const router = useRouter();
  const { userId: storedUserId, setUserId } = authStore();
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

      // Fetch current user to get userId
      let examinerId = storedUserId;
      if (!examinerId) {
        const currentUser = await fetchCurrentUser();
        if (currentUser && currentUser.userId) {
          examinerId = currentUser.userId;
          setUserId(currentUser.userId);
        } else {
          toast.error("Failed to get user information");
          setIsLoading(false);
          return;
        }
      }

      // Fetch examiner's classes
      const classesData = await fetchExaminerClasses(examinerId);
      setClasses(classesData);
      if (classesData.length > 0) {
        const classToLoad = selectedClass ?? String(classesData[0].classId);
        setSelectedClass(classToLoad);

        // Fetch submissions for the selected class
        const submissionsData = await fetchSubmissionsByClass(parseInt(classToLoad));
        setSubmissions(submissionsData);
      }

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
  }, [storedUserId, selectedClass, setUserId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleClassChange = useCallback(async (classId: string) => {
    setSelectedClass(classId);
    try {
      const submissionsData = await fetchSubmissionsByClass(parseInt(classId));
      setSubmissions(submissionsData);
    } catch (error) {
      console.error("Error loading submissions:", error);
      toast.error("Failed to load submissions");
    }
  }, []);

  // Statistics
  const totalCount = submissions.length;
  const classesCount = classes.length;
  const pendingCount = submissions.filter((s) => s.status === "pending").length;
  const gradedCount = submissions.filter((s) => s.status === "graded").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Grade Submissions</h1>
          <p className="text-muted-foreground mt-2">Review and grade student submissions</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => router.push("/examiner/plagiarism/store")}
            variant="outline"
            className="gap-2"
          >
            <Database className="h-4 w-4" />
            Store Submission
          </Button>
          <Button
            onClick={() => router.push("/examiner/plagiarism/check")}
            variant="outline"
            className="gap-2"
          >
            <Shield className="h-4 w-4" />
            Check Plagiarism
          </Button>
          <Button
            onClick={() => router.push("/examiner/grade/batch")}
            variant="outline"
            className="gap-2"
          >
            <Upload className="h-4 w-4" />
            Batch Grading
          </Button>
          <Button onClick={() => setIsUploadOpen(true)} className="gap-2">
            <Upload className="h-4 w-4" />
            Upload Submission
          </Button>
        </div>
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
                  onClick={() => handleClassChange(String(cls.classId))}
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
          {selectedClass ? `${submissions.length} submissions` : "Select a class to view submissions"}
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
          ) : submissions.length === 0 ? (
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
                  {submissions.map((submission) => (
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
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/examiner/grade/detail?id=${submission.submissionId}`)}
                        >
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
