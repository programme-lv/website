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
  input: RegisterUserInput,
): Promise<ApiResponse<User>> => {
  const response = await fetch(`${API_HOST}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  return response.json();
};

type LoginUserInput = {
  username: string;
  password: string;
};

export const loginUser = async (
  input: LoginUserInput,
): Promise<ApiResponse<string>> => {
  const username = input.username;
  const password = input.password;
  const response = await fetch(`${API_HOST}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  return response.json();
};
