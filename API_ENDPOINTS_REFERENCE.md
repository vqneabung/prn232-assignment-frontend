# 📡 API Endpoints Reference

Dưới đây là structure của các API endpoints mà bạn cần implement để tích hợp với handlers.

---

## 🔵 Manager API Endpoints

### Assignment Management

#### `POST /api/manager/assignments`
Assign examiners to multiple submissions
```typescript
Request Body:
{
  submissionIds: string[],      // ["SUB-001", "SUB-002", ...]
  examinerIds: string[]          // ["EXM-001", "EXM-002", ...]
}

Response:
{
  success: boolean,
  message: string,
  data: {
    assignedCount: number,
    assignments: Assignment[]
  }
}
```

#### `PUT /api/manager/assignments/{submissionId}`
Reassign examiner for a submission
```typescript
Request Body:
{
  oldExaminerId: string,
  newExaminerId: string
}

Response:
{
  success: boolean,
  message: string,
  data: Assignment
}
```

#### `DELETE /api/manager/assignments/{submissionId}/examiners/{examinerId}`
Remove examiner from submission
```typescript
Response:
{
  success: boolean,
  message: string
}
```

### Violation Management

#### `GET /api/manager/violations/{violationId}`
Get violation details
```typescript
Response:
{
  success: boolean,
  data: {
    id: string,
    submissionId: string,
    violationType: string,
    description: string,
    severity: string,
    reportedAt: Date,
    // ... other fields
  }
}
```

#### `PATCH /api/manager/violations/{violationId}`
Resolve or update violation
```typescript
Request Body:
{
  status: "give_zero" | "dismiss",
  notes?: string,
  action?: string
}

Response:
{
  success: boolean,
  message: string,
  data: Violation
}
```

#### `PATCH /api/manager/violations/{violationId}/spam`
Mark violation as spam
```typescript
Response:
{
  success: boolean,
  message: string
}
```

---

## 🟢 Moderator API Endpoints

### Complaint Management

#### `GET /api/moderator/complaints/{complaintId}`
Get complaint details
```typescript
Response:
{
  success: boolean,
  data: Complaint
}
```

#### `PATCH /api/moderator/complaints/{complaintId}`
Resolve complaint
```typescript
Request Body:
{
  status: "resolved" | "rejected",
  resolution?: string,
  notes?: string
}

Response:
{
  success: boolean,
  message: string,
  data: Complaint
}
```

#### `DELETE /api/moderator/complaints/{complaintId}`
Delete complaint
```typescript
Response:
{
  success: boolean,
  message: string
}
```

#### `POST /api/moderator/complaints/{complaintId}/assign`
Assign complaint to moderator
```typescript
Request Body:
{
  moderatorId: string
}

Response:
{
  success: boolean,
  message: string,
  data: Complaint
}
```

### Zero-Point Verification

#### `GET /api/moderator/verifications/{submissionId}`
Get zero-point case details
```typescript
Response:
{
  success: boolean,
  data: ZeroPointCase
}
```

#### `PATCH /api/moderator/verifications/{submissionId}`
Verify or dismiss zero-point
```typescript
Request Body:
{
  verificationStatus: "verified" | "dismissed",
  reason?: string
}

Response:
{
  success: boolean,
  message: string,
  data: ZeroPointCase
}
```

#### `POST /api/moderator/verifications/{submissionId}/remark`
Request re-examination/remark
```typescript
Request Body:
{
  status: "needs-investigation",
  reason?: string
}

Response:
{
  success: boolean,
  message: string
}
```

#### `POST /api/moderator/verifications/{submissionId}/notes`
Add verification notes
```typescript
Request Body:
{
  notes: string
}

Response:
{
  success: boolean,
  message: string,
  data: { notes: string[] }
}
```

### Fairness Review

#### `GET /api/moderator/fairness/{submissionId}`
Get fairness review details
```typescript
Response:
{
  success: boolean,
  data: FairnessCase
}
```

#### `PATCH /api/moderator/fairness/{submissionId}`
Resolve fairness discrepancy
```typescript
Request Body:
{
  resolution: "accept_score1" | "accept_score2" | "average"
}

Response:
{
  success: boolean,
  message: string,
  data: FairnessCase
}
```

#### `POST /api/moderator/fairness/{submissionId}/reexamine`
Request re-examination
```typescript
Response:
{
  success: boolean,
  message: string
}
```

---

## 🔴 Admin API Endpoints

### Subject Management

#### `POST /api/admin/subjects`
Create subject
```typescript
Request Body:
{
  code: string,
  name: string,
  credits: number,
  description?: string
}

Response:
{
  success: boolean,
  data: Subject
}
```

#### `PUT /api/admin/subjects/{subjectId}`
Update subject
```typescript
Request Body:
{
  code?: string,
  name?: string,
  credits?: number,
  description?: string
}

Response:
{
  success: boolean,
  data: Subject
}
```

#### `DELETE /api/admin/subjects/{subjectId}`
Delete subject
```typescript
Response:
{
  success: boolean,
  message: string
}
```

### Semester Management

#### `POST /api/admin/semesters`
Create semester
```typescript
Request Body:
{
  code: string,
  name: string,
  startDate: Date,
  endDate: Date,
  description?: string
}

Response:
{
  success: boolean,
  data: Semester
}
```

#### `PUT /api/admin/semesters/{semesterId}`
Update semester
```typescript
Request Body:
{
  code?: string,
  name?: string,
  startDate?: Date,
  endDate?: Date
}

Response:
{
  success: boolean,
  data: Semester
}
```

#### `DELETE /api/admin/semesters/{semesterId}`
Delete semester
```typescript
Response:
{
  success: boolean,
  message: string
}
```

#### `PATCH /api/admin/semesters/{semesterId}/set-current`
Set as current/active semester
```typescript
Response:
{
  success: boolean,
  message: string,
  data: Semester
}
```

### Exam Management

#### `POST /api/admin/exams`
Create exam
```typescript
Request Body:
{
  code: string,
  name: string,
  subjectId: string,
  semesterId: string,
  examDate: Date,
  examTime: string,      // "14:00"
  duration: number,      // minutes
  maxScore: number,
  description?: string
}

Response:
{
  success: boolean,
  data: Exam
}
```

#### `PUT /api/admin/exams/{examId}`
Update exam
```typescript
Request Body:
{
  code?: string,
  name?: string,
  examDate?: Date,
  examTime?: string,
  duration?: number,
  maxScore?: number
}

Response:
{
  success: boolean,
  data: Exam
}
```

#### `DELETE /api/admin/exams/{examId}`
Delete exam
```typescript
Response:
{
  success: boolean,
  message: string
}
```

#### `PATCH /api/admin/exams/{examId}/publish`
Publish exam
```typescript
Response:
{
  success: boolean,
  message: string,
  data: Exam
}
```

#### `PATCH /api/admin/exams/{examId}/close`
Close/finish exam
```typescript
Response:
{
  success: boolean,
  message: string,
  data: Exam
}
```

### Results Approval

#### `GET /api/admin/approvals/{examId}`
Get approval details
```typescript
Response:
{
  success: boolean,
  data: {
    examId: string,
    examName: string,
    totalStudents: number,
    completedGrading: number,
    averageScore: number,
    status: "pending" | "approved"
  }
}
```

#### `PATCH /api/admin/approvals/{examId}`
Approve or reject results
```typescript
Request Body:
{
  status: "approved" | "rejected",
  reason?: string   // required if rejected
}

Response:
{
  success: boolean,
  message: string,
  data: Approval
}
```

#### `POST /api/admin/approvals/{examId}/review-request`
Request results review
```typescript
Response:
{
  success: boolean,
  message: string
}
```

### Report Generation

#### `POST /api/admin/reports/generate`
Generate report
```typescript
Request Body:
{
  type: "grading_summary" | "statistical_analysis" | "violation_report" | "compliance_report",
  filters?: {
    semester?: string,
    subject?: string,
    examiner?: string,
    dateRange?: { start: Date, end: Date }
  }
}

Response:
{
  success: boolean,
  data: {
    reportId: string,
    type: string,
    generatedAt: Date,
    downloadUrl: string
  }
}
```

#### `POST /api/admin/reports/{reportId}/export`
Export report
```typescript
Request Body:
{
  format: "pdf" | "xlsx" | "csv"
}

Response:
{
  success: boolean,
  data: {
    downloadUrl: string,
    format: string,
    fileName: string
  }
}
```

#### `GET /api/admin/reports/{reportId}/download`
Download report file
```typescript
Response:
Binary file (PDF, Excel, CSV)
```

#### `DELETE /api/admin/reports/{reportId}`
Delete report
```typescript
Response:
{
  success: boolean,
  message: string
}
```

#### `POST /api/admin/reports/schedule`
Schedule recurring reports
```typescript
Request Body:
{
  type: string,
  schedule: "daily" | "weekly" | "monthly",
  email?: string
}

Response:
{
  success: boolean,
  message: string,
  data: {
    scheduleId: string,
    nextRun: Date
  }
}
```

### System Audit

#### `GET /api/admin/audit-logs/{resourceType}`
Get audit log
```typescript
Query Params:
- resourceType: "subject" | "semester" | "exam" | "approval" | "report"
- limit?: number
- offset?: number

Response:
{
  success: boolean,
  data: AuditLog[]
}
```

#### `GET /api/admin/audit-logs/{resourceType}/export`
Export audit log
```typescript
Query Params:
- format: "excel" | "csv"

Response:
Binary file (Excel, CSV)
```

---

## 🛡️ Error Handling

Tất cả endpoints nên trả về error format sau:

```typescript
Response (Error):
{
  success: false,
  message: string,
  code: string,
  errors?: {
    [field: string]: string[]
  }
}

HTTP Status Codes:
- 200: OK
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 422: Unprocessable Entity (Validation Error)
- 500: Internal Server Error
```

---

## 📝 Implementation Example

```typescript
// File: src/app/(main)/admin/handlers.ts

export async function handleDeleteSubject(subjectId: string): Promise<void> {
  try {
    console.log("Deleting subject:", subjectId);

    const response = await fetch(`/api/admin/subjects/${subjectId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete subject");
    }

    toast.success("Subject deleted successfully");

    // TODO: Refetch subjects list or update local state
    // Example: 
    // const subjects = await fetch("/api/admin/subjects").then(r => r.json());
    // setSubjects(subjects.data);

  } catch (error) {
    console.error("Error deleting subject:", error);
    toast.error(
      error instanceof Error ? error.message : "Failed to delete subject"
    );
  }
}
```

---

## 🔗 Base URL

Tất cả endpoints bắt đầu với:
- **Development**: `http://localhost:3000/api`
- **Production**: `https://your-domain.com/api`

Hoặc sử dụng relative URL: `/api/...`
