import { User } from "@/types/proglv";

import { ApiResponse } from "./api-response";
import { API_HOST } from "./config";

type RegisterUserInput = {
  username: string;
  email: string;
  password: string;
  firstname: string;
  lastname: string;
};

export const registerUser = async (
  input: RegisterUserInput
): Promise<ApiResponse<User>> => {
  const response = await fetch(`${API_HOST}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(input),
  });

  return response.json();
};

type LoginUserInput = {
  username: string;
  password: string;
};

export const loginUser = async (
  input: LoginUserInput
): Promise<ApiResponse<User>> => {
  const username = input.username;
  const password = input.password;
  const response = await fetch(`${API_HOST}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ username, password }),
  });

  return response.json();
};

export const logoutUser = async (): Promise<ApiResponse<User>> => {
  const response = await fetch(`${API_HOST}/logout`, {
    method: "POST",
    credentials: "include",
  });

  const text = await response.text();
  if (!text.trim()) {
    return response.ok
      ? { status: "success", data: {} as User }
      : {
          status: "error",
          data: null,
          code: "http_error",
          message: `HTTP ${response.status}`,
        };
  }
  try {
    return JSON.parse(text) as ApiResponse<User>;
  } catch {
    return {
      status: "error",
      data: null,
      code: "parse_error",
      message: "Invalid response from server",
    };
  }
};

type MessageData = { message: string };

export const requestPasswordReset = async (
  login: string
): Promise<ApiResponse<MessageData>> => {
  const response = await fetch(`${API_HOST}/password-reset/request`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ login }),
  });
  return response.json();
};

export const confirmPasswordReset = async (
  token: string,
  password: string
): Promise<ApiResponse<MessageData>> => {
  const response = await fetch(`${API_HOST}/password-reset/confirm`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ token, password }),
  });
  return response.json();
};

export const requestEmailVerification = async (): Promise<
  ApiResponse<MessageData>
> => {
  const response = await fetch(`${API_HOST}/email-verification/request`, {
    method: "POST",
    credentials: "include",
  });
  return response.json();
};

export const confirmEmailVerification = async (
  token: string
): Promise<ApiResponse<MessageData>> => {
  const response = await fetch(`${API_HOST}/email-verification/confirm`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ token }),
  });
  return response.json();
};

type UpdateProfileInput = {
  firstname: string;
  lastname: string;
};

export const updateProfile = async (
  input: UpdateProfileInput
): Promise<ApiResponse<User>> => {
  const response = await fetch(`${API_HOST}/users/me`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(input),
  });
  return response.json();
};

type ChangePasswordInput = {
  current_password: string;
  password: string;
};

export const changePassword = async (
  input: ChangePasswordInput
): Promise<ApiResponse<MessageData>> => {
  const response = await fetch(`${API_HOST}/password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(input),
  });
  return parseMaybeEmptyResponse(response, { message: "parole nomainīta" });
};

async function parseMaybeEmptyResponse<T>(
  response: Response,
  emptySuccess: T
): Promise<ApiResponse<T>> {
  const text = await response.text();
  if (!text.trim()) {
    return response.ok
      ? { status: "success", data: emptySuccess }
      : {
          status: "error",
          data: null,
          code: "http_error",
          message: `HTTP ${response.status}`,
        };
  }
  try {
    return JSON.parse(text) as ApiResponse<T>;
  } catch {
    return {
      status: "error",
      data: null,
      code: "parse_error",
      message: "Invalid response from server",
    };
  }
}

