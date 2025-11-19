import { AlertTriangle, CheckCircle2, FileWarning, Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MatchedFilesTable } from "./matched-files-table";

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

interface PlagiarismResultViewProps {
  result: PlagiarismCheckResult;
}

// eslint-disable-next-line complexity
export function PlagiarismResultView({ result }: PlagiarismResultViewProps) {
  const overallSimilarityPercent = Math.round(result.similarityScore * 100);
  const isPlagiarized = result.isPlagiarized;

  // Group matched files by unique combination
  const uniqueMatches = result.matchedFiles.reduce((acc, file) => {
    const key = `${file.currentFile}-${file.matchedFile}`;
    if (!acc.has(key) || acc.get(key)!.similarity < file.similarity) {
      acc.set(key, file);
    }
    return acc;
  }, new Map<string, typeof result.matchedFiles[0]>());

  const matchedFilesArray = Array.from(uniqueMatches.values());
  const highSimilarityCount = matchedFilesArray.filter((f) => f.similarity >= 0.9).length;
  const mediumSimilarityCount = matchedFilesArray.filter(
    (f) => f.similarity >= 0.7 && f.similarity < 0.9,
  ).length;

  return (
    <>
      {/* Overall Result Card */}
      <Card className={isPlagiarized ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isPlagiarized ? (
                <AlertTriangle className="h-8 w-8 text-red-600" />
              ) : (
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              )}
              <div>
                <CardTitle className={isPlagiarized ? "text-red-600" : "text-green-600"}>
                  {isPlagiarized ? "Plagiarism Detected" : "No Plagiarism Detected"}
                </CardTitle>
                <CardDescription>
                  {result.message ?? "Plagiarism check completed"}
                </CardDescription>
              </div>
            </div>
            <Badge
              variant={isPlagiarized ? "destructive" : "default"}
              className={`text-lg px-4 py-2 ${!isPlagiarized ? "bg-green-600" : ""}`}
            >
              {overallSimilarityPercent}% Match
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">Overall Similarity Score</span>
                <span className="text-muted-foreground">{overallSimilarityPercent}%</span>
              </div>
              <Progress
                value={overallSimilarityPercent}
                className={`h-3 ${isPlagiarized ? "bg-red-100" : "bg-green-100"}`}
              />
            </div>

            {isPlagiarized && (
              <div className="p-4 bg-white rounded-lg border">
                <p className="text-sm font-medium mb-1">Matched Submission ID:</p>
                <code className="text-sm bg-muted px-2 py-1 rounded">
                  {result.matchedSubmissionId}
                </code>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Files Checked</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{result.totalFilesChecked}</div>
            <p className="text-xs text-muted-foreground">files analyzed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Matched Files</CardTitle>
            <FileWarning className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{matchedFilesArray.length}</div>
            <p className="text-xs text-muted-foreground">files with matches</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Similarity</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{highSimilarityCount}</div>
            <p className="text-xs text-muted-foreground">&gt;= 90% match</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Medium Similarity</CardTitle>
            <FileWarning className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{mediumSimilarityCount}</div>
            <p className="text-xs text-muted-foreground">70-89% match</p>
          </CardContent>
        </Card>
      </div>

      {/* Matched Files Table */}
      {matchedFilesArray.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Matched Files Details</CardTitle>
            <CardDescription>
              Files with similarity above threshold (showing unique matches)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MatchedFilesTable matchedFiles={matchedFilesArray} />
          </CardContent>
        </Card>
      )}
    </>
  );
}
