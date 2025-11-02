import { ViolationRecord, ViolationType, ViolationDetail } from "./types";

/**
 * Mock data generator - Simulates detecting violations from uploaded file
 * In real app, this would be processed by backend
 */
export function generateMockViolations(fileName: string): ViolationRecord[] {
  // Parse student info from filename (e.g., "NguyenVanA_21IT001_ClassA.zip")
  const parts = fileName.replace(/\.[^/.]+$/, "").split("_");
  
  const mockRecords: ViolationRecord[] = [];
  
  // Generate 3-8 random records per file upload
  const recordCount = Math.floor(Math.random() * 6) + 3;
  
  for (let i = 0; i < recordCount; i++) {
    const violations = generateRandomViolations();
    
    mockRecords.push({
      id: `${Date.now()}-${i}`,
      studentName: `Sinh viên ${i + 1}`,
      studentId: `${20}IT${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`,
      classCode: `IT${Math.floor(Math.random() * 5) + 1}`,
      violations,
    });
  }
  
  return mockRecords;
}

/**
 * Generate random violations for a student record
 */
function generateRandomViolations(): ViolationDetail[] {
  const violationTypes: ViolationType[] = [
    "incorrect_filename",
    "invalid_naming_convention",
    "source_code_duplicate",
    "suspicious_code_pattern",
    "missing_documentation",
  ];

  const severities = ["low", "medium", "high"] as const;
  
  const violationCount = Math.floor(Math.random() * 4) + 1; // 1-4 violations per record
  const violations: ViolationDetail[] = [];
  const selected = new Set<ViolationType>();
  
  while (violations.length < violationCount) {
    const type = violationTypes[Math.floor(Math.random() * violationTypes.length)];
    
    if (!selected.has(type)) {
      selected.add(type);
      violations.push({
        type,
        message: getViolationMessage(type),
        severity: severities[Math.floor(Math.random() * severities.length)],
      });
    }
  }
  
  return violations;
}

/**
 * Get human-readable message for violation type
 */
function getViolationMessage(type: ViolationType): string {
  const messages: Record<ViolationType, string> = {
    incorrect_filename: "Tên file không tuân theo định dạng quy định",
    invalid_naming_convention: "Biến/hàm không tuân theo camelCase hoặc snake_case",
    source_code_duplicate: "Phát hiện 85% tương đồng với bài nộp khác",
    suspicious_code_pattern: "Mẫu mã không phù hợp với yêu cầu",
    missing_documentation: "Thiếu comment hoặc tài liệu trong code",
  };
  
  return messages[type];
}

/**
 * Validate file is zip or rar
 */
export function isValidArchiveFile(file: File): boolean {
  const validTypes = [
    "application/zip",
    "application/x-zip-compressed",
    "application/x-rar-compressed",
    "application/vnd.rar",
  ];
  
  const validExtensions = [".zip", ".rar"];
  
  const hasValidType = validTypes.includes(file.type);
  const hasValidExtension = validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext));
  
  return hasValidType || hasValidExtension;
}
