import { BaseResponse } from "@/types/type";

export const headers: HeadersInit = {
  "Content-Type": "application/json",
};

export async function commonFetch<T = unknown>(
  url: string,
  method: string,
  body?: Record<string, unknown> | FormData,
  headersOverride?: HeadersInit,
): Promise<BaseResponse<T>> {
  // Don't set Content-Type header if body is FormData
  // Browser will automatically set it with proper boundary
  const finalHeaders = body instanceof FormData ? headersOverride : { ...headers, ...headersOverride };

  const response = await fetch(url, {
    method,
    headers: finalHeaders,
    body: body ? (body instanceof FormData ? body : JSON.stringify(body)) : null,
  });

  if (!response.ok || response.status < 200 || response.status >= 300) {
    return {
      success: false,
      message: `HTTP error! status: ${response.status}`,
      errors: null,
      data: null,
    } as BaseResponse<T>;
  }

  const data = await response.json();

  return {
    success: true,
    message: "Request successful",
    errors: null,
    data,
  } as BaseResponse<T>;
}

export async function commonGet<T = unknown>(url: string): Promise<BaseResponse<T>> {
  return commonFetch<T>(url, "GET");
}

export async function commonPost<T = unknown>(url: string, body?: Record<string, unknown> | FormData, headersOverride?: HeadersInit): Promise<BaseResponse<T>> {
  return commonFetch<T>(url, "POST", body, headersOverride);
}

export async function commonPut<T = unknown>(url: string, body?: Record<string, unknown> | FormData, headersOverride?: HeadersInit): Promise<BaseResponse<T>> {
  return commonFetch<T>(url, "PUT", body, headersOverride);
}

export async function commonDelete<T = unknown>(url: string): Promise<BaseResponse<T>> {
  return commonFetch<T>(url, "DELETE");
}
