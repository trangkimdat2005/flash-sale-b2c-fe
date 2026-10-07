import type { ApiResponse } from "@/types";

export class ApiError extends Error {
  status: number;
  body: ApiResponse<unknown> | null;

  constructor(
    status: number,
    message: string,
    body: ApiResponse<unknown> | null
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}