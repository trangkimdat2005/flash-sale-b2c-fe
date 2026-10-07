export type UserStatus = "ACTIVE" | "LOCKED" | "SUSPENDED";

export interface UserResponse {
  id: number;
  email: string;
  fullName: string;
  phone: string | null;
  avatarUrl: string | null;
  status: UserStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: "Bearer";
  expiresIn: number;
  user: UserResponse;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  role?: "BUYER" | "SELLER";
}

export interface RefreshTokenRequest {
  refreshToken: string;
}