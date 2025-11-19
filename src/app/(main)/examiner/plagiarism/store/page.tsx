"use client";

import { useState, useEffect } from "react";
import { Loader2, Database, CheckCircle2, Activity, XCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import { plagiarismApi } from "@/lib/api/plagiarism/plagiarism";

interface StoreSubmissionResult {
  submissionId: string;
  filesStored: number;
  message: string | null;
}

// eslint-disable-next-line complexity
export default function StoreSubmissionPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submissionId, setSubmissionId] = useState<string>("");
  const [isStoring, setIsStoring] = useState(false);
  const [result, setResult] = useState<StoreSubmissionResult | null>(null);
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
    const randomId = `ref-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
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

  const handleStore = async () => {
    if (!selectedFile) {
      toast.error("Please select a file");
      return;
    }

    const finalSubmissionId = submissionId.trim();
    if (!finalSubmissionId) {
      toast.error("Please enter a Submission ID");
      return;
    }

    try {
      setIsStoring(true);
      const response = await plagiarismApi.store(selectedFile, finalSubmissionId);

      if (response.success && response.data) {
        setResult(response.data as StoreSubmissionResult);
        toast.success("Submission stored successfully!");
      } else {
        toast.error(response.message ?? "Failed to store submission");
      }
    } catch (error) {
      console.error("Error storing submission:", error);
      toast.error("An error occurred while storing submission");
    } finally {
      setIsStoring(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setSubmissionId("");
    setResult(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Store Submission</h1>
          <p className="text-muted-foreground mt-1">
            Store a submission file as reference data for plagiarism detection
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

      {/* Info Alert */}
      <Alert>
        <Database className="h-4 w-4" />
        <AlertTitle>About Storing Submissions</AlertTitle>
        <AlertDescription>
          Stored submissions are used as reference data when checking for plagiarism. Each submission
          needs a unique ID to identify it in the system. You can use student IDs, assignment codes,
          or any unique identifier.
        </AlertDescription>
      </Alert>

      {/* Upload Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Upload Submission
          </CardTitle>
          <CardDescription>
            Select a ZIP file and provide a unique submission ID
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
                disabled={isStoring}
              />
              {selectedFile && (
                <Badge variant="secondary" className="whitespace-nowrap">
                  {selectedFile.name}
                </Badge>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="submissionId">
              Submission ID <span className="text-destructive">*</span>
            </Label>
            <div className="flex gap-2">
              <Input
                id="submissionId"
                value={submissionId}
                onChange={(e) => setSubmissionId(e.target.value)}
                placeholder="Enter unique submission ID"
                disabled={isStoring}
                required
              />
              <Button
                type="button"
                variant="outline"
                onClick={generateRandomSubmissionId}
                disabled={isStoring}
              >
                Generate
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              This ID will be used to identify the submission when checking for plagiarism. Must be
              unique.
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleStore}
              disabled={!selectedFile || isStoring || !submissionId.trim()}
              className="w-full sm:w-auto"
            >
              {isStoring ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Storing...
                </>
              ) : (
                <>
                  <Database className="mr-2 h-4 w-4" />
                  Store Submission
                </>
              )}
            </Button>
            {result && (
              <Button onClick={handleReset} variant="outline" className="w-full sm:w-auto">
                Store Another
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Success Result */}
      {result && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
              <div>
                <CardTitle className="text-green-600">Submission Stored Successfully</CardTitle>
                <CardDescription>{result.message ?? "Files stored successfully"}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-4 bg-white rounded-lg border">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Submission ID</p>
                    <code className="text-sm bg-muted px-2 py-1 rounded">
                      {result.submissionId}
                    </code>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Files Stored</p>
                    <Badge variant="secondary" className="text-base">
                      {result.filesStored} files
                    </Badge>
                  </div>
                </div>
              </div>

              <Alert className="bg-blue-50 border-blue-200">
                <Database className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-900">
                  This submission is now available as reference data. When checking for plagiarism,
                  uploaded files will be compared against this and other stored submissions.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
