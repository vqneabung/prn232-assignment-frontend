"use client";

import { useState } from "react";

import { X, CheckCircle2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { handleAssignExaminers } from "../../handlers";
import { SubmissionAssignment } from "../../types";
import { generateMockExaminerProfiles } from "../utils";

interface AssignExaminerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSubmissionIds: string[];
  selectedSubmissions: SubmissionAssignment[];
}

export function AssignExaminerModal({
  isOpen,
  onClose,
  selectedSubmissionIds,
  selectedSubmissions,
}: AssignExaminerModalProps) {
  const [selectedExaminers, setSelectedExaminers] = useState<Set<string>>(new Set());
  const examiners = generateMockExaminerProfiles();

  const handleExaminerToggle = (examinerId: string) => {
    const newSelected = new Set(selectedExaminers);
    if (newSelected.has(examinerId)) {
      newSelected.delete(examinerId);
    } else {
      newSelected.add(examinerId);
    }
    setSelectedExaminers(newSelected);
  };

  const handleAssign = async () => {
    await handleAssignExaminers(selectedSubmissionIds, Array.from(selectedExaminers));
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>Assign Examiners</DialogTitle>
              <DialogDescription>
                Select one or more examiners to assign to {selectedSubmissionIds.length} submissions
              </DialogDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Submissions Summary */}
          <div>
            <h3 className="font-semibold mb-3">Selected Submissions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
              {selectedSubmissions.map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-center gap-2 p-2 bg-gray-50 rounded border"
                >
                  <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-xs">{sub.id}</p>
                    <p className="text-xs text-muted-foreground truncate">{sub.studentName}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Examiners Selection */}
          <div>
            <h3 className="font-semibold mb-3">Select Examiners (for double grading)</h3>
            <div className="space-y-3">
              {examiners.map((examiner) => (
                <div key={examiner.examinerId} className="flex items-center space-x-3">
                  <Checkbox
                    id={examiner.examinerId}
                    checked={selectedExaminers.has(examiner.examinerId)}
                    onChange={() => handleExaminerToggle(examiner.examinerId)}
                  />
                  <Label
                    htmlFor={examiner.examinerId}
                    className="flex-1 cursor-pointer font-normal"
                  >
                    <div className="flex items-center justify-between">
                      <span>{examiner.examinerName}</span>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs">
                          {examiner.gradedCount}/{examiner.assignedCount}
                        </Badge>
                      </div>
                    </div>
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Examiner Workload Preview */}
          {selectedExaminers.size > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Examiner Workload Preview</h3>
              <Table className="text-sm">
                <TableHeader>
                  <TableRow>
                    <TableHead>Examiner</TableHead>
                    <TableHead>Current Load</TableHead>
                    <TableHead>New Assignments</TableHead>
                    <TableHead>Total After</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {examiners
                    .filter((e) => selectedExaminers.has(e.examinerId))
                    .map((examiner) => (
                      <TableRow key={examiner.examinerId}>
                        <TableCell className="font-medium">{examiner.examinerName}</TableCell>
                        <TableCell>{examiner.assignedCount}</TableCell>
                        <TableCell>{selectedSubmissionIds.length}</TableCell>
                        <TableCell className="font-semibold">
                          {examiner.assignedCount + selectedSubmissionIds.length}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleAssign} disabled={selectedExaminers.size === 0}>
              Assign Examiners
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
