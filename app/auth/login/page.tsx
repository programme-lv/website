import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { loginUser } from '@/api/auth';
import AuthCardWithBG from "@/components/AuthCardWithBG/AuthCardWithBG";

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const mutation = useMutation(loginUser, {
    onSuccess: (data) => {
      console.log('User logged in:', data);
      localStorage.setItem('token', data.token);
    },
    onError: (error) => {
      console.error('Error logging in:', error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ username, password });
  };

  return (
    <AuthCardWithBG type="login">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit">Login</button>
      </form>
    </AuthCardWithBG>
  );
}
