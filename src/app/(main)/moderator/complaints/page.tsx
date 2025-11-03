import { AlertCircle, CheckCircle2, Clock, Trash2 } from "lucide-react";

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

import { generateMockComplaints, getPriorityColor, getStatusColor, getStatusLabel } from "../utils";

export default function ModeratorComplaintsPage() {
  const complaints = generateMockComplaints();
  const openCount = complaints.filter((c) => c.status === "submitted").length;
  const underReviewCount = complaints.filter((c) => c.status === "under-review").length;
  const resolvedCount = complaints.filter((c) => c.status === "resolved").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Complaint Management</h1>
        <p className="text-muted-foreground">Review and resolve student complaints</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Complaints</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{complaints.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card className="border-red-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-800">New</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{openCount}</div>
            <p className="text-xs text-red-700">Needs attention</p>
          </CardContent>
        </Card>

        <Card className="border-yellow-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-800">Under Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{underReviewCount}</div>
            <p className="text-xs text-yellow-700">In progress</p>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{resolvedCount}</div>
            <p className="text-xs text-green-700">Closed</p>
          </CardContent>
        </Card>
      </div>

      {/* Complaints Table */}
      <Card>
        <CardHeader>
          <CardTitle>Complaint Records</CardTitle>
          <CardDescription>All student complaints and their resolution status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Complaint ID</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Exam</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {complaints.map((complaint) => (
                  <TableRow key={complaint.id}>
                    <TableCell className="font-mono text-sm">{complaint.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{complaint.studentName}</p>
                        <p className="text-xs text-muted-foreground">{complaint.studentCode}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{complaint.examName}</TableCell>
                    <TableCell className="text-sm capitalize">
                      {complaint.complaintType.replace(/_/g, " ")}
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(complaint.priority)}>
                        {complaint.priority.charAt(0).toUpperCase() + complaint.priority.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(complaint.status)}>
                        {complaint.status === "submitted" && (
                          <AlertCircle className="h-3 w-3 mr-1" />
                        )}
                        {complaint.status === "under-review" && (
                          <Clock className="h-3 w-3 mr-1" />
                        )}
                        {complaint.status === "resolved" && (
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                        )}
                        {getStatusLabel(complaint.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(complaint.submittedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="mr-2">
                        Review
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Complaint Types Distribution */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">By Priority</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {["low", "medium", "high"].map((priority) => {
              const count = complaints.filter((c) => c.priority === priority).length;
              return (
                <div key={priority} className="flex items-center justify-between">
                  <span className="text-sm capitalize">{priority}</span>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 w-20">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{
                          width: `${(count / complaints.length) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{count}</span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">By Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {["submitted", "under-review", "resolved", "rejected"].map((status) => {
              const count = complaints.filter((c) => c.status === status).length;
              if (count === 0) return null;
              return (
                <div key={status} className="flex items-center justify-between">
                  <span className="text-sm capitalize">{getStatusLabel(status)}</span>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 w-20">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{
                          width: `${(count / complaints.length) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{count}</span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
