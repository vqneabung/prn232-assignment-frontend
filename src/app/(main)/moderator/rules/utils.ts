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
    },
    {
      ruleId: "RULE-002",
      name: "SQL Injection Pattern",
      pattern: "SELECT.*FROM.*WHERE.*=.*input",
      severity: "critical",
      description: "Detects potential SQL injection vulnerabilities",
    },
    {
      ruleId: "RULE-003",
      name: "Hardcoded Password",
      pattern: "password\\s*=\\s*['\"].*['\"]",
      severity: "critical",
      description: "Finds hardcoded passwords in source code",
    },
    {
      ruleId: "RULE-004",
      name: "Unused Variables",
      pattern: "var\\s+\\w+\\s*=",
      severity: "low",
      description: "Detects potentially unused variable declarations",
    },
    {
      ruleId: "RULE-005",
      name: "API Key Exposure",
      pattern: "api[_-]?key\\s*[:=]",
      severity: "critical",
      description: "Detects exposed API keys and secrets",
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

export const mappingToRulesFromResponse = (response: unknown): Rule[] | null => {
  if (Array.isArray(response)) {
    const rules: Rule[] = [];
    for (const item of response) {
      if (isValidRuleResponse(item)) {
        rules.push({
          ruleId: item.ruleId,
          name: item.name,
          pattern: item.pattern,
          severity: item.severity,
          description: item.description,
        });
      }
    }
    return rules;
  }
  return null;
};

const isValidRuleResponse = (response: unknown): response is Rule => {
  return (
    typeof response === "object" &&
    response !== null &&
    "ruleId" in response &&
    "name" in response &&
    "pattern" in response &&
    "severity" in response &&
    "description" in response
  );
};
