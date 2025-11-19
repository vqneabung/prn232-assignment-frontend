import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Violation {
  filePath: string;
  message: string;
  ruleId: number;
}

interface ViolationsTableProps {
  violations: Violation[];
  studentCode: string;
}

export function ViolationsTable({ violations, studentCode }: ViolationsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">#</TableHead>
          <TableHead>File Path</TableHead>
          <TableHead>Message</TableHead>
          <TableHead className="w-24">Rule ID</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {violations.map((violation, index) => {
          const uniqueKey = `${studentCode}-${violation.filePath.replace(/[^a-zA-Z0-9]/g, '-')}-${violation.ruleId}-${violation.message.substring(0, 20).replace(/[^a-zA-Z0-9]/g, '-')}`;
          return (
            <TableRow key={uniqueKey}>
              <TableCell className="text-muted-foreground">{index + 1}</TableCell>
              <TableCell>
                <code className="text-xs bg-muted px-2 py-1 rounded">
                  {violation.filePath}
                </code>
              </TableCell>
              <TableCell className="text-sm">{violation.message}</TableCell>
              <TableCell>
                <Badge variant="outline">Rule {violation.ruleId}</Badge>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
