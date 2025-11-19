import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface MatchedFile {
  currentFile: string;
  matchedFile: string;
  similarity: number;
  matchedSubmissionId: string;
}

interface MatchedFilesTableProps {
  matchedFiles: MatchedFile[];
}

export function MatchedFilesTable({ matchedFiles }: MatchedFilesTableProps) {
  const getSimilarityVariant = (similarity: number) => {
    if (similarity >= 0.95) return "destructive";
    if (similarity >= 0.85) return "default";
    return "secondary";
  };

  const getSimilarityColor = (similarity: number) => {
    if (similarity >= 0.95) return "text-red-600";
    if (similarity >= 0.85) return "text-orange-600";
    return "text-yellow-600";
  };

  // Sort by similarity descending
  const sortedFiles = [...matchedFiles].sort((a, b) => b.similarity - a.similarity);

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">#</TableHead>
            <TableHead>Current File</TableHead>
            <TableHead>Matched File</TableHead>
            <TableHead>Matched Submission</TableHead>
            <TableHead className="text-right">Similarity</TableHead>
            <TableHead className="w-32">Match Level</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedFiles.map((file, index) => {
            const similarityPercent = Math.round(file.similarity * 100);
            return (
              <TableRow key={`${file.currentFile}-${file.matchedFile}-${file.matchedSubmissionId}`}>
                <TableCell className="text-muted-foreground">{index + 1}</TableCell>
                <TableCell>
                  <code className="text-xs bg-muted px-2 py-1 rounded block max-w-xs truncate">
                    {file.currentFile}
                  </code>
                </TableCell>
                <TableCell>
                  <code className="text-xs bg-muted px-2 py-1 rounded block max-w-xs truncate">
                    {file.matchedFile}
                  </code>
                </TableCell>
                <TableCell>
                  <code className="text-xs bg-secondary px-2 py-1 rounded">
                    #{file.matchedSubmissionId}
                  </code>
                </TableCell>
                <TableCell className="text-right">
                  <div className="space-y-1">
                    <span className={`font-bold ${getSimilarityColor(file.similarity)}`}>
                      {similarityPercent}%
                    </span>
                    <Progress
                      value={similarityPercent}
                      className={`h-2 ${file.similarity >= 0.9 ? "bg-red-100" : file.similarity >= 0.7 ? "bg-yellow-100" : "bg-gray-100"}`}
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getSimilarityVariant(file.similarity)}>
                    {file.similarity >= 0.95
                      ? "Very High"
                      : file.similarity >= 0.85
                        ? "High"
                        : file.similarity >= 0.7
                          ? "Medium"
                          : "Low"}
                  </Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
