"use client";

import { AlertCircle, CheckCircle, AlertTriangle, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { SubmissionUploadResponse } from "@/types/type";

interface SubmissionViolationsViewProps {
  data: SubmissionUploadResponse;
}

function getSeverityBadgeVariant(severity?: string): "destructive" | "secondary" | "outline" {
  const normalizedSeverity = severity?.toLowerCase() ?? "medium";
  if (normalizedSeverity === "high") return "destructive";
  if (normalizedSeverity === "low") return "outline";
  return "secondary";
}

export function SubmissionViolationsView({ data }: SubmissionViolationsViewProps) {
  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">Submission Details</CardTitle>
              <CardDescription>
                Submitted on {new Date(data.uploadedAt).toLocaleString()}
              </CardDescription>
            </div>
            <Badge variant="outline" className="ml-auto">
              ID: {data.submissionId}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div>
              <p className="text-sm text-muted-foreground">File</p>
              <p className="font-medium">{data.zipFileName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Student</p>
              <p className="font-medium">{data.studentInfo.fullName}</p>
              <p className="text-xs text-muted-foreground">{data.studentInfo.studentCode}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Violations Found</p>
              <p className="text-2xl font-bold">
                {data.violationCount > 0 ? (
                  <span className="text-destructive">{data.violationCount}</span>
                ) : (
                  <span className="text-green-600">0</span>
                )}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="flex items-center gap-2 font-medium">
                {data.violationCount > 0 ? (
                  <>
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    Issues Found
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Clean
                  </>
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Violations Section */}
      {data.violationCount > 0 && data.violations.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Violations Detected ({data.violations.length} rules triggered)
            </CardTitle>
            <CardDescription>
              Review the violations and their locations in your submission
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="rule-0" className="w-full">
              <ScrollArea className="w-full">
                <TabsList className="inline-flex w-full justify-start gap-2 bg-transparent p-0">
                  {data.violations.map((violation) => (
                    <TabsTrigger
                      key={`rule-${violation.rule.ruleId}`}
                      value={`rule-${violation.rule.ruleId}`}
                      className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
                    >
                      <Badge variant={getSeverityBadgeVariant(violation.rule.severity)} className="cursor-pointer">
                        {violation.rule.name}
                      </Badge>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </ScrollArea>

              {data.violations.map((violation) => (
                <TabsContent key={`content-${violation.rule.ruleId}`} value={`rule-${violation.rule.ruleId}`} className="space-y-4">
                  <div className="space-y-3">
                    {/* Rule Info */}
                    <div className="rounded-lg border bg-muted/50 p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold">{violation.rule.name}</h4>
                          <p className="text-sm text-muted-foreground">{violation.rule.description}</p>
                        </div>
                        <Badge variant={getSeverityBadgeVariant(violation.rule.severity)}>
                          {violation.rule.severity ?? "medium"}
                        </Badge>
                      </div>
                      <div className="mt-2 space-y-1 text-xs">
                        <p className="font-mono text-muted-foreground">
                          Pattern: <span className="text-foreground">{violation.rule.pattern}</span>
                        </p>
                      </div>
                    </div>

                    {/* Violations List */}
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium">
                        {violation.rule.violations.length} files with violations
                      </h5>
                      <ScrollArea className="h-96 rounded-lg border">
                        <div className="space-y-2 p-4">
                          {violation.rule.violations.map((v) => (
                            <div
                              key={`${v.submissionId}-${v.filePath}`}
                              className="flex items-start gap-3 rounded border bg-background p-3 hover:bg-muted/50"
                            >
                              <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                              <div className="flex-1 space-y-1">
                                <p className="break-all font-mono text-sm">{v.filePath}</p>
                                <p className="text-xs text-muted-foreground">{v.message}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              No Violations Found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This submission passed all the selected rules. Great job! 🎉
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
