"use client";

import { useState, useEffect } from "react";
import { Loader2, Shield, Activity, XCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { plagiarismApi } from "@/lib/api/plagiarism/plagiarism";
import { PlagiarismResultView } from "../_components/plagiarism-result-view";

interface PlagiarismCheckResult {
  isPlagiarized: boolean;
  similarityScore: number;
  matchedSubmissionId: string;
  matchedFiles: Array<{
    currentFile: string;
    matchedFile: string;
    similarity: number;
    matchedSubmissionId: string;
  }>;
  totalFilesChecked: number;
  message: string | null;
}

export default function PlagiarismCheckPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submissionId, setSubmissionId] = useState<string>("");
  const [threshold, setThreshold] = useState<string>("0.85");
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<PlagiarismCheckResult | null>(null);
  const [healthStatus, setHealthStatus] = useState<{
    available: boolean;
    isLoading: boolean;
    error: boolean;
  }>({ available: false, isLoading: true, error: false });

  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    try {
      setHealthStatus({ available: false, isLoading: true, error: false });
      const response = await plagiarismApi.health();
      if (response.success && response.data) {
        setHealthStatus({ available: response.data.available, isLoading: false, error: false });
      } else {
        setHealthStatus({ available: false, isLoading: false, error: true });
      }
    } catch (error) {
      console.error("Health check failed:", error);
      setHealthStatus({ available: false, isLoading: false, error: true });
    }
  };

  const generateRandomSubmissionId = () => {
    const randomId = `temp-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    setSubmissionId(randomId);
    toast.info(`Generated submission ID: ${randomId}`);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.name.endsWith(".zip")) {
        setSelectedFile(file);
        setResult(null);
      } else {
        toast.error("Please select a ZIP file");
      }
    }
  };

  const handleCheck = async () => {
    if (!selectedFile) {
      toast.error("Please select a file");
      return;
    }

    const finalSubmissionId = submissionId.trim() || `temp-${Date.now()}`;
    const thresholdValue = parseFloat(threshold);

    if (isNaN(thresholdValue) || thresholdValue < 0 || thresholdValue > 1) {
      toast.error("Threshold must be between 0 and 1");
      return;
    }

    try {
      setIsChecking(true);
      const response = await plagiarismApi.check(selectedFile, finalSubmissionId, thresholdValue);

      if (response.success && response.data) {
        setResult(response.data as PlagiarismCheckResult);
        if (response.data.isPlagiarized) {
          toast.warning("Plagiarism detected!");
        } else {
          toast.success("No plagiarism detected");
        }
      } else {
        toast.error("Failed to check plagiarism");
      }
    } catch (error) {
      console.error("Error checking plagiarism:", error);
      toast.error("An error occurred during plagiarism check");
    } finally {
      setIsChecking(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setSubmissionId("");
    setThreshold("0.85");
    setResult(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Plagiarism Check</h1>
          <p className="text-muted-foreground mt-1">
            Upload a submission file to check for plagiarism
          </p>
        </div>
        <div className="flex items-center gap-2">
          {healthStatus.isLoading ? (
            <Badge variant="secondary" className="gap-1">
              <Loader2 className="h-3 w-3 animate-spin" />
              Checking...
            </Badge>
          ) : healthStatus.error ? (
            <Badge variant="destructive" className="gap-1">
              <XCircle className="h-3 w-3" />
              Service Error
            </Badge>
          ) : healthStatus.available ? (
            <Badge variant="default" className="gap-1 bg-green-600">
              <Activity className="h-3 w-3" />
              Service Online
            </Badge>
          ) : (
            <Badge variant="destructive" className="gap-1">
              <XCircle className="h-3 w-3" />
              Service Offline
            </Badge>
          )}
        </div>
      </div>

      {/* Upload Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Upload Submission
          </CardTitle>
          <CardDescription>
            Select a ZIP file to check against existing submissions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file">Submission File (*.zip)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="file"
                type="file"
                accept=".zip"
                onChange={handleFileChange}
                disabled={isChecking}
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
              <Label htmlFor="submissionId">
                Submission ID <span className="text-muted-foreground">(optional)</span>
              </Label>
              <div className="flex gap-2">
                <Input
                  id="submissionId"
                  value={submissionId}
                  onChange={(e) => setSubmissionId(e.target.value)}
                  placeholder="Leave empty to auto-generate"
                  disabled={isChecking}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={generateRandomSubmissionId}
                  disabled={isChecking}
                >
                  Generate
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Used to identify this submission. Auto-generated if empty.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="threshold">Similarity Threshold</Label>
              <Input
                id="threshold"
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                placeholder="0.85"
                disabled={isChecking}
              />
              <p className="text-xs text-muted-foreground">
                Minimum similarity score to flag as plagiarism (0-1)
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleCheck}
              disabled={!selectedFile || isChecking}
              className="w-full sm:w-auto"
            >
              {isChecking ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Check Plagiarism
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
      {result && <PlagiarismResultView result={result} />}
    </div>
  );
}
