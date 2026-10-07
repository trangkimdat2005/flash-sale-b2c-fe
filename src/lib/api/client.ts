import { API_BASE_URL } from "./endpoints";
import type { ApiResponse } from "@/types";
import { ApiError } from "./errors";

/**
 * Lấy token từ localStorage. Được dùng bởi fetch wrapper.
 * Không thể dùng Zustand store ở đây vì store là React-side.
 */
function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("fs_access_token");
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  /** Bỏ qua Content-Type để upload file (multipart sẽ tự set boundary). */
  isFormData?: boolean;
  /** Không gắn Authorization (vd: login, register). */
  skipAuth?: boolean;
  /** Override base URL (vd: gọi endpoint ngoài /api/v1). */
  baseUrl?: string;
  /** Gửi Idempotency-Key cho POST (xem flash-sale reservations). */
  idempotencyKey?: string;
  /** Thời gian retry khi lỗi mạng. */
  retries?: number;
  /** Delay giữa các retry (ms). */
  retryDelay?: number;
}

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function apiFetch<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const {
    body,
    isFormData,
    skipAuth,
    baseUrl,
    idempotencyKey,
    retries = 1,
    retryDelay = 400,
    headers,
    ...rest
  } = options;

  const url = `${baseUrl ?? API_BASE_URL}${path}`;

  const finalHeaders = new Headers(headers ?? {});
  if (!skipAuth) {
    const token = getAccessToken();
    if (token) finalHeaders.set("Authorization", `Bearer ${token}`);
  }
  if (idempotencyKey) {
    finalHeaders.set("Idempotency-Key", idempotencyKey);
  }

  let payload: BodyInit | undefined;
  if (body !== undefined && body !== null) {
    if (isFormData || body instanceof FormData) {
      payload = body as FormData;
    } else {
      finalHeaders.set("Content-Type", "application/json");
      payload = JSON.stringify(body);
    }
  }

  let attempt = 0;
  let lastError: unknown;
  while (attempt <= retries) {
    try {
      const res = await fetch(url, {
        ...rest,
        headers: finalHeaders,
        body: payload,
        // Không cache mặc định cho dữ liệu nghiệp vụ (auth, cart, order...).
        cache: rest.cache ?? "no-store",
      });

      // 401 → throw để AuthProvider xử lý (refresh-token / logout).
      if (res.status === 401) {
        const errBody = await res.json().catch(() => null);
        throw new ApiError(401, errBody?.message ?? "Chưa xác thực", errBody);
      }

      const json: ApiResponse<T> = await res.json();
      if (!json.success || json.code >= 400) {
        throw new ApiError(
          json.code,
          json.message ?? "Lỗi không xác định",
          json
        );
      }
      return json.data as T;
    } catch (err) {
      lastError = err;
      attempt++;
      if (attempt > retries) break;
      await sleep(retryDelay * attempt);
    }
  }
  throw lastError;
}