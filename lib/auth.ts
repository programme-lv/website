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

