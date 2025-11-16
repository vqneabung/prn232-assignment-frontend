"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import type { StudentResponse } from "@/types/type";
import { classApi } from "@/lib/api/class/class";
import { toast } from "sonner";

interface ClassStudentsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classId: number;
  className: string;
  onSuccess?: () => void;
}

export function ClassStudentsDialog({ open, onOpenChange, classId, className, onSuccess }: ClassStudentsDialogProps) {
  const [students, setStudents] = useState<StudentResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setIsLoading(true);
        const response = await classApi.getStudents(classId);
        if (response.success && response.data && Array.isArray(response.data)) {
          setStudents(response.data as StudentResponse[]);
        } else {
          setStudents([]);
        }
      } catch (error) {
        console.error("Error loading students:", error);
        setStudents([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (open) {
      fetchStudents();
    }
  }, [open, classId]);

  const handleRemoveStudent = async (studentId: number) => {
    try {
      const response = await classApi.removeStudent(classId, studentId);
      if (response.success) {
        toast.success("Student removed from class");
        setStudents(students.filter((s) => s.studentId !== studentId));
        onSuccess?.();
      } else {
        toast.error(response.message ?? "Failed to remove student");
      }
    } catch (error) {
      console.error("Error removing student:", error);
      toast.error("An error occurred while removing student");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Students in {className}</DialogTitle>
          <DialogDescription>View and manage students in this class</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">Loading students...</div>
            </div>
          ) : students.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-center">
              <div className="text-muted-foreground">No students in this class</div>
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
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.studentId}>
                      <TableCell className="font-medium">{student.studentId}</TableCell>
                      <TableCell>{student.studentCode}</TableCell>
                      <TableCell>{student.fullName}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Remove Student"
                          onClick={() => handleRemoveStudent(student.studentId)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
