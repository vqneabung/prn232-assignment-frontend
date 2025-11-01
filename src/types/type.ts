export interface BaseResponse {
  success: boolean;
  message?: string;
  errors: string[] | null;
  data?: any;
}

export type Auth = {
  email: string;
  setEmail: (email: string) => void;
};
