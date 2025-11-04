"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";

import { GradingRubric } from "../../../types";
import { calculateFinalScore } from "../../../utils";

const gradingFormSchema = z.object({
  feedback: z.string().min(0).max(1000),
  rubricScores: z.record(z.string(), z.coerce.number().min(0)),
});

type GradingFormValues = z.infer<typeof gradingFormSchema>;

interface GradingFormProps {
  rubrics: GradingRubric[];
  onSubmit: (data: { rubricScores: Record<string, number>; feedback: string; finalScore: number }) => void;
  isLoading?: boolean;
}

export function GradingForm({ rubrics, onSubmit, isLoading = false }: GradingFormProps) {
  const [finalScore, setFinalScore] = useState(0);

  const defaultValues: GradingFormValues = {
    feedback: "",
    rubricScores: rubrics.reduce(
      (acc, r) => {
        acc[r.id] = 0;
        return acc;
      },
      {} as Record<string, number>,
    ),
  };

  const form = useForm<GradingFormValues>({
    resolver: zodResolver(gradingFormSchema),
    defaultValues,
  });

  const handleRubricScoreChange = (rubricId: string, value: number) => {
    form.setValue(`rubricScores.${rubricId}`, value);

    // Recalculate final score
    const newScores = {
      ...form.getValues("rubricScores"),
      [rubricId]: value,
    };

    const newFinalScore = calculateFinalScore(newScores, rubrics);
    setFinalScore(newFinalScore);
  };

  const handleFormSubmit = (data: GradingFormValues) => {
    const finalScoreValue = calculateFinalScore(data.rubricScores, rubrics);
    onSubmit({
      rubricScores: data.rubricScores,
      feedback: data.feedback,
      finalScore: finalScoreValue,
    });
  };

  return (
    <div className="space-y-6">
      {/* Final Score Display */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-lg">Điểm số cuối cùng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-4">
            <div>
              <div className="text-4xl font-bold text-blue-600">{finalScore}</div>
              <p className="text-muted-foreground text-sm">/ 100 điểm</p>
            </div>
            <Progress value={finalScore} className="h-2 flex-1" />
          </div>
        </CardContent>
      </Card>

      {/* Rubric Scoring Form */}
      <Card>
        <CardHeader>
          <CardTitle>Tiêu chí chấm điểm</CardTitle>
          <CardDescription>Nhập điểm cho từng tiêu chí</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
              {/* Rubric Items */}
              <div className="space-y-4">
                {rubrics.map((rubric) => {
                  const score = form.watch(`rubricScores.${rubric.id}`) || 0;
                  const percentage = Math.round((score / rubric.maxScore) * 100);

                  return (
                    <div key={rubric.id} className="space-y-3 rounded-lg border p-4">
                      <div>
                        <h4 className="font-semibold">{rubric.name}</h4>
                        <p className="text-muted-foreground text-sm">{rubric.description}</p>
                      </div>

                      <div className="flex items-end gap-4">
                        <FormField
                          control={form.control}
                          name={`rubricScores.${rubric.id}`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel className="text-xs">
                                Điểm ({field.value || 0}/{rubric.maxScore})
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min="0"
                                  max={rubric.maxScore}
                                  step="0.5"
                                  placeholder="0"
                                  {...field}
                                  onChange={(e) => {
                                    const value = parseFloat(e.target.value) || 0;
                                    const clampedValue = Math.min(value, rubric.maxScore);
                                    handleRubricScoreChange(rubric.id, clampedValue);
                                    field.onChange(e);
                                  }}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <div className="text-right">
                          <div className="text-lg font-semibold">{percentage}%</div>
                          <Progress value={percentage} className="mt-1 h-1 w-16" />
                        </div>
                      </div>

                      <div className="text-muted-foreground text-xs">Trọng số: {rubric.weight}%</div>
                    </div>
                  );
                })}
              </div>

              {/* Feedback Section */}
              <FormField
                control={form.control}
                name="feedback"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nhận xét / Feedback</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Nhập nhận xét chi tiết cho sinh viên..." rows={5} {...field} />
                    </FormControl>
                    <FormDescription>Tối đa 1000 ký tự. Sinh viên sẽ nhìn thấy nhận xét này.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button type="submit" disabled={isLoading} size="lg" className="w-full">
                {isLoading ? "Đang gửi..." : "Gửi điểm số"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
