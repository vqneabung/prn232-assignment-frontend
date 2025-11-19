"use client";

import { useCallback, useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { fetchAllLecturers, fetchAllClasses } from "../handlers";
import type { ClassResponse } from "@/types/type";
import type { LecturerResponse } from "@/lib/api/lecturer/lecturer";

export default function LecturersPage() {
  const [lecturers, setLecturers] = useState<LecturerResponse[]>([]);
  const [classes, setClasses] = useState<ClassResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [lecturersData, classesData] = await Promise.all([
        fetchAllLecturers(),
        fetchAllClasses(),
      ]);
      setLecturers(lecturersData);
      setClasses(classesData);
    } catch (error) {
      console.error("Error loading lecturers data:", error);
      toast.error("Failed to load lecturers data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Count classes per lecturer
  const getClassesForLecturer = (lecturerId: number) => {
    return classes.filter((c) => c.lecturer === lecturerId).length;
  };

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
        <h1 className="text-3xl font-bold tracking-tight">Lecturers</h1>
        <p className="text-muted-foreground">View and manage all lecturers in the system</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Lecturers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lecturers.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classes.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Classes per Lecturer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {lecturers.length > 0 ? (classes.length / lecturers.length).toFixed(1) : "0"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lecturers Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Lecturers</CardTitle>
          <CardDescription>
            {lecturers.length} lecturer{lecturers.length !== 1 ? "s" : ""} in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {lecturers.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">No lecturers found in the system</p>
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User ID</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Classes Assigned</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lecturers.map((lecturer) => {
                    const classCount = getClassesForLecturer(lecturer.userId);
                    return (
                      <TableRow key={lecturer.userId}>
                        <TableCell className="font-medium">{lecturer.userId}</TableCell>
                        <TableCell>{lecturer.userName}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{lecturer.roleName ?? "Lecturer"}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={classCount > 0 ? "default" : "secondary"}>
                            {classCount} class{classCount !== 1 ? "es" : ""}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            Active
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Classes per Lecturer Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Workload Summary</CardTitle>
          <CardDescription>Classes assigned to each lecturer</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {lecturers.length === 0 ? (
            <p className="text-muted-foreground">No lecturers to display</p>
          ) : (
            lecturers.map((lecturer) => {
              const classCount = getClassesForLecturer(lecturer.userId);
              return (
                <div key={lecturer.userId} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{lecturer.userName}</p>
                    <p className="text-sm text-muted-foreground">User ID: {lecturer.userId}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg">{classCount}</p>
                    <p className="text-xs text-muted-foreground">class{classCount !== 1 ? "es" : ""}</p>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}
