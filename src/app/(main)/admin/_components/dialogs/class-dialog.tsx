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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ClassResponse, ClassRequest } from "@/types/type";
import { handleCreateClass, handleUpdateClass } from "../../handlers";
import { lecturerApi, type LecturerResponse } from "@/lib/api/lecturer/lecturer";

interface ClassDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classData?: ClassResponse | null;
  onSuccess?: () => void;
}

export function ClassDialog({ open, onOpenChange, classData, onSuccess }: ClassDialogProps) {
  const [formData, setFormData] = useState<ClassRequest>({
    className: "",
    semester: "",
    lecturer: 0,
    examiner: 0,
  });
  const [lecturers, setLecturers] = useState<LecturerResponse[]>([]);
  const [isLoadingLecturers, setIsLoadingLecturers] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch lecturers on mount
  useEffect(() => {
    const fetchLecturers = async () => {
      try {
        setIsLoadingLecturers(true);
        const response = await lecturerApi.getAll();
        if (response.success && response.data) {
          setLecturers(response.data);
        }
      } catch (error) {
        console.error("Error loading lecturers:", error);
      } finally {
        setIsLoadingLecturers(false);
      }
    };

    fetchLecturers();
  }, []);

  useEffect(() => {
    if (classData) {
      setFormData({
        className: classData.className,
        semester: classData.semester,
        lecturer: classData.lecturer ?? 0,
        examiner: classData.examiner ?? 0,
      });
    } else {
      setFormData({
        className: "",
        semester: "",
        lecturer: 0,
        examiner: 0,
      });
    }
  }, [classData, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (classData) {
        await handleUpdateClass(String(classData.classId), formData);
      } else {
        await handleCreateClass(formData);
      }
      onOpenChange(false);
      onSuccess?.();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{classData ? "Edit Class" : "Create New Class"}</DialogTitle>
            <DialogDescription>
              {classData ? "Update the class information below." : "Enter the class details below."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="className">Class Name *</Label>
              <Input
                id="className"
                placeholder="e.g., SE1701"
                value={formData.className}
                onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="semester">Semester *</Label>
              <Input
                id="semester"
                placeholder="e.g., Fall 2024"
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="lecturer">Lecturer *</Label>
                <Select value={String(formData.lecturer)} onValueChange={(value) => setFormData({ ...formData, lecturer: parseInt(value) || 0 })}>
                  <SelectTrigger id="lecturer" disabled={isLoadingLecturers}>
                    <SelectValue placeholder="Select lecturer" />
                  </SelectTrigger>
                  <SelectContent>
                    {lecturers.map((lecturer) => (
                      <SelectItem key={lecturer.userId} value={String(lecturer.userId)}>
                        {lecturer.userName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="examiner">Examiner *</Label>
                <Select value={String(formData.examiner)} onValueChange={(value) => setFormData({ ...formData, examiner: parseInt(value) || 0 })}>
                  <SelectTrigger id="examiner" disabled={isLoadingLecturers}>
                    <SelectValue placeholder="Select examiner" />
                  </SelectTrigger>
                  <SelectContent>
                    {lecturers.map((lecturer) => (
                      <SelectItem key={lecturer.userId} value={String(lecturer.userId)}>
                        {lecturer.userName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : classData ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
