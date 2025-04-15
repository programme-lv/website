import { User } from "@/types/proglv";

import { ApiResponse } from "./api-response";
import { API_HOST } from "./config";
import { getJwt } from "./jwt";

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
): Promise<ApiResponse<string>> => {
  const username = input.username;
  const password = input.password;
  const response = await fetch(`${API_HOST}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  return response.json();
};

export const getUserRole = async (): Promise<
  ApiResponse<"guest" | "user" | "admin">
> => {
  const jwt = getJwt()
  const response = await fetch(`${API_HOST}/role`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${jwt}`,
    },
  });

  return response.json();
};
