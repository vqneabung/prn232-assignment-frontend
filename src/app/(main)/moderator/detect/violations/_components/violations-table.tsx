"use client";

import { useState } from "react";

import { ChevronDown } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { ViolationRecord, VIOLATION_LABELS, VIOLATION_SEVERITY_COLOR } from "../types";

interface ViolationsTableProps {
  data: ViolationRecord[];
  isLoading?: boolean;
}

function ViolationRow({ record }: { record: ViolationRecord }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <>
        <CollapsibleTrigger asChild>
          <TableRow className="cursor-pointer hover:bg-muted/50">
            <TableCell>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </TableCell>
            <TableCell className="font-medium">{record.studentName}</TableCell>
            <TableCell>{record.studentId}</TableCell>
            <TableCell>{record.classCode}</TableCell>
            <TableCell className="text-center">
              <Badge variant="secondary">{record.violations.length}</Badge>
            </TableCell>
          </TableRow>
        </CollapsibleTrigger>
        <CollapsibleContent asChild>
          <TableRow>
            <TableCell colSpan={5} className="bg-muted/30 p-0">
              <div className="space-y-2 p-4">
                {record.violations.map((violation) => (
                  <div
                    key={`${violation.type}-${violation.severity}`}
                    className="rounded-lg border bg-card p-3 space-y-1"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <Badge
                        variant="outline"
                        className={VIOLATION_SEVERITY_COLOR[violation.severity]}
                      >
                        {VIOLATION_LABELS[violation.type]}
                      </Badge>
                      <span className="text-xs font-medium text-muted-foreground">
                        Mức độ: {violation.severity}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {violation.message}
                    </p>
                  </div>
                ))}
              </div>
            </TableCell>
          </TableRow>
        </CollapsibleContent>
      </>
    </Collapsible>
  );
}

export function ViolationsTable({ data, isLoading = false }: ViolationsTableProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Kết quả phát hiện</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">Đang xử lí...</div>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Kết quả phát hiện</CardTitle>
          <CardDescription>Không có dữ liệu để hiển thị</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">
            Tải lên file để bắt đầu phát hiện vi phạm
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kết quả phát hiện</CardTitle>
        <CardDescription>
          Tìm thấy {data.length} bộ hồ sơ với vi phạm
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Tên sinh viên</TableHead>
                <TableHead>Mã sinh viên</TableHead>
                <TableHead>Mã lớp</TableHead>
                <TableHead className="text-center">Số vi phạm</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((record) => (
                <ViolationRow key={record.id} record={record} />
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
