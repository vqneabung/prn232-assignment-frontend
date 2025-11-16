"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { StudentResponse } from "@/types/type";
import { studentApi } from "@/lib/api/student/student";
import { classApi } from "@/lib/api/class/class";
import { toast } from "sonner";

interface AddStudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classId: number;
  onSuccess?: () => void;
}

export function AddStudentDialog({ open, onOpenChange, classId, onSuccess }: AddStudentDialogProps) {
  const [students, setStudents] = useState<StudentResponse[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch students on mount
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setIsLoadingStudents(true);
        const response = await studentApi.getAll();
        if (response.success && response.data) {
          setStudents(response.data);
        }
      } catch (error) {
        console.error("Error loading students:", error);
      } finally {
        setIsLoadingStudents(false);
      }
    };

    if (open) {
      fetchStudents();
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId) {
      toast.error("Please select a student");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await classApi.addStudent(classId, parseInt(selectedStudentId));
      if (response.success) {
        toast.success("Student added to class successfully");
        onOpenChange(false);
        setSelectedStudentId("");
        onSuccess?.();
      } else {
        toast.error(response.message ?? "Failed to add student");
      }
    } catch (error) {
      console.error("Error adding student:", error);
      toast.error("An error occurred while adding student");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Student to Class</DialogTitle>
            <DialogDescription>Select a student to add to this class</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="student">Student *</Label>
              <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                <SelectTrigger id="student" disabled={isLoadingStudents}>
                  <SelectValue placeholder="Select student" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.studentId} value={String(student.studentId)}>
                      {student.studentCode} - {student.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !selectedStudentId}>
              {isSubmitting ? "Adding..." : "Add Student"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
