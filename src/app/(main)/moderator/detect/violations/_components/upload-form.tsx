"use client";

import { useState, useCallback } from "react";
import { Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface UploadFormProps {
  onUpload: (file: File) => void;
  isLoading?: boolean;
}

export function UploadForm({ onUpload, isLoading = false }: UploadFormProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
    const validExtensions = [".zip", ".rar"];
    const hasValidExtension = validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext));

    if (!hasValidExtension) {
      setError("Chỉ hỗ trợ file .zip hoặc .rar");
      return false;
    }

    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      setError("File không được vượt quá 100MB");
      return false;
    }

    setError(null);
    return true;
  };

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);

      const files = e.dataTransfer.files;
      if (files && files[0]) {
        if (validateFile(files[0])) {
          onUpload(files[0]);
        }
      }
    },
    [onUpload],
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files[0]) {
        if (validateFile(files[0])) {
          onUpload(files[0]);
        }
      }
    },
    [onUpload],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload File</CardTitle>
        <CardDescription>Tải lên file zip hoặc rar để phát hiện vi phạm</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
            isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-muted-foreground/50"
          }`}
        >
          <div className="flex flex-col items-center justify-center gap-3">
            <Upload className="text-muted-foreground size-8" />
            <div>
              <p className="font-medium">Kéo file vào đây hoặc nhấp để chọn</p>
              <p className="text-muted-foreground text-sm">Hỗ trợ: ZIP, RAR (tối đa 100MB)</p>
            </div>
          </div>
          <input
            type="file"
            accept=".zip,.rar,application/zip,application/x-rar-compressed"
            onChange={handleFileSelect}
            disabled={isLoading}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
        </div>

        {error && <div className="bg-destructive/10 text-destructive rounded-md p-3 text-sm">{error}</div>}

        <Button asChild variant="outline" className="w-full" disabled={isLoading}>
          <label className="cursor-pointer">{isLoading ? "Đang xử lí..." : "Chọn file"}</label>
        </Button>
      </CardContent>
    </Card>
  );
}
