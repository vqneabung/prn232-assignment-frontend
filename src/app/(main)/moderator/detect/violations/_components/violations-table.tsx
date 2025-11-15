"use client";

import { useState } from "react";

import { ChevronDown } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { ViolationRecord, VIOLATION_SEVERITY_COLOR, getSeverityLabel } from "../types";

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
          <TableRow className="hover:bg-muted/50 cursor-pointer">
            <TableCell>
              <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </TableCell>
            <TableCell className="font-medium">{record.filePath}</TableCell>
            <TableCell className="font-medium">{record.rule.name}</TableCell>
            <TableCell>
              <Badge className={VIOLATION_SEVERITY_COLOR[record.rule.severity]}>
                {getSeverityLabel(record.rule.severity)}
              </Badge>
            </TableCell>
            <TableCell className="text-center">
              <Badge variant="secondary">{record.rule.violations.length}</Badge>
            </TableCell>
          </TableRow>
        </CollapsibleTrigger>
        <CollapsibleContent asChild>
          <TableRow>
            <TableCell colSpan={5} className="bg-muted/30 p-0">
              <div className="space-y-2 p-4">
                <div className="bg-card space-y-2 rounded-lg border p-3">
                  <div className="space-y-1">
                    <p className="font-semibold text-sm">Rule ID: {record.rule.ruleId}</p>
                    <p className="text-muted-foreground text-sm">{record.rule.description}</p>
                    <p className="text-muted-foreground text-xs">Pattern: <code className="bg-muted px-2 py-1 rounded">{record.rule.pattern}</code></p>
                  </div>
                  <div className="space-y-2 mt-3">
                    <p className="font-semibold text-sm">Violations in file:</p>
                    {record.rule.violations.map((violation) => (
                      <div key={violation.violationId} className="bg-muted p-2 rounded text-sm">
                        <p className="text-muted-foreground">{violation.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">File: {violation.filePath}</p>
                      </div>
                    ))}
                  </div>
                </div>
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
          <div className="text-muted-foreground text-center">Đang xử lí...</div>
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
          <div className="text-muted-foreground text-center">Tải lên file để bắt đầu phát hiện vi phạm</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kết quả phát hiện</CardTitle>
        <CardDescription>Tìm thấy {data.length} file với vi phạm</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>File Path</TableHead>
                <TableHead>Rule Name</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead className="text-center">Violations</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((record) => (
                <ViolationRow key={`${record.rule.ruleId}-${record.filePath}`} record={record} />
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
