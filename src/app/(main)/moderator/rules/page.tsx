"use client";

import { useState, useMemo } from "react";
import { MoreHorizontal, Plus, Search, Trash2, Edit, Copy, BarChart3 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

import { CreateRuleModal } from "./_components/create-rule-modal";
import { Rule } from "./types";
import { generateMockRules, getSeverityColor } from "./utils";
import {
  handleCreateRule,
  handleUpdateRule,
  handleDeleteRule,
  handleToggleRuleActive,
  handleTestRulePattern,
  handleDuplicateRule,
} from "./handlers";
import { EditRuleModal } from "./_components/edit-rule-modal";
import { RulesStats } from "./_components/rules-stats";

export default function RulesPage() {
  const [rules, setRules] = useState<Rule[]>(generateMockRules());
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRule, setEditingRule] = useState<Rule | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    ruleId: string | null;
  }>({ isOpen: false, ruleId: null });

  const filteredRules = useMemo(() => {
    return rules.filter(
      (rule) =>
        rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rule.ruleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rule.pattern.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [rules, searchTerm]);

  const onCreateRule = async (ruleData: Rule) => {
    await handleCreateRule({
      name: ruleData.name,
      pattern: ruleData.pattern,
      severity: ruleData.severity,
      description: ruleData.description,
    });
    const newRule: Rule = {
      ruleId: `RULE-${rules.length + 1}`,
      name: ruleData.name,
      pattern: ruleData.pattern,
      severity: ruleData.severity,
      description: ruleData.description,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: "Current User",
      detectionCount: 0,
    };
    setRules([...rules, newRule]);
    setShowCreateModal(false);
  };

  const onUpdateRule = async (ruleData: Partial<Rule>) => {
    if (!editingRule) return;
    await handleUpdateRule(editingRule.ruleId, ruleData);
    setRules(rules.map((r) => (r.ruleId === editingRule.ruleId ? { ...r, ...ruleData, updatedAt: new Date() } : r)));
    setShowEditModal(false);
    setEditingRule(null);
  };

  const onDeleteRule = async (ruleId: string) => {
    const success = await handleDeleteRule(ruleId);
    if (success) {
      setRules(rules.filter((r) => r.ruleId !== ruleId));
    }
    setDeleteConfirm({ isOpen: false, ruleId: null });
  };

  const onToggleActive = async (rule: Rule) => {
    const success = await handleToggleRuleActive(rule.ruleId, !rule.isActive);
    if (success) {
      setRules(rules.map((r) => (r.ruleId === rule.ruleId ? { ...r, isActive: !r.isActive } : r)));
    }
  };

  const onDuplicateRule = async (rule: Rule) => {
    await handleDuplicateRule(rule.ruleId);
    const newRule: Rule = {
      ...rule,
      ruleId: `RULE-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      name: `${rule.name} (Copy)`,
      createdAt: new Date(),
      updatedAt: new Date(),
      detectionCount: 0,
    };
    setRules([...rules, newRule]);
  };

  const onTestPattern = async (rule: Rule) => {
    await handleTestRulePattern(rule.ruleId, "// Sample code for testing");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rules</h1>
          <p className="text-muted-foreground">Manage detection rules for code quality and security checks</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Rule
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="text-muted-foreground absolute top-3 left-2 h-4 w-4" />
        <Input
          placeholder="Search rules by name, ID, or pattern..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8"
        />
      </div>

      {/* Stats */}
      <RulesStats rules={rules} />

      {/* Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Pattern</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRules.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center">
                  <div className="text-muted-foreground">
                    {searchTerm ? "No rules found matching your search" : "No rules created yet"}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredRules.map((rule) => (
                <TableRow key={rule.ruleId}>
                  <TableCell className="font-mono text-sm">{rule.ruleId}</TableCell>
                  <TableCell className="font-medium">{rule.name}</TableCell>
                  <TableCell className="text-muted-foreground max-w-xs truncate font-mono text-sm">
                    {rule.pattern}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getSeverityColor(rule.severity)}>
                      {rule.severity.charAt(0).toUpperCase() + rule.severity.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setEditingRule(rule);
                            setShowEditModal(true);
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onToggleActive(rule)}>
                          <Badge className="mr-2 h-3 w-3" />
                          {rule.isActive ? "Deactivate" : "Activate"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDuplicateRule(rule)}>
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onTestPattern(rule)}>
                          <BarChart3 className="mr-2 h-4 w-4" />
                          Test Pattern
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => setDeleteConfirm({ isOpen: true, ruleId: rule.ruleId })}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create Modal */}
      <CreateRuleModal open={showCreateModal} onOpenChange={setShowCreateModal} onSubmit={onCreateRule} />

      {/* Edit Modal */}
      {editingRule && (
        <EditRuleModal
          open={showEditModal}
          onOpenChange={setShowEditModal}
          rule={editingRule}
          onSubmit={onUpdateRule}
        />
      )}

      {/* Delete Confirmation */}
      <AlertDialog
        open={deleteConfirm.isOpen}
        onOpenChange={(isOpen) => setDeleteConfirm({ ...deleteConfirm, isOpen })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Rule</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this rule? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive"
            onClick={() => deleteConfirm.ruleId && onDeleteRule(deleteConfirm.ruleId)}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
