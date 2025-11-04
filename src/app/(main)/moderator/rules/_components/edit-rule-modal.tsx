"use client";

import { useState, useEffect } from "react";

import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { Rule, RuleUpdateInput } from "../types";

interface EditRuleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rule: Rule;
  onSubmit: (data: RuleUpdateInput) => Promise<void>;
}

export function EditRuleModal({ open, onOpenChange, rule, onSubmit }: EditRuleModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<RuleUpdateInput>({
    name: rule.name,
    pattern: rule.pattern,
    severity: rule.severity,
    description: rule.description,
  });

  useEffect(() => {
    if (open) {
      setFormData({
        name: rule.name,
        pattern: rule.pattern,
        severity: rule.severity,
        description: rule.description,
      });
    }
  }, [open, rule]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim() || !formData.pattern?.trim()) {
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit(formData);
      onOpenChange(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Rule: {rule.ruleId}</DialogTitle>
          <DialogDescription>Update the detection rule configuration.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="edit-rule-name">Rule Name *</Label>
            <Input
              id="edit-rule-name"
              placeholder="e.g., Detect SQL Injection"
              value={formData.name || ""}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={isLoading}
            />
          </div>

          {/* Severity */}
          <div className="space-y-2">
            <Label htmlFor="edit-rule-severity">Severity *</Label>
            <Select
              value={formData.severity || "medium"}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  severity: value as "low" | "medium" | "high" | "critical",
                })
              }
              disabled={isLoading}
            >
              <SelectTrigger id="edit-rule-severity">
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
            <Label htmlFor="edit-rule-pattern">Pattern (Regex) *</Label>
            <Textarea
              id="edit-rule-pattern"
              placeholder="e.g., (?i)(union|select|insert|delete|update).*(?i)(from|into|where)"
              value={formData.pattern || ""}
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
            <Label htmlFor="edit-rule-description">Description</Label>
            <Textarea
              id="edit-rule-description"
              placeholder="Describe what this rule detects..."
              value={formData.description || ""}
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
              Update Rule
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
