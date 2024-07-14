import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { registerUser } from '@/api/auth';
import AuthCardWithBG from "@/components/AuthCardWithBG/AuthCardWithBG";

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const mutation = useMutation(registerUser, {
    onSuccess: (data) => {
      console.log('User registered:', data);
    },
    onError: (error) => {
      console.error('Error registering user:', error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ username, email, password });
  };

  return (
    <AuthCardWithBG type="register">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit">Register</button>
      </form>
    </AuthCardWithBG>
  );
}
