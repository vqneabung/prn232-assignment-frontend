"use client";

import { useCallback, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Trash2, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  fetchStudentsInClass,
  addStudentToClass,
  removeStudentFromClass,
} from "../../handlers";
import { classApi } from "@/lib/api/class/class";
import { studentApi } from "@/lib/api/student/student";
import type { ClassResponse, StudentResponse } from "@/types/type";

interface PageProps {
  params: {
    classId: string;
  };
}

export default function ClassDetailPage({ params }: PageProps) {
  const router = useRouter();
  const classId = parseInt(params.classId);

  const [classData, setClassData] = useState<ClassResponse | null>(null);
  const [students, setStudents] = useState<StudentResponse[]>([]);
  const [availableStudents, setAvailableStudents] = useState<StudentResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);

      // Fetch class data
      const response = await classApi.getById(classId);
      if (response.success && response.data) {
        setClassData(response.data);
      } else {
        toast.error("Failed to load class data");
        router.back();
        return;
      }

      // Fetch students in this class
      const classStudents = await fetchStudentsInClass(classId);
      setStudents(classStudents);

      // Fetch all students to find available ones
      const allStudentsResponse = await studentApi.getAll();
      if (allStudentsResponse.success && Array.isArray(allStudentsResponse.data)) {
        const allStudents = allStudentsResponse.data;
        // Filter out students already in class
        const classStudentIds = new Set(classStudents.map((s) => s.studentId));
        const available = allStudents.filter((s) => !classStudentIds.has(s.studentId));
        setAvailableStudents(available);
      }
    } catch (error) {
      console.error("Error loading class details:", error);
      toast.error("Failed to load class details");
    } finally {
      setIsLoading(false);
    }
  }, [classId, router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddStudent = async () => {
    if (!selectedStudentId) {
      toast.error("Please select a student");
      return;
    }

    setIsAddingStudent(true);
    try {
      const success = await addStudentToClass(classId, selectedStudentId);
      if (success) {
        setSelectedStudentId(null);
        setIsDialogOpen(false);
        await loadData();
      }
    } catch (error) {
      console.error("Error adding student:", error);
      toast.error("Failed to add student");
    } finally {
      setIsAddingStudent(false);
    }
  };

  const handleRemoveStudent = async (studentId: number) => {
    if (!confirm("Are you sure you want to remove this student from the class?")) {
      return;
    }

    try {
      const success = await removeStudentFromClass(classId, studentId);
      if (success) {
        await loadData();
      }
    } catch (error) {
      console.error("Error removing student:", error);
      toast.error("Failed to remove student");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Go Back
        </Button>
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-center">Class not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" onClick={() => router.back()} className="gap-2 mb-4">
          <ArrowLeft className="h-4 w-4" />
          Go Back
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">{classData.className}</h1>
        <p className="text-muted-foreground">Manage students in this class</p>
      </div>

      {/* Class Info Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Class Name</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">{classData.className}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Semester</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">{classData.semester}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">{students.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Available to Add</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">{availableStudents.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Students List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Enrolled Students</CardTitle>
              <CardDescription>Total: {students.length} students</CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Student
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Student to Class</DialogTitle>
                  <DialogDescription>
                    Select a student to add to {classData.className}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="max-h-48 overflow-y-auto border rounded-md">
                    {availableStudents.length > 0 ? (
                      <div className="space-y-1">
                        {availableStudents.map((student) => (
                          <button
                            key={student.studentId}
                            onClick={() => setSelectedStudentId(student.studentId)}
                            className={`w-full text-left px-4 py-2 hover:bg-accent transition-colors ${
                              selectedStudentId === student.studentId ? "bg-accent" : ""
                            }`}
                          >
                            <div className="font-medium">{student.studentCode}</div>
                            <div className="text-sm text-muted-foreground">{student.fullName}</div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-muted-foreground">
                        No students available to add
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddStudent}
                      disabled={!selectedStudentId || isAddingStudent}
                    >
                      {isAddingStudent ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        "Add Student"
                      )}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {students.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">No students enrolled in this class yet</p>
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Code</TableHead>
                    <TableHead>Full Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Submissions</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.studentId}>
                      <TableCell className="font-medium">{student.studentCode}</TableCell>
                      <TableCell>{student.fullName ?? "N/A"}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {student.email ?? "N/A"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{student.submissionCount}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveStudent(student.studentId)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
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
