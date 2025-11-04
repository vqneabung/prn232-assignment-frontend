"use client";

import { Rule } from "../types";

interface RulesStatsProps {
  rules: Rule[];
}

export function RulesStats({ rules }: RulesStatsProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="rounded-lg border p-4">
        <div className="text-muted-foreground text-sm font-medium">Total Rules</div>
        <div className="text-2xl font-bold">{rules.length}</div>
      </div>
      <div className="rounded-lg border p-4">
        <div className="text-muted-foreground text-sm font-medium">Active Rules</div>
        <div className="text-2xl font-bold">{rules.filter((r) => r.isActive).length}</div>
      </div>
      <div className="rounded-lg border p-4">
        <div className="text-muted-foreground text-sm font-medium">Critical Rules</div>
        <div className="text-2xl font-bold">{rules.filter((r) => r.severity === "critical").length}</div>
      </div>
    </div>
  );
}
