"use client";

import { useState } from "react";

import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { RuleCreateInput } from "../types";

interface CreateRuleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
}

export function CreateRuleModal({ open, onOpenChange, onSubmit }: CreateRuleModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<RuleCreateInput>({
    name: "",
    pattern: "",
    severity: "medium",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.pattern.trim()) {
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit(formData);
      setFormData({
        name: "",
        pattern: "",
        severity: "medium",
        description: "",
      });
      onOpenChange(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Rule</DialogTitle>
          <DialogDescription>Define a new detection rule for code quality and security checks.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="rule-name">Rule Name *</Label>
            <Input
              id="rule-name"
              placeholder="e.g., Detect SQL Injection"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={isLoading}
            />
          </div>

          {/* Severity */}
          <div className="space-y-2">
            <Label htmlFor="rule-severity">Severity *</Label>
            <Select
              value={formData.severity}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  severity: value as "low" | "medium" | "high" | "critical",
                })
              }
              disabled={isLoading}
            >
              <SelectTrigger id="rule-severity">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Pattern */}
          <div className="space-y-2">
            <Label htmlFor="rule-pattern">Pattern (Regex) *</Label>
            <Textarea
              id="rule-pattern"
              placeholder="e.g., (?i)(union|select|insert|delete|update).*(?i)(from|into|where)"
              value={formData.pattern}
              onChange={(e) => setFormData({ ...formData, pattern: e.target.value })}
              disabled={isLoading}
              className="font-mono text-sm"
              rows={4}
            />
            <p className="text-muted-foreground text-xs">
              Enter a regular expression pattern to match suspicious code.
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="rule-description">Description</Label>
            <Textarea
              id="rule-description"
              placeholder="Describe what this rule detects..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              disabled={isLoading}
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Rule
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
