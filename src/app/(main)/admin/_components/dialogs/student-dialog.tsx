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
import type { StudentResponse, StudentRequest } from "@/types/type";
import { handleCreateStudent, handleUpdateStudent } from "../../handlers";

interface StudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student?: StudentResponse | null;
  onSuccess?: () => void;
}

export function StudentDialog({ open, onOpenChange, student, onSuccess }: StudentDialogProps) {
  const [formData, setFormData] = useState<StudentRequest>({
    studentCode: "",
    fullName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    address: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (student) {
      setFormData({
        studentCode: student.studentCode,
        fullName: student.fullName,
        email: student.email,
        phoneNumber: student.phoneNumber || "",
        dateOfBirth: student.dateOfBirth || "",
        address: student.address || "",
      });
    } else {
      setFormData({
        studentCode: "",
        fullName: "",
        email: "",
        phoneNumber: "",
        dateOfBirth: "",
        address: "",
      });
    }
  }, [student, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (student) {
        await handleUpdateStudent(String(student.studentId), formData);
      } else {
        await handleCreateStudent(formData);
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
            <DialogTitle>{student ? "Edit Student" : "Create New Student"}</DialogTitle>
            <DialogDescription>
              {student ? "Update the student information below." : "Enter the student details below."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="studentCode">Student Code *</Label>
                <Input
                  id="studentCode"
                  placeholder="e.g., SE12345"
                  value={formData.studentCode}
                  onChange={(e) => setFormData({ ...formData, studentCode: e.target.value })}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  placeholder="e.g., John Doe"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="e.g., john.doe@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="e.g., +1234567890"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                placeholder="Enter full address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : student ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
