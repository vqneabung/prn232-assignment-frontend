"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

import { fetchSubmissionById } from "../../handlers";
import { SubmissionViolationsView } from "../_components/submission-violations-view";
import type { SubmissionDetailResponse, SubmissionUploadResponse, ViolationWithRule, RuleResponse, ViolationDetail } from "@/types/type";
import { ruleApi } from "@/lib/api/rule/rule";

export default function SubmissionDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const submissionId = searchParams.get("id");

  const [submission, setSubmission] = useState<SubmissionDetailResponse | null>(null);
  const [rules, setRules] = useState<Map<number, RuleResponse>>(new Map());
  const [isLoading, setIsLoading] = useState(true);

  // Transform submission data to match SubmissionViolationsView expectations
  const transformedSubmission = useMemo<SubmissionUploadResponse | null>(() => {
    if (!submission) return null;

    // Group violations by ruleId
    const violationsByRuleId = new Map<number, ViolationDetail[]>();
    submission.violations.forEach((violation) => {
      const existing = violationsByRuleId.get(violation.ruleId) ?? [];
      violationsByRuleId.set(violation.ruleId, [...existing, violation]);
    });

    // Build transformed violations
    const transformed: ViolationWithRule[] = [];
    violationsByRuleId.forEach((violations, ruleId) => {
      const rule = rules.get(ruleId);
      const firstViolation = violations[0];
      transformed.push({
        filePath: firstViolation.filePath,
        message: firstViolation.message,
        rule: {
          ruleId,
          name: rule?.name ?? `Rule ${ruleId}`,
          pattern: rule?.pattern ?? "",
          severity: rule?.severity ?? "medium",
          description: rule?.description ?? "",
          violations,
        },
      });
    });

    return {
      message: "",
      submissionId: submission.submissionId,
      zipFileName: submission.zipFileName,
      uploadedAt: submission.uploadedAt,
      checkedAt: submission.checkedAt,
      studentId: submission.studentId,
      studentInfo: submission.studentInfo,
      violationCount: submission.violationCount,
      violations: transformed,
    };
  }, [submission, rules]);

  useEffect(() => {
    const loadSubmission = async () => {
      if (!submissionId) {
        toast.error("No submission ID provided");
        router.back();
        return;
      }

      try {
        setIsLoading(true);
        const id = parseInt(submissionId);
        const data = await fetchSubmissionById(id);

        if (!data) {
          toast.error("Failed to load submission");
          router.back();
          return;
        }

        // Type assertion needed as fetchSubmissionById returns SubmissionResponse
        // but the API for getById returns SubmissionDetailResponse with violations
        const detailedData = data as unknown as SubmissionDetailResponse;
        setSubmission(detailedData);

        // Fetch rules for all violation ruleIds
        const ruleIds = [...new Set(detailedData.violations.map((v) => v.ruleId))];
        const rulesMap = new Map<number, RuleResponse>();

        for (const ruleId of ruleIds) {
          const ruleResponse = await ruleApi.getById(ruleId);
          if (ruleResponse.success && ruleResponse.data) {
            rulesMap.set(ruleId, ruleResponse.data);
          }
        }

        setRules(rulesMap);
      } catch (error) {
        console.error("Error loading submission:", error);
        toast.error("Error loading submission");
        router.back();
      } finally {
        setIsLoading(false);
      }
    };

    loadSubmission();
  }, [submissionId, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Submission not found</p>
        <Button onClick={() => router.back()} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  if (!transformedSubmission) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Failed to process submission data</p>
        <Button onClick={() => router.back()} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Submission Details</h1>
          </div>
          <p className="text-muted-foreground mt-2">Submission ID: {submission.submissionId}</p>
        </div>
      </div>

      {/* Basic Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Information</CardTitle>
          <CardDescription>Basic submission details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">Submission ID</p>
              <p className="font-medium">{submission.submissionId}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">File Name</p>
              <p className="font-medium break-all">{submission.zipFileName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Student</p>
              <p className="font-medium">{submission.studentInfo.fullName}</p>
              <p className="text-xs text-muted-foreground">{submission.studentInfo.studentCode}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium text-sm">{submission.studentInfo.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Uploaded</p>
              <p className="font-medium">{new Date(submission.uploadedAt).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Checked</p>
              <p className="font-medium">{new Date(submission.checkedAt).toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Violations Card */}
      {submission.violationCount > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Violation Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Violations</p>
                <p className="text-3xl font-bold text-destructive">{submission.violationCount}</p>
              </div>
              <Badge variant="destructive">Issues Found</Badge>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Violation Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Violations</p>
                <p className="text-3xl font-bold text-green-600">0</p>
              </div>
              <Badge variant="outline">Clean</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Violations Details */}
      {submission.violations.length > 0 && (
        <SubmissionViolationsView data={transformedSubmission} />
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <Button onClick={() => router.back()} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to List
        </Button>
      </div>
    </div>
  );
}
