export interface BaseResponse<T = unknown> {
  success: boolean;
  message?: string;
  errors: string[] | null;
  data?: T;
}

export type Auth = {
  userName: string;
  token?: string;
  role?: string;
  setUserName: (userName: string) => void;
  setToken: (token: string) => void;
  setRole: (role: string) => void;
  logout: () => void;
};

// Backend DTO Types
export interface RuleResponse {
  ruleId: number;
  name: string;
  pattern: string;
  severity?: string;
  description?: string;
  [key: string]: unknown;
}

export interface RuleRequest {
  name: string;
  pattern: string;
  severity?: string;
  description?: string;
  [key: string]: unknown;
}

export interface StudentResponse {
  studentId: number;
  studentCode: string;
  fullName?: string;
  email?: string;
  submissionCount: number;
  [key: string]: unknown;
}

export interface StudentRequest {
  studentCode: string;
  fullName?: string;
  email?: string;
  [key: string]: unknown;
}

export interface ClassResponse {
  classId: number;
  className: string;
  semester: string;
  lecturer?: number;
  examiner?: number;
  lecturerName?: string;
  examinerName?: string;
  studentCount: number;
  students?: StudentResponse[];
  [key: string]: unknown;
}

export interface ClassRequest {
  className: string;
  semester: string;
  lecturer?: number;
  examiner?: number;
  [key: string]: unknown;
}

export interface SubjectResponse {
  subjectId: number;
  name: string;
  code: string;
  credits: number;
  description?: string;
  [key: string]: unknown;
}

export interface SubjectRequest {
  name: string;
  code: string;
  credits: number;
  description?: string;
  [key: string]: unknown;
}

export interface AuthResponse {
  token: string;
  userName: string;
  role: string;
  userId: number;
  expiresAt: string;
  [key: string]: unknown;
}

export interface LoginRequest {
  userName: string;
  password: string;
  [key: string]: unknown;
}

export interface RegisterRequest {
  userName: string;
  password: string;
  roleId: number;
  [key: string]: unknown;
}

export interface StudentImportResult {
  totalRows: number;
  successfulImports: number;
  updatedStudents: number;
  newStudents: number;
  newClasses: number;
  existingClasses: number;
  errors: string[];
  importedStudents: ImportedStudentInfo[];
  importedClasses: ImportedClassInfo[];
  [key: string]: unknown;
}

export interface ImportedStudentInfo {
  studentCode: string;
  fullName?: string;
  email?: string;
  action: string;
  assignedClasses: string[];
  [key: string]: unknown;
}

export interface ImportedClassInfo {
  className: string;
  semester: string;
  action: string;
  studentsCount: number;
  [key: string]: unknown;
}
