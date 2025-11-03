# Handler Integration Summary

Đã gắn tất cả handler vào UI của 3 role: **Manager, Moderator, Admin**

## ✅ Hoàn thành - Handler Được Tích Hợp

### Manager Role (`src/app/(main)/manager/`)

#### 1. **Assignment Page** (`assignment/page.tsx`)
- ✅ Modal assign examiner: Gắn `handleAssignExaminers()` vào button "Assign Examiners"
- ✅ Các button "Review" và "Resolve" trong violation table có handler

#### 2. **Violations Page** (`violations/page.tsx`)
- ✅ Button "Review": Gắn `handleReviewViolation(violationId)`
- ✅ Button "Resolve": Gắn `handleResolveViolation(violationId, "dismiss")`

#### 3. **Handler Functions** (`handlers.ts`)
```typescript
- handleAssignExaminers(submissionIds[], examinerIds[])
- handleReassignExaminer(submissionId, oldExaminerId, newExaminerId)
- handleRemoveExaminer(submissionId, examinerId)
- handleReviewViolation(violationId)
- handleResolveViolation(violationId, action: "give_zero" | "dismiss")
- handleQuickResolveViolation(violationId)
- handleMarkViolationAsSpam(violationId)
```

---

### Moderator Role (`src/app/(main)/moderator/`)

#### 1. **Complaints Page** (`complaints/page.tsx`)
- ✅ Button "Review": Gắn `handleReviewComplaint(complaintId)`
- ✅ Button "Delete" (trash icon): Gắn `handleDeleteComplaint(complaintId)`

#### 2. **Verification Page** (`verification/page.tsx`)
- ✅ Button "Review": Gắn `handleReviewZeroPointCase(submissionId)`
- ✅ Button "Verify": Gắn `handleVerifyZeroPoints(submissionId)` (chỉ hiển thị khi pending)
- ✅ Button "Remark": Gắn `handleRequestRemark(submissionId)` (chỉ hiển thị khi pending)

#### 3. **Handler Functions** (`handlers.ts`)
```typescript
// Complaint Handlers
- handleReviewComplaint(complaintId)
- handleResolveComplaint(complaintId, resolution)
- handleRejectComplaint(complaintId)
- handleAssignComplaintToModerator(complaintId, moderatorId)
- handleDeleteComplaint(complaintId)

// Zero-Point Verification Handlers
- handleReviewZeroPointCase(submissionId)
- handleVerifyZeroPoints(submissionId)
- handleDismissZeroPoints(submissionId)
- handleRequestRemark(submissionId)
- handleAddVerificationNotes(submissionId, notes)

// Fairness Review Handlers
- handleReviewFairnessCase(submissionId)
- handleResolveFairnessDiscrepancy(submissionId, resolution)
- handleRequestReexamination(submissionId)
```

---

### Admin Role (`src/app/(main)/admin/`)

#### 1. **Subjects Page** (`system/subjects/page.tsx`)
- ✅ Button "Delete": Gắn `handleDeleteSubject(subjectId)`

#### 2. **Semesters Page** (`system/semesters/page.tsx`)
- ✅ Button "Delete": Gắn `handleDeleteSemester(semesterId)`

#### 3. **Exams Page** (`system/exams/page.tsx`)
- ✅ Button "Delete": Gắn `handleDeleteExam(examId)`

#### 4. **Approval Page** (`approval/page.tsx`)
- ✅ Button "Approve": Gắn `handleApproveResults(examId)`
- ✅ Button "Reject": Gắn `handleRejectResults(examId, reason)`
- ✅ Button "Download": Gắn `handleDownloadReport(reportId)` (cho approved exams)

#### 5. **Reports Page** (`reports/page.tsx`)
- ✅ Button "Generate Report": Gắn `handleGenerateReport("grading_summary")`
- ✅ Button "Download" (trong Available Reports): Gắn `handleExportReport(reportId, format)`
- ✅ Button "Download" (trong Recent Downloads): Gắn `handleExportReport(reportId, format)`

#### 6. **Handler Functions** (`handlers.ts`)
```typescript
// Subject CRUD
- handleCreateSubject(data)
- handleUpdateSubject(subjectId, data)
- handleDeleteSubject(subjectId)

// Semester CRUD
- handleCreateSemester(data)
- handleUpdateSemester(semesterId, data)
- handleDeleteSemester(semesterId)
- handleSetCurrentSemester(semesterId)

// Exam CRUD
- handleCreateExam(data)
- handleUpdateExam(examId, data)
- handleDeleteExam(examId)
- handlePublishExam(examId)
- handleCloseExam(examId)

// Results Approval
- handleReviewResultsForApproval(examId)
- handleApproveResults(examId)
- handleRejectResults(examId, reason)
- handleRequestResultsReview(examId)

// Report Generation
- handleGenerateReport(type, filters?)
- handleExportReport(reportId, format)
- handleDownloadReport(reportId)
- handleDeleteReport(reportId)
- handleScheduleReportGeneration(type, schedule, email?)

// System Audit
- handleViewAuditLog(resourceType)
- handleExportAuditLog(resourceType)
```

---

## 📋 Chức Năng Của Từng Handler

Tất cả handler đều có:

1. **Console Logging**: In ra thông tin của action để debug
```typescript
console.log("Action description", { parameters })
```

2. **Simulated API Delay**: Mô phỏng delay của API call (600-1200ms)
```typescript
await new Promise((resolve) => setTimeout(resolve, 800));
```

3. **Toast Notifications**: Hiển thị thông báo cho user
```typescript
toast.success("Success message");
toast.error("Error message");
```

4. **TODO Comments**: Chứa example API endpoint để tích hợp sau
```typescript
// TODO: Replace with actual API call
// const response = await fetch("/api/endpoint", {
//   method: "POST",
//   body: JSON.stringify(data),
// });
```

5. **Error Handling**: Try-catch block để xử lý lỗi
```typescript
try {
  // action
} catch (error) {
  console.error("Error:", error);
  toast.error("Error message");
}
```

---

## 🔄 Cách Sử Dụng API Thực Tế

Khi bạn sẵn sàng integrate với API thực tế, chỉ cần:

1. Thay thế `setTimeout` bằng actual API call
2. Thay thế toast notification bằng logic của bạn
3. Thêm error handling cho từng case API error
4. Refetch data sau khi API call thành công

**Example:**
```typescript
export async function handleDeleteSubject(subjectId: string): Promise<void> {
  try {
    console.log("Deleting subject:", subjectId);

    const response = await fetch(`/api/admin/subjects/${subjectId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete subject");
    }

    toast.success("Subject deleted successfully");
    // Refetch subjects list
  } catch (error) {
    console.error("Error deleting subject:", error);
    toast.error("Failed to delete subject");
  }
}
```

---

## 📁 File Đã Chỉnh Sửa

### Pages (Client Components)
- ✅ `src/app/(main)/manager/assignment/page.tsx` - Gắn handler cho assignment
- ✅ `src/app/(main)/manager/violations/page.tsx` - Gắn handler cho violations
- ✅ `src/app/(main)/moderator/complaints/page.tsx` - Gắn handler cho complaints
- ✅ `src/app/(main)/moderator/verification/page.tsx` - Gắn handler cho verification
- ✅ `src/app/(main)/admin/system/subjects/page.tsx` - Gắn handler cho subjects
- ✅ `src/app/(main)/admin/system/semesters/page.tsx` - Gắn handler cho semesters
- ✅ `src/app/(main)/admin/system/exams/page.tsx` - Gắn handler cho exams
- ✅ `src/app/(main)/admin/approval/page.tsx` - Gắn handler cho approval
- ✅ `src/app/(main)/admin/reports/page.tsx` - Gắn handler cho reports

### Components
- ✅ `src/app/(main)/manager/assignment/_components/assign-examiner-modal.tsx` - Gắn handler cho modal assign

### Handler Files
- ✅ `src/app/(main)/manager/handlers.ts` - 7 handler functions
- ✅ `src/app/(main)/moderator/handlers.ts` - 12 handler functions
- ✅ `src/app/(main)/admin/handlers.ts` - 24 handler functions

---

## 🎯 Status

✅ **Hoàn thành**: Tất cả handler đã được tích hợp vào UI
✅ **Tested**: Tất cả pages compile mà không có lỗi  
✅ **Ready**: Sẵn sàng để tích hợp API thực tế

Người dùng giờ có thể:
- Click các button và sẽ thấy console log + toast notification
- Hiểu được flow của application
- Dễ dàng replace mock handler bằng actual API calls
