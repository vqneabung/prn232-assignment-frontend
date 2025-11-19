import { CheckCircle2, XCircle, ChevronDown, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ViolationsTable } from "./violations-table";

interface StudentResult {
  folderName: string;
  studentName: string;
  studentCode: string;
  studentId: number;
  isNewStudent: boolean;
  success: boolean;
  errorMessage: string | null;
  submissionId: number;
  zipFileName: string;
  submittedAt: string;
  violationCount: number;
  violations: Array<{
    filePath: string;
    message: string;
    ruleId: number;
  }>;
}

interface StudentResultRowProps {
  student: StudentResult;
  isExpanded: boolean;
  onToggle: () => void;
}

// eslint-disable-next-line complexity
export function StudentResultRow({ student, isExpanded, onToggle }: StudentResultRowProps) {
  const hasViolations = student.success && student.violationCount > 0;

  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <Card className={hasViolations ? "border-red-200" : ""}>
        <div className="p-4">
          <div className="flex items-center gap-4">
            {/* Status */}
            <div className="w-24">
              {student.success ? (
                <Badge variant="default" className="bg-green-600">
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  Success
                </Badge>
              ) : (
                <Badge variant="destructive">
                  <XCircle className="mr-1 h-3 w-3" />
                  Failed
                </Badge>
              )}
            </div>

            {/* Student Info */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <div className="text-xs text-muted-foreground">Student Code</div>
                <div className="font-medium">{student.studentCode}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Student Name</div>
                <div>{student.studentName}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Folder Name</div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm">{student.folderName}</span>
                  {student.isNewStudent && (
                    <Badge variant="secondary" className="w-fit text-xs">
                      New Student
                    </Badge>
                  )}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Violations</div>
                <div>
                  {student.success ? (
                    <Badge variant={student.violationCount > 0 ? "destructive" : "secondary"}>
                      {student.violationCount}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Submission ID</div>
                <div>
                  {student.success ? (
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      #{student.submissionId}
                    </code>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </div>
              </div>
            </div>

            {/* Expand Button */}
            {hasViolations && (
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="ml-auto">
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                  <span className="ml-1 text-xs">
                    {isExpanded ? "Hide" : "Show"} Details
                  </span>
                </Button>
              </CollapsibleTrigger>
            )}
          </div>

          {/* Submitted At / Error Message */}
          <div className="mt-2 text-xs text-muted-foreground">
            {student.success ? (
              <span>Submitted: {new Date(student.submittedAt).toLocaleString()}</span>
            ) : student.errorMessage ? (
              <span className="text-red-600 font-medium">{student.errorMessage}</span>
            ) : null}
          </div>

          {/* Violations Details */}
          {hasViolations && (
            <CollapsibleContent className="mt-4">
              <div className="border-t pt-4">
                <h4 className="text-sm font-semibold mb-3 text-red-600">
                  Violations Found ({student.violationCount})
                </h4>
                <ViolationsTable violations={student.violations} studentCode={student.studentCode} />
              </div>
            </CollapsibleContent>
          )}
        </div>
      </Card>
    </Collapsible>
  );
}
