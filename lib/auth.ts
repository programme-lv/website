const API_HOST = "https://0f6de9e9w5.execute-api.eu-central-1.amazonaws.com";

type RegisterUserInput = {
  username: string;
  email: string;
  password: string;
  firstname: string;
  lastname: string;
};

export const registerUser = async (input: RegisterUserInput) => {
  const response = await fetch(`${API_HOST}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  return response;
};

type LoginUserInput = {
  username: string;
  password: string;
};

export const loginUser = async (input: LoginUserInput) => {
  let username = input.username;
  let password = input.password;
  const response = await fetch(`${API_HOST}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  return response;
};
