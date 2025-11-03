import { AlertTriangle, Eye, CheckCircle2, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Violation {
  id: string;
  submissionId: string;
  studentCode: string;
  studentName: string;
  violationType: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "pending" | "resolved";
  reportedAt: Date;
}

const violationTypes: Record<string, string> = {
  incorrect_filename: "Incorrect File Name",
  source_duplicate: "Source Code Duplication",
  missing_docs: "Missing Documentation",
  invalid_format: "Invalid Format",
  plagiarism: "Plagiarism Detected",
};

const mockViolations: Violation[] = [
  {
    id: "VIO-001",
    submissionId: "SUB-2024-001",
    studentCode: "STU-2024001",
    studentName: "Nguyen Van A",
    violationType: "incorrect_filename",
    description: "File name does not match naming convention",
    severity: "low",
    status: "pending",
    reportedAt: new Date(2024, 10, 2),
  },
  {
    id: "VIO-002",
    submissionId: "SUB-2024-005",
    studentCode: "STU-2024005",
    studentName: "Tran Thi B",
    violationType: "source_duplicate",
    description: "95% similarity with another submission",
    severity: "high",
    status: "pending",
    reportedAt: new Date(2024, 10, 3),
  },
  {
    id: "VIO-003",
    submissionId: "SUB-2024-008",
    studentCode: "STU-2024008",
    studentName: "Le Van C",
    violationType: "missing_docs",
    description: "Missing required documentation files",
    severity: "medium",
    status: "resolved",
    reportedAt: new Date(2024, 10, 1),
  },
  {
    id: "VIO-004",
    submissionId: "SUB-2024-012",
    studentCode: "STU-2024012",
    studentName: "Pham Thi D",
    violationType: "plagiarism",
    description: "Code pattern matches known plagiarism database",
    severity: "critical",
    status: "pending",
    reportedAt: new Date(2024, 10, 4),
  },
];

function getSeverityColor(severity: string): string {
  switch (severity) {
    case "low":
      return "bg-yellow-100 text-yellow-800";
    case "medium":
      return "bg-orange-100 text-orange-800";
    case "high":
      return "bg-red-100 text-red-800";
    case "critical":
      return "bg-red-200 text-red-900";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function getSeverityIcon(severity: string) {
  switch (severity) {
    case "low":
      return <AlertTriangle className="h-4 w-4" />;
    case "medium":
      return <AlertTriangle className="h-4 w-4" />;
    case "high":
      return <AlertTriangle className="h-4 w-4" />;
    case "critical":
      return <AlertTriangle className="h-4 w-4" />;
    default:
      return null;
  }
}

export default function ManagerViolationManagementPage() {
  const pendingCount = mockViolations.filter((v) => v.status === "pending").length;
  const criticalCount = mockViolations.filter((v) => v.severity === "critical").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Violation Management</h1>
        <p className="text-muted-foreground">Review and handle flagged submissions</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Violations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockViolations.length}</div>
            <p className="text-xs text-muted-foreground">{pendingCount} pending</p>
          </CardContent>
        </Card>

        <Card className="border-red-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-800">Critical Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalCount}</div>
            <p className="text-xs text-red-700">Require immediate action</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockViolations.filter((v) => v.status === "resolved").length}/{mockViolations.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round(
                (mockViolations.filter((v) => v.status === "resolved").length /
                  mockViolations.length) *
                  100
              )}
              % resolved
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Violations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Violations Report</CardTitle>
          <CardDescription>All detected violations and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Submission ID</TableHead>
                  <TableHead>Student Code</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Violation Type</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reported</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockViolations.map((violation) => (
                  <TableRow key={violation.id}>
                    <TableCell className="font-mono text-sm">{violation.submissionId}</TableCell>
                    <TableCell className="font-mono text-sm">{violation.studentCode}</TableCell>
                    <TableCell>{violation.studentName}</TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {violationTypes[violation.violationType] || violation.violationType}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className={getSeverityColor(violation.severity)}>
                        {violation.severity.charAt(0).toUpperCase() + violation.severity.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={violation.status === "resolved" ? "secondary" : "outline"}
                        className={
                          violation.status === "resolved"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }
                      >
                        {violation.status === "resolved" ? (
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                        ) : (
                          <AlertTriangle className="h-3 w-3 mr-1" />
                        )}
                        {violation.status.charAt(0).toUpperCase() + violation.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {violation.reportedAt.toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                          Review
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-green-600 hover:text-green-700"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          Resolve
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Violation Types Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(violationTypes).map(([key, label]) => {
              const count = mockViolations.filter((v) => v.violationType === key).length;
              return (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm">{label}</span>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 w-24">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{
                          width: `${(count / mockViolations.length) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
