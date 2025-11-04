# 🧪 Testing Guide - Button Handlers

## Cách Kiểm Tra Các Handler

### 1. **Manager - Assignment Page**

```
URL: /manager/assignment

Steps:
1. Chọn một exam từ dropdown
2. Check vài submissions từ table
3. Click "Assign Examiners (n)" button
4. Modal sẽ mở ra, chọn examiners
5. Click "Assign Examiners" button
   → Sẽ thấy console log + toast notification success
```

### 2. **Manager - Violations Page**

```
URL: /manager/violations

Steps:
1. Bảng violations sẽ hiển thị các violations
2. Click "Review" button trên 1 violation
   → Console log: "Opening violation review for: VIO-XXX"
   → Toast: "Opening violation details..."
3. Click "Resolve" button
   → Console log: "Resolving violation"
   → Toast: "Violation resolved successfully"
```

### 3. **Moderator - Complaints Page**

```
URL: /moderator/complaints

Steps:
1. Bảng complaints sẽ hiển thị các complaints
2. Click "Review" button
   → Console log: "Opening complaint review for: C-XXX"
3. Click trash icon để delete
   → Console log: "Deleting complaint: C-XXX"
   → Toast: "Complaint deleted"
```

### 4. **Moderator - Verification Page**

```
URL: /moderator/verification

Steps:
1. Bảng submissions sẽ hiển thị các zero-point cases
2. Chỉ status="pending" mới có "Verify" và "Remark" buttons
3. Click "Review" button
   → Console log: "Opening zero-point review for: ZPV-XXX"
4. Click "Verify" button (nếu pending)
   → Console log: "Verifying zero-point submission: ZPV-XXX"
   → Toast: "Zero-point submission verified"
5. Click "Remark" button (nếu pending)
   → Console log: "Requesting remark for: ZPV-XXX"
   → Toast: "Remark request sent to examiner"
```

### 5. **Admin - Subjects Page**

```
URL: /admin/system/subjects

Steps:
1. Bảng subjects sẽ hiển thị
2. Click delete button (trash icon) bên phải
   → Console log: "Deleting subject: SUBJ-XXX"
   → Toast: "Subject deleted successfully"
```

### 6. **Admin - Semesters Page**

```
URL: /admin/system/semesters

Steps:
1. Bảng semesters sẽ hiển thị
2. Click delete button (trash icon) bên phải
   → Console log: "Deleting semester: SEM-XXX"
   → Toast: "Semester deleted successfully"
```

### 7. **Admin - Exams Page**

```
URL: /admin/system/exams

Steps:
1. Bảng exams sẽ hiển thị
2. Click delete button (trash icon) bên phải
   → Console log: "Deleting exam: EXM-XXX"
   → Toast: "Exam deleted successfully"
```

### 8. **Admin - Approval Page**

```
URL: /admin/approval

Steps:
1. Bảng approvals sẽ hiển thị
2. Chỉ status="pending" mới có "Approve" và "Reject" buttons
3. Click "Approve" button
   → Console log: "Approving results for exam: APP-XXX"
   → Toast: "Results approved and finalized"
4. Click "Reject" button
   → Console log: "Rejecting results"
   → Toast: "Results rejected and returned for review"
5. Sau khi approved, sẽ có button "Download"
   → Console log: "Downloading report: APP-XXX"
   → Toast: "Report downloaded"
```

### 9. **Admin - Reports Page**

```
URL: /admin/reports

Steps:
1. Mục "Report Filters"
   - Chọn Report Type, Semester, Export Format
   - Click "Generate Report"
     → Console log: "Generating report"
     → Toast: "Report generated successfully"

2. Mục "Available Reports"
   - Mỗi card có button "Download"
   - Click download button
     → Console log: "Exporting report"
     → Toast: "Report exported as XLSX"

3. Mục "Recent Downloads"
   - Mỗi download item có button download
   - Click button
     → Console log: "Exporting report"
     → Toast: "Report exported as XLSX"
```

---

## 🔍 Checking Console Logs

1. **Mở Developer Tools**:
   - Press: `F12` hoặc `Ctrl+Shift+I` (Windows/Linux) hoặc `Cmd+Option+I` (Mac)
   - Go to: **Console** tab

2. **Khi click button**:
   - Sẽ thấy log message
   - Example: `"Deleting subject:" "SUBJ-001"`

3. **Toast Notifications**:
   - Sẽ thấy notification ở góc dưới phải của page
   - Success: Xanh lục ✅
   - Error: Đỏ ❌

---

## 📝 Expected Behavior

### Mỗi Handler Sẽ:

1. **Log to Console**

   ```javascript
   console.log("Action description", { params });
   ```

2. **Simulate API Delay**

   ```
   Wait 600-1200ms (tuỳ handler)
   ```

3. **Show Toast Notification**

   ```
   Success: "Action completed successfully"
   Error: "Failed to complete action"
   ```

4. **Close Modal (nếu có)**
   ```
   Modal sẽ tự đóng sau khi action hoàn thành
   ```

---

## 🛠️ Troubleshooting

### Nếu không thấy console log:

- Chắc chắn Developer Tools đã mở
- Chắc chắn Console tab được chọn
- Try refresh page (F5) rồi click button lại

### Nếu không thấy toast notification:

- Chắc chắn bạn click đúng button
- Chắc chắn không có error trong console
- Try scroll down để xem notification ở góc dưới phải

### Nếu page có lỗi:

- Check console for error messages
- Refresh page
- Clear browser cache (Ctrl+Shift+Delete)

---

## 🚀 Next Steps

Khi bạn sẵn sàng integrate API:

1. **Mở file handler** (ví dụ: `admin/handlers.ts`)
2. **Thay thế setTimeout** bằng actual fetch call
3. **Update toast messages** nếu cần
4. **Add error handling** cho API errors
5. **Test lại** tất cả buttons

**Example integration:**

```typescript
// Trước (mock)
export async function handleDeleteSubject(subjectId: string): Promise<void> {
  try {
    console.log("Deleting subject:", subjectId);
    await new Promise((resolve) => setTimeout(resolve, 700)); // Mock delay
    toast.success("Subject deleted successfully");
  } catch (error) {
    console.error("Error deleting subject:", error);
    toast.error("Failed to delete subject");
  }
}

// Sau (real API)
export async function handleDeleteSubject(subjectId: string): Promise<void> {
  try {
    console.log("Deleting subject:", subjectId);
    const response = await fetch(`/api/admin/subjects/${subjectId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete");
    }

    toast.success("Subject deleted successfully");
    // TODO: Refetch subjects list
  } catch (error) {
    console.error("Error deleting subject:", error);
    toast.error("Failed to delete subject");
  }
}
```
