import { Rule } from "./types";

/**
 * Mock Data Generators
 */

export function generateMockRules(): Rule[] {
  return [
    {
      ruleId: "RULE-001",
      name: "Detect Context Keyword",
      pattern: "context",
      severity: "medium",
      description: 'Avoid using "context" directly in code.',
      isActive: true,
      createdAt: new Date(2024, 9, 15),
      updatedAt: new Date(2024, 10, 1),
      createdBy: "Moderator01",
      detectionCount: 42,
    },
    {
      ruleId: "RULE-002",
      name: "SQL Injection Pattern",
      pattern: "SELECT.*FROM.*WHERE.*=.*input",
      severity: "critical",
      description: "Detects potential SQL injection vulnerabilities",
      isActive: true,
      createdAt: new Date(2024, 8, 20),
      updatedAt: new Date(2024, 10, 3),
      createdBy: "Moderator02",
      detectionCount: 8,
    },
    {
      ruleId: "RULE-003",
      name: "Hardcoded Password",
      pattern: "password\\s*=\\s*['\"].*['\"]",
      severity: "critical",
      description: "Finds hardcoded passwords in source code",
      isActive: true,
      createdAt: new Date(2024, 7, 10),
      updatedAt: new Date(2024, 9, 28),
      createdBy: "Moderator01",
      detectionCount: 15,
    },
    {
      ruleId: "RULE-004",
      name: "Unused Variables",
      pattern: "var\\s+\\w+\\s*=",
      severity: "low",
      description: "Detects potentially unused variable declarations",
      isActive: false,
      createdAt: new Date(2024, 6, 5),
      updatedAt: new Date(2024, 10, 2),
      createdBy: "Moderator03",
      detectionCount: 127,
    },
    {
      ruleId: "RULE-005",
      name: "API Key Exposure",
      pattern: "api[_-]?key\\s*[:=]",
      severity: "critical",
      description: "Detects exposed API keys and secrets",
      isActive: true,
      createdAt: new Date(2024, 5, 1),
      updatedAt: new Date(2024, 10, 4),
      createdBy: "Moderator02",
      detectionCount: 3,
    },
  ];
}

/**
 * Utility Functions
 */

export function getSeverityColor(severity: string): string {
  const colorMap: Record<string, string> = {
    low: "bg-yellow-100 text-yellow-800",
    medium: "bg-orange-100 text-orange-800",
    high: "bg-red-100 text-red-800",
    critical: "bg-red-200 text-red-900",
  };
  return colorMap[severity] || "bg-gray-100 text-gray-800";
}

export function getSeverityLabel(severity: string): string {
  return severity.charAt(0).toUpperCase() + severity.slice(1);
}

export function getStatusColor(isActive: boolean): string {
  return isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800";
}

export function getStatusLabel(isActive: boolean): string {
  return isActive ? "Active" : "Inactive";
}
