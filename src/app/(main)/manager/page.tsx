"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchAllClasses, fetchAllSubmissions } from "./handlers";
import type { ClassResponse, SubmissionResponse } from "@/types/type";

export default function ManagerDashboard() {
  const [classes, setClasses] = useState<ClassResponse[]>([]);
  const [submissions, setSubmissions] = useState<SubmissionResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [classesData, submissionsData] = await Promise.all([
        fetchAllClasses(),
        fetchAllSubmissions(),
      ]);
      setClasses(classesData);
      setSubmissions(submissionsData);
    } catch (error) {
      console.error("Error loading manager data:", error);
      toast.error("Failed to load manager dashboard data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Calculate statistics
  const totalSubmissions = submissions.length;
  const pendingSubmissions = submissions.filter((s) => s.status === "pending").length;
  const submittedSubmissions = submissions.filter((s) => s.status === "submitted").length;
  const gradedSubmissions = submissions.filter((s) => s.status === "graded").length;
  const completionPercentage = totalSubmissions > 0 ? Math.round((gradedSubmissions / totalSubmissions) * 100) : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manager Dashboard</h1>
        <p className="text-muted-foreground">Monitor grading progress and manage examiners</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSubmissions}</div>
            <p className="text-muted-foreground text-xs">{gradedSubmissions} graded ({completionPercentage}%)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classes.length}</div>
            <p className="text-muted-foreground text-xs">under management</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-600">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingSubmissions}</div>
            <p className="text-muted-foreground text-xs">awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-600">Graded</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{gradedSubmissions}</div>
            <p className="text-muted-foreground text-xs">completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common management tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            <Button variant="outline" className="w-full justify-start">
              <Plus className="mr-2 h-4 w-4" />
              Assign Examiner
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Plus className="mr-2 h-4 w-4" />
              Track Progress
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Submission Status Summary */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Submission Status</CardTitle>
            <CardDescription>Breakdown by status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span>Pending</span>
                <span className="font-semibold">{pendingSubmissions}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-yellow-500"
                  style={{
                    width: totalSubmissions > 0 ? `${(pendingSubmissions / totalSubmissions) * 100}%` : "0%",
                  }}
                ></div>
              </div>
            </div>
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span>Submitted</span>
                <span className="font-semibold">{submittedSubmissions}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-blue-500"
                  style={{
                    width: totalSubmissions > 0 ? `${(submittedSubmissions / totalSubmissions) * 100}%` : "0%",
                  }}
                ></div>
              </div>
            </div>
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span>Graded</span>
                <span className="font-semibold">{gradedSubmissions}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-green-500"
                  style={{
                    width: totalSubmissions > 0 ? `${(gradedSubmissions / totalSubmissions) * 100}%` : "0%",
                  }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Managed Classes</CardTitle>
            <CardDescription>Total: {classes.length}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 max-h-48 overflow-y-auto">
            {classes.length > 0 ? (
              classes.slice(0, 5).map((cls) => (
                <div key={cls.classId} className="flex justify-between text-sm">
                  <span>{cls.className}</span>
                  <span className="text-muted-foreground">{cls.semester}</span>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">No classes to display</p>
            )}
            {classes.length > 5 && (
              <p className="text-muted-foreground text-xs pt-2">+ {classes.length - 5} more classes</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
