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

interface ClassDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classData?: ClassResponse | null;
  onSuccess?: () => void;
}

export function ClassDialog({ open, onOpenChange, classData, onSuccess }: ClassDialogProps) {
  const [formData, setFormData] = useState<ClassRequest>({
    className: "",
    subjectId: 0,
    semester: "",
    lecturerId: 0,
    examinerId: 0,
    status: "active",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (classData) {
      setFormData({
        className: classData.className,
        subjectId: classData.subjectId,
        semester: classData.semester,
        lecturerId: classData.lecturerId,
        examinerId: classData.examinerId,
        status: classData.status || "active",
      });
    } else {
      setFormData({
        className: "",
        subjectId: 0,
        semester: "",
        lecturerId: 0,
        examinerId: 0,
        status: "active",
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

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="subjectId">Subject ID *</Label>
                <Input
                  id="subjectId"
                  type="number"
                  placeholder="e.g., 1"
                  value={formData.subjectId || ""}
                  onChange={(e) => setFormData({ ...formData, subjectId: parseInt(e.target.value) || 0 })}
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="lecturerId">Lecturer ID *</Label>
                <Input
                  id="lecturerId"
                  type="number"
                  placeholder="e.g., 1"
                  value={formData.lecturerId || ""}
                  onChange={(e) => setFormData({ ...formData, lecturerId: parseInt(e.target.value) || 0 })}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="examinerId">Examiner ID *</Label>
                <Input
                  id="examinerId"
                  type="number"
                  placeholder="e.g., 2"
                  value={formData.examinerId || ""}
                  onChange={(e) => setFormData({ ...formData, examinerId: parseInt(e.target.value) || 0 })}
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as any })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
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
