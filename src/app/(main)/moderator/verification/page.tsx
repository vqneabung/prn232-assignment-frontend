"use client";

import { Eye, CheckCircle2, AlertCircle, RotateCcw } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { handleReviewZeroPointCase, handleVerifyZeroPoints, handleRequestRemark } from "../handlers";
import { generateMockZeroPointSubmissions, getStatusColor, getStatusLabel } from "../utils";

export default function ModeratorVerificationPage() {
  const submissions = generateMockZeroPointSubmissions();
  const pendingCount = submissions.filter((s) => s.verificationStatus === "pending").length;
  const verifiedCount = submissions.filter((s) => s.verificationStatus === "verified").length;
  const dismissedCount = submissions.filter((s) => s.verificationStatus === "dismissed").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Zero-Point Verification</h1>
        <p className="text-muted-foreground">Review and verify zero-point submissions</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{submissions.length}</div>
            <p className="text-muted-foreground text-xs">All submissions</p>
          </CardContent>
        </Card>

        <Card className="border-yellow-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-800">Pending Verification</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
            <p className="text-xs text-yellow-700">Awaiting review</p>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Verified</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{verifiedCount}</div>
            <p className="text-xs text-green-700">Confirmed</p>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Dismissed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dismissedCount}</div>
            <p className="text-muted-foreground text-xs">Not valid</p>
          </CardContent>
        </Card>
      </div>

      {/* Submissions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Zero-Point Submissions</CardTitle>
          <CardDescription>All submissions graded as zero and their verification status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Case ID</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Exam</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Graded By</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Verified By</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell className="font-mono text-sm">{submission.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{submission.studentName}</p>
                        <p className="text-muted-foreground text-xs">{submission.studentCode}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{submission.examName}</TableCell>
                    <TableCell className="text-sm">{submission.reason}</TableCell>
                    <TableCell className="text-sm">{submission.giaderedBy}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(submission.verificationStatus)}>
                        {submission.verificationStatus === "pending" && <AlertCircle className="mr-1 h-3 w-3" />}
                        {submission.verificationStatus === "verified" && <CheckCircle2 className="mr-1 h-3 w-3" />}
                        {getStatusLabel(submission.verificationStatus)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{submission.verifiedBy ?? "-"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleReviewZeroPointCase(submission.id)}>
                          <Eye className="mr-1 h-4 w-4" />
                          Review
                        </Button>
                        {submission.verificationStatus === "pending" && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-green-600 hover:text-green-700"
                              onClick={() => handleVerifyZeroPoints(submission.id)}
                            >
                              <CheckCircle2 className="mr-1 h-4 w-4" />
                              Verify
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-blue-600 hover:text-blue-700"
                              onClick={() => handleRequestRemark(submission.id)}
                            >
                              <RotateCcw className="mr-1 h-4 w-4" />
                              Remark
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Reason Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Zero-Point Reasons Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              "No submission received",
              "Blank/Empty submission",
              "Plagiarism - Full copy",
              "Off-topic submission",
              "Technical incompatibility",
              "Incomplete attempt",
            ].map((reason) => {
              const count = submissions.filter((s) => s.reason === reason).length;
              if (count === 0) return null;
              return (
                <div key={reason} className="flex items-center justify-between">
                  <span className="text-sm">{reason}</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-24 flex-1 rounded-full bg-gray-200">
                      <div
                        className="h-2 rounded-full bg-red-500"
                        style={{
                          width: `${(count / submissions.length) * 100}%`,
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
