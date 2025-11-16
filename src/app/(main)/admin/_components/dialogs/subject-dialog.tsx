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
import { Textarea } from "@/components/ui/textarea";
import type { SubjectResponse, SubjectRequest } from "@/types/type";
import { handleCreateSubject, handleUpdateSubject } from "../../handlers";

interface SubjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subject?: SubjectResponse | null;
  onSuccess?: () => void;
}

export function SubjectDialog({ open, onOpenChange, subject, onSuccess }: SubjectDialogProps) {
  const [formData, setFormData] = useState<SubjectRequest>({
    name: "",
    code: "",
    credits: 3,
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (subject) {
      setFormData({
        name: subject.name,
        code: subject.code,
        credits: subject.credits,
        description: subject.description || "",
      });
    } else {
      setFormData({
        name: "",
        code: "",
        credits: 3,
        description: "",
      });
    }
  }, [subject, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (subject) {
        await handleUpdateSubject(String(subject.subjectId), formData);
      } else {
        await handleCreateSubject(formData);
      }
      onOpenChange(false);
      onSuccess?.();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{subject ? "Edit Subject" : "Create New Subject"}</DialogTitle>
            <DialogDescription>
              {subject ? "Update the subject information below." : "Enter the subject details below."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="code">Subject Code *</Label>
              <Input
                id="code"
                placeholder="e.g., CS101"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="name">Subject Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Introduction to Computer Science"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="credits">Credits *</Label>
              <Input
                id="credits"
                type="number"
                min="1"
                max="10"
                value={formData.credits}
                onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) || 0 })}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter subject description..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : subject ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
