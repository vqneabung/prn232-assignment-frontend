export interface BaseResponse {
  success: boolean;
  message?: string;
  errors: string[] | null;
  data?: any;
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
