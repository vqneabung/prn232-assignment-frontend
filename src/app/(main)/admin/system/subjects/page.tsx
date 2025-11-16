"use client";

import { Plus, Edit, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { subjectApi } from "@/lib/api/subject/subject";
import { handleDeleteSubject } from "../../handlers";
import type { SubjectResponse } from "@/types/type";
import { SubjectDialog } from "../../_components/dialogs/subject-dialog";

export default function AdminSubjectsPage() {
  const [subjects, setSubjects] = useState<SubjectResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<SubjectResponse | null>(null);

  const fetchSubjects = async () => {
    try {
      setIsLoading(true);
      const response = await subjectApi.getAll();
      if (response.success && response.data) {
        setSubjects(response.data);
      } else {
        setSubjects([]);
      }
    } catch (err) {
      console.error("Error loading subjects:", err);
      setSubjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleOpenCreateDialog = () => {
    setSelectedSubject(null);
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (subject: SubjectResponse) => {
    setSelectedSubject(subject);
    setIsDialogOpen(true);
  };

  const handleDelete = async (subjectId: string | number) => {
    await handleDeleteSubject(String(subjectId));
    // Refresh the list
    setSubjects(subjects.filter((s) => s.id !== subjectId));
  };

  const totalCredits = subjects.reduce((sum, s) => sum + s.credits, 0);
  const activeCount = subjects.filter((s) => s.status === "active").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Subjects</h1>
          <p className="text-muted-foreground">Create and manage course subjects</p>
        </div>
        <Button className="gap-2" onClick={handleOpenCreateDialog}>
          <Plus className="h-4 w-4" />
          New Subject
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Subjects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subjects.length}</div>
            <p className="text-muted-foreground text-xs">Across all departments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCount}</div>
            <p className="text-muted-foreground text-xs">Available for enrollment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Credits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCredits}</div>
            <p className="text-muted-foreground text-xs">Across all subjects</p>
          </CardContent>
        </Card>
      </div>

      {/* Subjects Table */}
      <Card>
        <CardHeader>
          <CardTitle>Subject List</CardTitle>
          <CardDescription>All subjects in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Credits</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Loading subjects...
                    </TableCell>
                  </TableRow>
                ) : subjects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No subjects found
                    </TableCell>
                  </TableRow>
                ) : (
                  subjects.map((subject) => (
                    <TableRow key={subject.subjectId}>
                      <TableCell className="font-mono text-sm font-semibold">{subject.code}</TableCell>
                      <TableCell className="font-medium">{subject.name}</TableCell>
                      <TableCell>{subject.credits}</TableCell>
                      <TableCell className="text-muted-foreground max-w-xs truncate text-sm">
                        {subject.description ?? "-"}
                      </TableCell>
                      <TableCell>
                        <span className="text-muted-foreground text-sm">Active</span>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {new Date().toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleOpenEditDialog(subject)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDelete(subject.subjectId)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <SubjectDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        subject={selectedSubject}
        onSuccess={fetchSubjects}
      />
    </div>
  );
}
