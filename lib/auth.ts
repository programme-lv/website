import { setJwt } from "./jwt";

const API_HOST = 'https://0f6de9e9w5.execute-api.eu-central-1.amazonaws.com';

type RegisterUserInput = {
  username: string;
  email: string;
  password: string;
  firstname: string;
  lastname: string;
};


export const registerUser = async (input: RegisterUserInput) => {
  const response = await fetch(`${API_HOST}/users/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();
  setJwt(data.token); // Store token in cookie without explicit expiration
  return data;
};

type LoginUserInput = {
  username: string;
  password: string;
};

export const loginUser = async (input: LoginUserInput) => {
  let username = input.username;
  let password = input.password;
  const response = await fetch(`${API_HOST}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();
  setJwt(data.token); // Store token in cookie without explicit expiration
  return data;
};

