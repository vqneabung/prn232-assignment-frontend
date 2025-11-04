# Authentication Flow Guide

## Tổng Quan

Hệ thống authentication được xây dựng với 2 lớp (tạm thời):

1. **Client-side**: Zustand store + localStorage
2. **Server-side**: Next.js Middleware (check cookie)

## Cách Hoạt Động

### 1. Login

```typescript
import { setAuth } from "@/lib/auth-utils";

// Khi login thành công, lưu email
setAuth(userEmail);
// → Zustand store update
// → AppProvider auto set cookie (auth_email)
```

- Email được lưu vào Zustand store
- AppProvider subscribe auth store → tự động set cookie
- Middleware check cookie để verify protected routes

### 2. Protected Routes

```typescript
// middleware.ts sẽ check auth_email cookie
// Nếu không có cookie → redirect /auth/login
// Nếu có → allow request
```

Protected routes: `/dashboard`, `/user`

### 3. Logout

```typescript
import { clearAuth } from "@/lib/auth-utils";

// Logout
clearAuth();
// → Zustand store update
// → AppProvider auto clear cookie
router.push("/auth/login");
```

## File Structure

```
src/
├── middleware.ts                    # Server middleware - check auth_email cookie
├── lib/
│   └── auth-utils.ts               # Helper functions (setAuth, clearAuth, etc)
├── hooks/
│   └── use-auth.ts                 # Client hook to check auth
├── components/
│   ├── app-provider.tsx            # Subscribe auth store → set/clear cookie
│   └── protected-route.tsx         # Wrapper for protected pages
└── stores/
    └── auth/
        └── authStore.ts            # Zustand auth store
```

## Flow Diagram

```
Login Flow:
user click login
  ↓
setAuth(email)
  ↓
Zustand store update
  ↓
AppProvider subscribe → set cookie (auth_email)
  ↓
Can access /dashboard, /user

Logout Flow:
user click logout
  ↓
clearAuth()
  ↓
Zustand store update
  ↓
AppProvider subscribe → clear cookie
  ↓
Middleware detect no cookie → redirect /auth/login
```

## Usage Examples

### Check Authentication Status

```typescript
"use client";
import { useAuth } from "@/hooks/use-auth";

export function Dashboard() {
  const { isLoading, isAuthenticated, email } = useAuth();

  if (isLoading) return <Loading />;
  if (!isAuthenticated) return null; // Redirect by hook

  return <div>Welcome {email}</div>;
}
```

### Set Auth (Login)

```typescript
import { setAuth } from "@/lib/auth-utils";

// When login successful
await loginAPI();
setAuth("user@example.com");
router.push("/dashboard");
```

### Clear Auth (Logout)

```typescript
import { clearAuth } from "@/lib/auth-utils";

clearAuth();
router.push("/auth/login");
```

### Utility Functions

```typescript
import {
  setAuth, // Set email + localStorage
  clearAuth, // Clear email + localStorage
  isAuthenticated, // Check if authenticated
  getCurrentEmail, // Get current email
  restoreAuth, // Restore from localStorage
} from "@/lib/auth-utils";

// Check auth
if (isAuthenticated()) {
  console.log("User email:", getCurrentEmail());
}
```

## Migration to JWT

Trong tương lai, để migrate sang JWT:

### Step 1: Backend

- Return JWT token khi login thành công
- Token contain: `{ email, role, exp, ... }`

### Step 2: Frontend - Update setAuth

```typescript
// src/lib/auth-utils.ts
export function setAuth(token: string) {
  // Lưu token vào cookie (không HttpOnly để có thể decode)
  document.cookie = `token=${token}; path=/; SameSite=Lax`;

  // Decode token lấy email
  const decoded = jwtDecode(token);
  authStore.setState({ email: decoded.email });
  localStorage.setItem("token", token);
}
```

### Step 3: Update Middleware

```typescript
// src/middleware.ts
import { jwtDecode } from "jwt-decode";

try {
  const token = request.cookies.get("token")?.value;
  if (!token) throw new Error("No token");

  const decoded = jwtDecode(token);
  if (!decoded.email) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  return NextResponse.next();
} catch (error) {
  return NextResponse.redirect(new URL("/auth/login", request.url));
}
```

**Note**: Component code không cần thay đổi! useAuth hook sẽ auto work.

## Current Architecture

### Temporary (Current)

```
localStorage (auth_email)
    ↓
AppProvider (restore + subscribe)
    ↓
Zustand store (email)
    ↓
Cookie (auth_email) ← Middleware check this
    ↓
Protected Routes
```

### Future (JWT)

```
localStorage (token)
    ↓
AppProvider (restore + decode)
    ↓
Zustand store (email)
    ↓
Cookie (token) ← Middleware decode this
    ↓
Protected Routes
```

## Pages

- **Home**: `/` - Public
- **Login**: `/auth/login` - Public
- **Register**: `/auth/register` - Public
- **Dashboard**: `/dashboard` - Protected
- **User**: `/user` - Protected
- **Unauthorized**: `/unauthorized` - Error page (401)

## Middleware Flow (Current)

```
Request → Middleware
  ├─ Is protected route? (/dashboard, /user)
  │   ├─ No → Allow
  │   └─ Yes:
  │       ├─ Has auth_email cookie?
  │       │   ├─ No → Redirect /auth/login
  │       │   └─ Yes → Allow + set x-user-email header
```

## Security Notes

- ⚠️ **Temporary**: Email stored in localStorage (not secure for sensitive data)
- ⚠️ **Temporary**: Cookie is not HttpOnly (can be accessed by JS)
- ✅ **Future**: JWT token will be HttpOnly cookie (only sent to server)
- ✅ **Future**: Token includes expiration (exp claim)
- ✅ **Future**: Token is signed/verified by backend

## Testing

### Login

```bash
# Set auth in browser console
localStorage.setItem('auth_email', 'test@example.com');
// Refresh page → AppProvider will set cookie → can access /dashboard
```

### Logout

```bash
# Clear auth in browser console
localStorage.removeItem('auth_email');
// Refresh page → cookie cleared → redirect to /auth/login
```
