"use client";

import { Plus, Edit, Trash2, Calendar } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { handleDeleteSemester } from "../../handlers";
import { generateMockSemesters, getStatusColor, getStatusLabel } from "../../utils";

export default function AdminSemestersPage() {
  const semesters = generateMockSemesters();
  const activeSemester = semesters.find((s) => s.status === "ongoing");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Semesters</h1>
          <p className="text-muted-foreground">Academic periods and schedules</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Semester
        </Button>
      </div>

      {/* Current Semester Info */}
      {activeSemester && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-base">Current Semester</CardTitle>
              <CardDescription>Now active</CardDescription>
            </div>
            <Calendar className="h-6 w-6 text-blue-600 opacity-50" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{activeSemester.name}</p>
                <p className="text-muted-foreground text-sm">
                  {activeSemester.startDate} to {activeSemester.endDate}
                </p>
              </div>
              <Badge className={getStatusColor(activeSemester.status)}>{getStatusLabel(activeSemester.status)}</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Semesters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{semesters.length}</div>
            <p className="text-muted-foreground text-xs">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{semesters.filter((s) => s.status === "ongoing").length}</div>
            <p className="text-muted-foreground text-xs">Now running</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Finished</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{semesters.filter((s) => s.status === "finished").length}</div>
            <p className="text-muted-foreground text-xs">Completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Planned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{semesters.filter((s) => s.status === "planning").length}</div>
            <p className="text-muted-foreground text-xs">Future semesters</p>
          </CardContent>
        </Card>
      </div>

      {/* Semesters Table */}
      <Card>
        <CardHeader>
          <CardTitle>Semester List</CardTitle>
          <CardDescription>All academic periods</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {semesters.map((semester) => (
                  <TableRow key={semester.id}>
                    <TableCell className="font-mono text-sm font-semibold">{semester.code}</TableCell>
                    <TableCell className="font-medium">{semester.name}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {semester.startDate} to {semester.endDate}
                    </TableCell>
                    <TableCell className="text-muted-foreground max-w-xs truncate text-sm">
                      {semester.description}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(semester.status)}>{getStatusLabel(semester.status)}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteSemester(semester.id)}
                        >
                          <Trash2 className="h-4 w-4" />
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
    </div>
  );
}
