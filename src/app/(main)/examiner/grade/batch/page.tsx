"use client";

import { useState } from "react";
import { Upload, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { batchGrading } from "../../handlers";
import { BatchGradingResultView } from "../_components/batch-grading-result-view";

interface BatchGradingResult {
  message: string;
  summary: {
    className: string;
    semester: string;
    classId: number;
    totalStudentFolders: number;
    successfulGradings: number;
    failedGradings: number;
    newStudentsCreated: number;
    existingStudentsFound: number;
    classCreated: boolean;
    processedAt: string;
    errorCount: number;
  };
  studentResults: Array<{
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
  }>;
  errors: string[] | null;
}

export default function BatchGradingPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [ruleIds, setRuleIds] = useState<string>("1,2,3,4");
  const [defaultSemester, setDefaultSemester] = useState<string>("Fall2025");
  const [createClassIfNotExists, setCreateClassIfNotExists] = useState<boolean>(true);
  const [createStudentsIfNotExist, setCreateStudentsIfNotExist] = useState<boolean>(true);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<BatchGradingResult | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.name.endsWith(".zip") || file.name.endsWith(".rar")) {
        setSelectedFile(file);
        setResult(null);
      } else {
        toast.error("Please select a ZIP or RAR file");
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file");
      return;
    }

    if (!defaultSemester.trim()) {
      toast.error("Please enter a semester");
      return;
    }

    try {
      setIsUploading(true);
      const response = await batchGrading(
        selectedFile,
        ruleIds,
        defaultSemester,
        createClassIfNotExists,
        createStudentsIfNotExist,
      );

      if (response) {
        const batchResult = response as BatchGradingResult;
        setResult(batchResult);
        toast.success(batchResult.message);
      } else {
        toast.error("Failed to process batch grading");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("An error occurred during batch grading");
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setResult(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Batch Grading</h1>
          <p className="text-muted-foreground mt-1">
            Upload an archive file containing multiple student submission folders
          </p>
        </div>
      </div>

      {/* Upload Form */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Archive File</CardTitle>
          <CardDescription>
            Select a ZIP file with folder structure: studentNameStudentCode/solution.zip
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file">Archive File (*.zip)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="file"
                type="file"
                accept=".zip,.rar"
                onChange={handleFileChange}
                disabled={isUploading}
              />
              {selectedFile && (
                <Badge variant="secondary" className="whitespace-nowrap">
                  {selectedFile.name}
                </Badge>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ruleIds">Rule IDs (comma-separated)</Label>
              <Input
                id="ruleIds"
                value={ruleIds}
                onChange={(e) => setRuleIds(e.target.value)}
                placeholder="1,2,3,4"
                disabled={isUploading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="semester">Default Semester</Label>
              <Input
                id="semester"
                value={defaultSemester}
                onChange={(e) => setDefaultSemester(e.target.value)}
                placeholder="Fall2025"
                disabled={isUploading}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="createClass"
                checked={createClassIfNotExists}
                onCheckedChange={(checked) => setCreateClassIfNotExists(checked as boolean)}
                disabled={isUploading}
              />
              <label
                htmlFor="createClass"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Create class if not exists
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="createStudents"
                checked={createStudentsIfNotExist}
                onCheckedChange={(checked) => setCreateStudentsIfNotExist(checked as boolean)}
                disabled={isUploading}
              />
              <label
                htmlFor="createStudents"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Create students if not exist
              </label>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="w-full sm:w-auto"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Start Batch Grading
                </>
              )}
            </Button>
            {result && (
              <Button onClick={handleReset} variant="outline" className="w-full sm:w-auto">
                Reset
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {result && <BatchGradingResultView result={result} />}
    </div>
  );
}
