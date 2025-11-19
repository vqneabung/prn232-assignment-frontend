import { useState } from "react";
import { CheckCircle2, XCircle, FileArchive, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StudentResultRow } from "./student-result-row";

interface BatchGradingResult {
  message: string;
  summary: {
    className: string;
    semester: string;
    classId: number;
    totalStudentFolders: number;
    successfulGradings: number;
    failedGradings: number;
    newStudentsCreated: number;
    existingStudentsFound: number;
    classCreated: boolean;
    processedAt: string;
    errorCount: number;
  };
  studentResults: Array<{
    folderName: string;
    studentName: string;
    studentCode: string;
    studentId: number;
    isNewStudent: boolean;
    success: boolean;
    errorMessage: string | null;
    submissionId: number;
    zipFileName: string;
    submittedAt: string;
    violationCount: number;
    violations: Array<{
      filePath: string;
      message: string;
      ruleId: number;
    }>;
  }>;
  errors: string[] | null;
}

interface BatchGradingResultViewProps {
  result: BatchGradingResult;
}

export function BatchGradingResultView({ result }: BatchGradingResultViewProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (studentCode: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(studentCode)) {
      newExpanded.delete(studentCode);
    } else {
      newExpanded.add(studentCode);
    }
    setExpandedRows(newExpanded);
  };

  return (
    <>
      {/* Summary Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <FileArchive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{result.summary.totalStudentFolders}</div>
            <p className="text-xs text-muted-foreground">
              {result.summary.newStudentsCreated} new, {result.summary.existingStudentsFound} existing
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Successful</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{result.summary.successfulGradings}</div>
            <p className="text-xs text-muted-foreground">
              {result.summary.totalStudentFolders > 0
                ? Math.round((result.summary.successfulGradings / result.summary.totalStudentFolders) * 100)
                : 0}
              % success rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{result.summary.failedGradings}</div>
            <p className="text-xs text-muted-foreground">{result.summary.errorCount} errors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Class Info</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{result.summary.className}</div>
            <p className="text-xs text-muted-foreground">
              {result.summary.semester} • {result.summary.classCreated ? "Created" : "Existing"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Student Results Table */}
      <Card>
        <CardHeader>
          <CardTitle>Student Results</CardTitle>
          <CardDescription>
            Detailed grading results for each student submission
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {result.studentResults.map((student) => (
              <StudentResultRow
                key={`${student.studentCode}-${student.submissionId}`}
                student={student}
                isExpanded={expandedRows.has(student.studentCode)}
                onToggle={() => toggleRow(student.studentCode)}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Errors */}
      {result.errors && result.errors.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-600">Errors</CardTitle>
            <CardDescription>Issues encountered during batch grading</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-1">
              {result.errors.map((error) => (
                <li key={error} className="text-sm text-red-600">
                  {error}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </>
  );
}
