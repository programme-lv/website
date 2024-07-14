const API_HOST = 'https://0f6de9e9w5.execute-api.eu-central-1.amazonaws.com';

type RegisterUserInput = {
  username: string;
  email: string;
  password: string;
  firstname: string;
  lastname: string;
};

const setCookie = (name:any, value:any) => {
  document.cookie = name + '=' + encodeURIComponent(value) + '; path=/';
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
  setCookie('jwt', data.token); // Store token in cookie without explicit expiration
  return data;
};

export const loginUser = async (username: string, password: string) => {
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
  setCookie('jwt', data.token); // Store token in cookie without explicit expiration
  return data;
};
