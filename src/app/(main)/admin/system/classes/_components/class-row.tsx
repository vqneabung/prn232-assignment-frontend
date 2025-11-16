"use client";

import { Edit, Trash2, Users, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import type { ClassResponse } from "@/types/type";

interface ClassRowProps {
  classItem: ClassResponse;
  onEdit: (classData: ClassResponse) => void;
  onAddStudent: (classData: ClassResponse) => void;
  onViewStudents: (classData: ClassResponse) => void;
  onDelete: (classId: string | number) => void;
}

const getStatusVariant = (status?: string): "default" | "secondary" | "outline" => {
  if (status === "active") return "default";
  if (status === "completed") return "secondary";
  return "outline";
};

export function ClassRow({ classItem, onEdit, onAddStudent, onViewStudents, onDelete }: ClassRowProps) {
  const statusVariant = getStatusVariant(classItem.status);

  return (
    <TableRow key={classItem.classId}>
      <TableCell className="font-medium">{classItem.classId}</TableCell>
      <TableCell className="font-medium">{classItem.className}</TableCell>
      <TableCell>{String(classItem.subjectName ?? classItem.subjectId ?? "")}</TableCell>
      <TableCell>{classItem.semester}</TableCell>
      <TableCell>{String(classItem.lecturerName ?? classItem.lecturerId ?? "")}</TableCell>
      <TableCell>{String(classItem.examinerName ?? classItem.examinerId ?? "")}</TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <Users className="h-4 w-4 text-muted-foreground" />
          {classItem.studentCount ?? 0}
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={statusVariant}>{classItem.status ?? "pending"}</Badge>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            title="Add Students"
            onClick={() => onAddStudent(classItem)}
          >
            <UserPlus className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            title="View Students"
            onClick={() => onViewStudents(classItem)}
          >
            <Users className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" title="Edit Class" onClick={() => onEdit(classItem)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            title="Delete Class"
            onClick={() => onDelete(classItem.classId)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
