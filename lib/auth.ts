const API_HOST = "https://api.programme.lv";

type RegisterUserInput = {
  username: string;
  email: string;
  password: string;
  firstname: string;
  lastname: string;
};

export const registerUser = async (input: RegisterUserInput) => {
  const response = await fetch(`${API_HOST}/users`, {
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
