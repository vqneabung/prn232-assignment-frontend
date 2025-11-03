import { CheckCircle2, AlertCircle, Download } from "lucide-react";

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

import { generateMockResultApprovals, getStatusColor, getStatusLabel } from "@/app/(main)/admin/utils";

export default function AdminApprovalPage() {
  const approvals = generateMockResultApprovals();
  const pendingCount = approvals.filter((a) => a.status === "pending").length;
  const approvedCount = approvals.filter((a) => a.status === "approved").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Results Approval</h1>
        <p className="text-muted-foreground">Review and approve final grades</p>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvals.length}</div>
            <p className="text-xs text-muted-foreground">All exams</p>
          </CardContent>
        </Card>

        <Card className="border-yellow-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-800">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
            <p className="text-xs text-yellow-700">Needs review</p>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
            <p className="text-xs text-green-700">Finalized</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((approvedCount / approvals.length) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">Approved of total</p>
          </CardContent>
        </Card>
      </div>

      {/* Approvals Table */}
      <Card>
        <CardHeader>
          <CardTitle>Approval Requests</CardTitle>
          <CardDescription>Results awaiting final approval</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Exam</TableHead>
                  <TableHead>Total Students</TableHead>
                  <TableHead>Graded</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Avg Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {approvals.map((approval) => {
                  const progress = Math.round(
                    (approval.completedGrading / approval.totalStudents) * 100
                  );
                  return (
                    <TableRow key={approval.id}>
                      <TableCell className="font-medium">{approval.examName}</TableCell>
                      <TableCell>{approval.totalStudents}</TableCell>
                      <TableCell className="font-medium">{approval.completedGrading}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 w-16">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-medium">{progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{approval.averageScore.toFixed(1)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(approval.status)}>
                          {approval.status === "pending" && (
                            <AlertCircle className="h-3 w-3 mr-1" />
                          )}
                          {approval.status === "approved" && (
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                          )}
                          {getStatusLabel(approval.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(approval.submittedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {approval.status === "pending" ? (
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-green-600 hover:text-green-700"
                            >
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600">
                              Reject
                            </Button>
                          </div>
                        ) : (
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-base">Approval Process</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            • <strong>Review:</strong> Verify all grades have been completed and recorded
          </p>
          <p>
            • <strong>Validate:</strong> Check statistics (average, min, max) for anomalies
          </p>
          <p>
            • <strong>Approve:</strong> Finalize grades - grades cannot be modified after approval
          </p>
          <p>
            • <strong>Archive:</strong> Export results for official records
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
