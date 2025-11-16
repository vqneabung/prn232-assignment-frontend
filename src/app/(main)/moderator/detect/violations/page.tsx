"use client";

import { useState } from "react";

import { UploadForm } from "./_components/upload-form";
import { ViolationsTable } from "./_components/violations-table";
import { ViolationRecord } from "./types";
import { generateMockViolations } from "./utils";
import { checkPlagiarism } from "../../handlers";
import { toast } from "sonner";

export default function DetectViolationsPage() {
  const [violations, setViolations] = useState<ViolationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpload = async (file: File, submissionId: string, threshold?: number) => {
    setIsLoading(true);
    try {
      // Call plagiarism check API
      const result = await checkPlagiarism(file, submissionId, threshold);
      
      if (result && result.isPlagiarized) {
        // Show plagiarism detection result
        toast.success(`Plagiarism detected: ${result.similarityScore}% similarity`);
        // For now, use mock data to display in table
        // In production, transform matched files to violations format
        const mockViolations = generateMockViolations();
        setViolations(mockViolations);
      } else if (result) {
        toast.success("No plagiarism detected");
        setViolations([]);
      } else {
        // Fallback to mock if API fails
        const mockViolations = generateMockViolations();
        setViolations(mockViolations);
        toast.info("Using mock data (API unavailable)");
      }
    } catch (error) {
      console.error("Error processing file:", error);
      toast.error("Failed to check plagiarism");
      setViolations([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Phát hiện vi phạm</h1>
        <p className="text-muted-foreground mt-2">
          Tải lên file zip hoặc rar để phát hiện các vi phạm trong bài nộp của sinh viên
        </p>
      </div>

      <UploadForm onUpload={handleUpload} isLoading={isLoading} />

      <ViolationsTable data={violations} isLoading={isLoading} />
    </div>
  );
}
