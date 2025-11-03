import { Download, FileText, Filter } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function AdminReportsPage() {
  const reportTypes = [
    {
      name: "Grade Summary Report",
      description: "Final grades for all students in an exam",
      format: "Excel, PDF",
      icon: FileText,
    },
    {
      name: "Violation Report",
      description: "All detected violations and their status",
      format: "Excel, PDF",
      icon: FileText,
    },
    {
      name: "Grading Progress Report",
      description: "Detailed grading progress by examiner",
      format: "Excel, PDF",
      icon: FileText,
    },
    {
      name: "Statistical Analysis",
      description: "Score distribution and analytics",
      format: "PDF, Charts",
      icon: FileText,
    },
    {
      name: "Examiner Performance",
      description: "Performance metrics for all examiners",
      format: "Excel, PDF",
      icon: FileText,
    },
    {
      name: "System Audit Log",
      description: "All system activities and changes",
      format: "Excel, CSV",
      icon: FileText,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Export Reports</h1>
        <p className="text-muted-foreground">Generate and download system reports</p>
      </div>

      {/* Filter Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Report Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Report Type</label>
              <Select defaultValue="grade-summary">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grade-summary">Grade Summary</SelectItem>
                  <SelectItem value="violation">Violations</SelectItem>
                  <SelectItem value="progress">Progress</SelectItem>
                  <SelectItem value="statistics">Statistics</SelectItem>
                  <SelectItem value="examiner">Examiner Performance</SelectItem>
                  <SelectItem value="audit">Audit Log</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Semester</label>
              <Select defaultValue="fall-2024">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="spring-2024">Spring 2024</SelectItem>
                  <SelectItem value="summer-2024">Summer 2024</SelectItem>
                  <SelectItem value="fall-2024">Fall 2024</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Export Format</label>
              <Select defaultValue="excel">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2">
            <Button className="gap-2">
              <Download className="h-4 w-4" />
              Generate Report
            </Button>
            <Button variant="outline">Preview</Button>
          </div>
        </CardContent>
      </Card>

      {/* Available Reports */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Available Reports</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reportTypes.map((report, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{report.name}</CardTitle>
                <CardDescription>{report.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-1">
                  {report.format.split(", ").map((fmt) => (
                    <Badge key={fmt} variant="secondary" className="text-xs">
                      {fmt}
                    </Badge>
                  ))}
                </div>
                <Button className="w-full gap-2" size="sm">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Downloads */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Downloads</CardTitle>
          <CardDescription>Reports generated in the last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                name: "Grade Summary - Fall 2024",
                date: "Nov 3, 2024",
                format: "Excel",
              },
              {
                name: "Grading Progress Report",
                date: "Nov 2, 2024",
                format: "PDF",
              },
              {
                name: "Violation Report - October",
                date: "Nov 1, 2024",
                format: "Excel",
              },
            ].map((download, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm">{download.name}</p>
                    <p className="text-xs text-muted-foreground">{download.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{download.format}</Badge>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
