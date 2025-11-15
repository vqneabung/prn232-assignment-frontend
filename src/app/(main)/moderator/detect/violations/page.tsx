"use client";

import { useState } from "react";

import { UploadForm } from "./_components/upload-form";
import { ViolationsTable } from "./_components/violations-table";
import { ViolationRecord } from "./types";
import { generateMockViolations } from "./utils";

export default function DetectViolationsPage() {
  const [violations, setViolations] = useState<ViolationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpload = async () => {
    setIsLoading(true);
    try {
      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Generate mock violations based on file upload
      const mockViolations = generateMockViolations();
      setViolations(mockViolations);
    } catch (error) {
      console.error("Error processing file:", error);
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
