"use client";

import { Plus, Edit, Trash2, Users, Upload, Download, FileSpreadsheet } from "lucide-react";
import { useState, useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { studentApi } from "@/lib/api/student/student";
import { handleDeleteStudent, handleImportStudents } from "../../handlers";
import type { StudentResponse } from "@/types/type";
import { toast } from "sonner";
import { StudentDialog } from "../../_components/dialogs/student-dialog";

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<StudentResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isStudentDialogOpen, setIsStudentDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentResponse | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [defaultSemester, setDefaultSemester] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const response = await studentApi.getAll();
      if (response.success && response.data) {
        setStudents(response.data);
      } else {
        setStudents([]);
      }
    } catch (err) {
      console.error("Error loading students:", err);
      setStudents([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (studentId: string | number) => {
    await handleDeleteStudent(String(studentId));
    fetchStudents();
  };

  const handleOpenCreateDialog = () => {
    setSelectedStudent(null);
    setIsStudentDialogOpen(true);
  };

  const handleOpenEditDialog = (student: StudentResponse) => {
    setSelectedStudent(student);
    setIsStudentDialogOpen(true);
  };

  const handleDownloadTemplate = async () => {
    try {
      const response = await studentApi.getImportTemplate();
      if (response.success && response.data) {
        // Create blob URL and download
        const url = window.URL.createObjectURL(response.data);
        const a = document.createElement("a");
        a.href = url;
        a.download = "student_import_template.xlsx";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success("Template downloaded successfully");
      } else {
        toast.error("Failed to download template");
      }
    } catch (error) {
      console.error("Error downloading template:", error);
      toast.error("An error occurred while downloading template");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) {
      toast.error("Please select a file to import");
      return;
    }

    if (!defaultSemester) {
      toast.error("Please enter default semester");
      return;
    }

    await handleImportStudents(selectedFile, defaultSemester);
    setIsImportOpen(false);
    setSelectedFile(null);
    setDefaultSemester("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    fetchStudents();
  };

  const activeStudents = students.filter((s) => s.status === "active").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Students</h1>
          <p className="text-muted-foreground">Create and manage student records</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Upload className="h-4 w-4" />
                Import Excel
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Import Students from Excel</DialogTitle>
                <DialogDescription>
                  Upload an Excel file to import multiple students at once. Download the template to see the required
                  format.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="semester">Default Semester</Label>
                  <Input
                    id="semester"
                    placeholder="e.g., Fall 2024"
                    value={defaultSemester}
                    onChange={(e) => setDefaultSemester(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="file">Excel File</Label>
                  <Input
                    id="file"
                    type="file"
                    accept=".xlsx,.xls"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                  {selectedFile && <p className="text-sm text-muted-foreground">Selected: {selectedFile.name}</p>}
                </div>
                <div className="flex justify-between">
                  <Button variant="outline" size="sm" onClick={handleDownloadTemplate} className="gap-2">
                    <Download className="h-4 w-4" />
                    Download Template
                  </Button>
                  <Button onClick={handleImport}>Import</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button className="gap-2" onClick={handleOpenCreateDialog}>
            <Plus className="h-4 w-4" />
            New Student
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
            <p className="text-muted-foreground text-xs">Registered in system</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeStudents}</div>
            <p className="text-muted-foreground text-xs">Currently enrolled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Inactive</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length - activeStudents}</div>
            <p className="text-muted-foreground text-xs">Not currently enrolled</p>
          </CardContent>
        </Card>
      </div>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Students</CardTitle>
          <CardDescription>View and manage student information</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">Loading students...</div>
            </div>
          ) : students.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">No students found</h3>
              <p className="text-muted-foreground text-sm">Get started by creating a new student or importing from Excel</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Student Code</TableHead>
                    <TableHead>Full Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Date of Birth</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.studentId}>
                      <TableCell className="font-medium">{student.studentId}</TableCell>
                      <TableCell className="font-medium">{student.studentCode}</TableCell>
                      <TableCell>{student.fullName}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{student.phoneNumber || "N/A"}</TableCell>
                      <TableCell>
                        {student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : "N/A"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={student.status === "active" ? "default" : "secondary"}>
                          {student.status || "inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" title="Edit Student" onClick={() => handleOpenEditDialog(student)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Delete Student"
                            onClick={() => handleDelete(student.studentId)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <StudentDialog
        open={isStudentDialogOpen}
        onOpenChange={setIsStudentDialogOpen}
        student={selectedStudent}
        onSuccess={fetchStudents}
      />
    </div>
  );
}
