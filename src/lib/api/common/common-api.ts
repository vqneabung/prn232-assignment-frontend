import { BaseResponse } from "@/types/type";

export const headers: HeadersInit = {
  "Content-Type": "application/json",
};

export const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function commonApiFetch(
  url: string,
  method: string,
  body?: any,
  headersOverride?: HeadersInit,
): Promise<BaseResponse> {
  // Don't set Content-Type header if body is FormData
  // Browser will automatically set it with proper boundary
  const finalHeaders = body instanceof FormData ? headersOverride : { ...headers, ...headersOverride };

  const response = await fetch(baseURL + url, {
    method,
    headers: finalHeaders,
    body: body ? (body instanceof FormData ? body : JSON.stringify(body)) : null,
  });

  if (!response.ok || response.status < 200 || response.status >= 300) {
    return {
      success: false,
      message: `HTTP error! status: ${response.status}`,
      errors: null,
      data: await response.json(),
    } as BaseResponse;
  }

  const data = await response.json();

  return {
    success: true,
    message: "Request successful",
    errors: null,
    data,
  } as BaseResponse;
}

export async function commonApiGet(url: string): Promise<BaseResponse> {
  return commonApiFetch(url, "GET");
}

export async function commonApiPost(url: string, body?: any, headersOverride?: HeadersInit): Promise<BaseResponse> {
  return commonApiFetch(url, "POST", body, headersOverride);
}

export async function commonApiPut(url: string, body?: any, headersOverride?: HeadersInit): Promise<BaseResponse> {
  return commonApiFetch(url, "PUT", body, headersOverride);
}

export async function commonApiDelete(url: string): Promise<BaseResponse> {
  return commonApiFetch(url, "DELETE");
}
