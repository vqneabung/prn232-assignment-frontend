"use client";

import { useState, useEffect, useCallback } from "react";
import { Check, ChevronsUpDown, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import type { RuleResponse } from "@/types/type";
import { ruleApi } from "@/lib/api/rule/rule";
import { toast } from "sonner";

interface RulesMultiSelectProps {
  selectedRuleIds: number[];
  onRulesChange: (ruleIds: number[]) => void;
  disabled?: boolean;
}

export function RulesMultiSelect({ selectedRuleIds, onRulesChange, disabled }: RulesMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [rules, setRules] = useState<RuleResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch rules on mount
  useEffect(() => {
    const fetchRules = async () => {
      try {
        setIsLoading(true);
        const response = await ruleApi.getAll();
        if (response.success && Array.isArray(response.data)) {
          setRules(response.data);
        } else {
          toast.error("Failed to fetch rules");
        }
      } catch (error) {
        console.error("Error fetching rules:", error);
        toast.error("Error fetching rules");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRules();
  }, []);

  const handleToggle = useCallback(
    (ruleId: number) => {
      const newSelection = selectedRuleIds.includes(ruleId)
        ? selectedRuleIds.filter((id) => id !== ruleId)
        : [...selectedRuleIds, ruleId];
      onRulesChange(newSelection);
    },
    [selectedRuleIds, onRulesChange],
  );

  const handleRemove = useCallback(
    (ruleId: number) => {
      onRulesChange(selectedRuleIds.filter((id) => id !== ruleId));
    },
    [selectedRuleIds, onRulesChange],
  );

  const selectedRules = rules.filter((r) => selectedRuleIds.includes(r.ruleId));

  return (
    <div className="space-y-2">
      <Label>Select Rules to Check (Optional)</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={disabled ?? isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading rules...
              </>
            ) : selectedRuleIds.length > 0 ? (
              `${selectedRuleIds.length} rule(s) selected`
            ) : (
              "Select rules..."
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search rules..." />
            <CommandEmpty>No rules found.</CommandEmpty>
            <CommandList>
              <CommandGroup>
                {rules.map((rule) => (
                  <CommandItem
                    key={rule.ruleId}
                    value={String(rule.ruleId)}
                    onSelect={() => handleToggle(rule.ruleId)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedRuleIds.includes(rule.ruleId) ? "opacity-100" : "opacity-0",
                      )}
                    />
                    <div className="flex-1">
                      <p className="font-medium">{rule.name}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        Pattern: <span className="font-mono">{rule.pattern}</span>
                      </p>
                      {rule.description && (
                        <p className="text-xs text-muted-foreground line-clamp-1">{rule.description}</p>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Selected Rules Display */}
      {selectedRules.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedRules.map((rule) => (
            <Badge
              key={rule.ruleId}
              variant="secondary"
              className="flex items-center gap-1 px-2 py-1"
            >
              <span className="text-xs">{rule.name}</span>
              <button
                type="button"
                onClick={() => handleRemove(rule.ruleId)}
                className="ml-1 hover:opacity-70"
                disabled={disabled}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
