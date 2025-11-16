"use client";

import { useState, useCallback } from "react";
import { Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RulesMultiSelect } from "./rules-multi-select";
import type { StudentResponse, SubmissionUploadResponse } from "@/types/type";
import { uploadSubmission } from "../../handlers";

interface UploadSubmissionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  students: StudentResponse[];
  onSuccess?: (result: SubmissionUploadResponse) => void;
}

export function UploadSubmissionDialog({
  isOpen,
  onClose,
  students,
  onSuccess,
}: UploadSubmissionDialogProps) {
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedRuleIds, setSelectedRuleIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type (accept .rar, .zip, .tar, etc.)
      const validTypes = ["application/x-rar-compressed", "application/zip", "application/x-tar"];
      const fileName = file.name.toLowerCase();
      const isValidType =
        validTypes.includes(file.type) ||
        fileName.endsWith(".rar") ||
        fileName.endsWith(".zip") ||
        fileName.endsWith(".tar") ||
        fileName.endsWith(".gz");

      if (!isValidType) {
        toast.error("Please select a valid archive file (.rar, .zip, .tar, etc.)");
        return;
      }

      setSelectedFile(file);
    }
  }, []);

  const handleUpload = useCallback(async () => {
    if (!selectedStudentId || !selectedFile) {
      toast.error("Please select a student and a file");
      return;
    }

    try {
      setIsLoading(true);
      const studentId = parseInt(selectedStudentId);

      // Convert rule IDs array to comma-separated string
      const ruleIdsString = selectedRuleIds.length > 0 ? selectedRuleIds.join(",") : undefined;

      const result = await uploadSubmission(selectedFile, studentId, ruleIdsString);

      if (result) {
        // Handle success response with violation data
        const violationText =
          result.violationCount > 0
            ? `Found ${result.violationCount} violations`
            : "No violations found";

        toast.success(`Submission uploaded successfully! ${violationText}`, {
          description: `Submission ID: ${result.submissionId}`,
        });

        setSelectedStudentId("");
        setSelectedFile(null);
        setSelectedRuleIds([]);
        onClose();
        onSuccess?.(result);
      } else {
        toast.error("Failed to upload submission");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("An error occurred during upload");
    } finally {
      setIsLoading(false);
    }
  }, [selectedStudentId, selectedFile, selectedRuleIds, onClose, onSuccess]);

  const handleClose = () => {
    if (!isLoading) {
      setSelectedStudentId("");
      setSelectedFile(null);
      setSelectedRuleIds([]);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Submission</DialogTitle>
          <DialogDescription>Upload a student submission file for grading</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Student Selection */}
          <div className="space-y-2">
            <Label htmlFor="student">Select Student *</Label>
            <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
              <SelectTrigger id="student">
                <SelectValue placeholder="Choose a student..." />
              </SelectTrigger>
              <SelectContent>
                {students.map((student) => (
                  <SelectItem key={student.studentId} value={String(student.studentId)}>
                    {student.fullName ?? student.studentCode} ({student.studentCode})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* File Selection */}
          <div className="space-y-2">
            <Label htmlFor="file">Select File *</Label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-muted/50 transition-colors cursor-pointer">
              <input
                id="file"
                type="file"
                onChange={handleFileSelect}
                accept=".rar,.zip,.tar,.gz"
                className="hidden"
                disabled={isLoading}
              />
              <label htmlFor="file" className="cursor-pointer">
                {selectedFile ? (
                  <div className="space-y-2">
                    <Upload className="mx-auto h-8 w-8 text-green-600" />
                    <p className="text-sm font-medium text-green-600">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                    <p className="text-sm font-medium">Click to select or drag and drop</p>
                    <p className="text-xs text-muted-foreground">.rar, .zip, .tar, .gz files</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Rule Selection (Optional) */}
          <RulesMultiSelect
            selectedRuleIds={selectedRuleIds}
            onRulesChange={setSelectedRuleIds}
            disabled={isLoading}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={!selectedStudentId || !selectedFile || isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
