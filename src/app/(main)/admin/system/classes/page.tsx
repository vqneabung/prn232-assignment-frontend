"use client";

import { Plus, Users } from "lucide-react";
import { useCallback, useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { classApi } from "@/lib/api/class/class";
import { handleDeleteClass } from "../../handlers";
import type { ClassResponse } from "@/types/type";
import { ClassDialog } from "../../_components/dialogs/class-dialog";
import { AddStudentDialog } from "../../_components/dialogs/add-student-dialog";
import { ClassStudentsDialog } from "../../_components/dialogs/class-students-dialog";
import { ClassRow } from "./_components/class-row";

export default function AdminClassesPage() {
  const [classes, setClasses] = useState<ClassResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isStudentsViewOpen, setIsStudentsViewOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassResponse | null>(null);

  const fetchClasses = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await classApi.getAll();
      if (response.success && response.data) {
        setClasses(response.data);
      } else {
        setClasses([]);
      }
    } catch (err) {
      console.error("Error loading classes:", err);
      setClasses([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const handleOpenCreateDialog = () => {
    setSelectedClass(null);
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (classData: ClassResponse) => {
    setSelectedClass(classData);
    setIsDialogOpen(true);
  };

  const handleOpenAddStudent = (classData: ClassResponse) => {
    setSelectedClass(classData);
    setIsAddStudentOpen(true);
  };

  const handleOpenStudentsView = (classData: ClassResponse) => {
    setSelectedClass(classData);
    setIsStudentsViewOpen(true);
  };

  const handleDelete = async (classId: string | number) => {
    await handleDeleteClass(String(classId));
    fetchClasses();
  };

  const totalStudents = classes.reduce((sum, c) => sum + (c.studentCount ?? 0), 0);
  const activeClasses = classes.filter((c) => c.status === "active").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Classes</h1>
          <p className="text-muted-foreground">Create and manage class schedules</p>
        </div>
        <Button className="gap-2" onClick={handleOpenCreateDialog}>
          <Plus className="h-4 w-4" />
          New Class
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classes.length}</div>
            <p className="text-muted-foreground text-xs">Across all semesters</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeClasses}</div>
            <p className="text-muted-foreground text-xs">Currently running</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-muted-foreground text-xs">Enrolled students</p>
          </CardContent>
        </Card>
      </div>

      {/* Classes Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Classes</CardTitle>
          <CardDescription>View and manage class information</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">Loading classes...</div>
            </div>
          ) : classes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">No classes found</h3>
              <p className="text-muted-foreground text-sm">Get started by creating a new class</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Class ID</TableHead>
                    <TableHead>Class Name</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Semester</TableHead>
                    <TableHead>Lecturer</TableHead>
                    <TableHead>Examiner</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classes.map((classItem) => (
                    <ClassRow
                      key={classItem.classId}
                      classItem={classItem}
                      onEdit={handleOpenEditDialog}
                      onAddStudent={handleOpenAddStudent}
                      onViewStudents={handleOpenStudentsView}
                      onDelete={handleDelete}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <ClassDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        classData={selectedClass}
        onSuccess={fetchClasses}
      />

      {selectedClass && (
        <>
          <AddStudentDialog
            open={isAddStudentOpen}
            onOpenChange={setIsAddStudentOpen}
            classId={Number(selectedClass.classId)}
            onSuccess={fetchClasses}
          />

          <ClassStudentsDialog
            open={isStudentsViewOpen}
            onOpenChange={setIsStudentsViewOpen}
            classId={Number(selectedClass.classId)}
            className={selectedClass.className}
            onSuccess={fetchClasses}
          />
        </>
      )}
    </div>
  );
}
