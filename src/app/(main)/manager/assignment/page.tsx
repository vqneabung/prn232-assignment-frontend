"use client";

import { useState, useMemo } from "react";

import { ChevronDown } from "lucide-react";

import { AssignExaminerModal } from "@/app/(main)/manager/assignment/_components/assign-examiner-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { generateMockSubmissions, getExamList, getStatusLabel, getStatusBadgeColor } from "../assignment/utils";

export default function ManagerAssignmentPage() {
  const [selectedExam, setSelectedExam] = useState<string>("EX-001");
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectAll, setSelectAll] = useState(false);

  const exams = getExamList();
  const submissions = useMemo(() => generateMockSubmissions(), []);

  // Filter submissions by selected exam
  const filteredSubmissions = useMemo(
    () => submissions.filter((sub) => sub.examId === selectedExam),
    [submissions, selectedExam],
  );

  const handleSelectRow = (id: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
    setSelectAll(newSelected.size === filteredSubmissions.length);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows(new Set());
      setSelectAll(false);
    } else {
      const allIds = new Set(filteredSubmissions.map((sub) => sub.id));
      setSelectedRows(allIds);
      setSelectAll(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Examiner Assignment</h1>
        <p className="text-muted-foreground">Assign examiners to submissions for grading</p>
      </div>

      {/* Exam Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Select Exam</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedExam} onValueChange={setSelectedExam}>
            <SelectTrigger className="w-full md:w-80">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {exams.map((exam) => (
                <SelectItem key={exam.id} value={exam.id}>
                  {exam.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Submissions Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Submissions</CardTitle>
              <CardDescription>
                {filteredSubmissions.length} submissions for {exams.find((e) => e.id === selectedExam)?.name}
              </CardDescription>
            </div>
            <Button onClick={() => setIsModalOpen(true)} disabled={selectedRows.size === 0} className="gap-2">
              <ChevronDown className="h-4 w-4" />
              Assign Examiners ({selectedRows.size})
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox checked={selectAll} onChange={handleSelectAll} />
                  </TableHead>
                  <TableHead>Submission ID</TableHead>
                  <TableHead>Student Code</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned Examiners</TableHead>
                  <TableHead>Submitted</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubmissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedRows.has(submission.id)}
                        onChange={() => handleSelectRow(submission.id)}
                      />
                    </TableCell>
                    <TableCell className="font-mono text-sm">{submission.id}</TableCell>
                    <TableCell className="font-mono text-sm">{submission.studentCode}</TableCell>
                    <TableCell>{submission.studentName}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeColor(submission.status)}>
                        {getStatusLabel(submission.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {submission.assignedExaminers.map((examiner) => (
                          <Badge key={examiner.id} variant="secondary">
                            {examiner.examinerName}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(submission.submittedAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Assign Examiner Modal */}
      <AssignExaminerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedSubmissionIds={Array.from(selectedRows)}
        selectedSubmissions={filteredSubmissions.filter((sub) => selectedRows.has(sub.id))}
      />
    </div>
  );
}
