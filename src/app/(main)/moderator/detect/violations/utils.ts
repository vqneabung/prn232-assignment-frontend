import { ViolationRecord, DetectionRule, Violation } from "./types";

/**
 * Mock data generator - Simulates API response for violation detection
 * In real app, this would be the actual API response from backend
 */
export function generateMockViolations(): ViolationRecord[] {
  const files = [
    "DataAccess\\efpt.config.json",
    "DataAccess\\SU25LeopardDBContext.cs",
    "PRN231_SU25_SE183208.api\\Program.cs",
    "DataAccess\\Repositories\\AccountRepo.cs",
    "DataAccess\\Repositories\\LeopardProfileRepo.cs",
  ];

  const rules: DetectionRule[] = [
    {
      ruleId: 1,
      name: "Detect Context Keyword",
      pattern: "context",
      severity: "high",
      description: "Avoid using 'context' directly in code.",
      violations: generateViolations(1, files),
    },
    {
      ruleId: 2,
      name: "Avoid Magic Numbers",
      pattern: "\\b\\d{3,}\\b",
      severity: "medium",
      description: "Magic numbers should be replaced with named constants.",
      violations: generateViolations(2, files.slice(0, 3)),
    },
    {
      ruleId: 3,
      name: "Missing Error Handling",
      pattern: "try|catch|throw",
      severity: "high",
      description: "Functions should include proper error handling.",
      violations: generateViolations(3, files.slice(1, 4)),
    },
  ];

  // Return violations grouped by file
  const violationsByFile = new Map<string, ViolationRecord>();

  rules.forEach((rule) => {
    rule.violations.forEach((violation) => {
      const key = violation.filePath;
      if (!violationsByFile.has(key)) {
        violationsByFile.set(key, {
          filePath: violation.filePath,
          message: violation.message,
          rule,
        });
      }
    });
  });

  return Array.from(violationsByFile.values());
}

/**
 * Generate violations for a rule
 */
function generateViolations(ruleId: number, files: string[]): Violation[] {
  return files.map((filePath, index) => ({
    violationId: 1000 + ruleId * 100 + index,
    submissionId: 1002,
    ruleId,
    filePath,
    message: `Violation detected in ${filePath}`,
  }));
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
