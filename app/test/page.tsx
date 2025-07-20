"use client"

// pages/login.tsx
import { useState, FormEvent } from 'react';

interface LoginResponse {
  token?: string;
  message?: string;
  [key: string]: any;
}

export default function LoginPage() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const res = await fetch('https://api.hildamcouture.com/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('res from server', res)

      const data: LoginResponse = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      setMessage('Login successful!');
      console.log('Response:', data);
      // Optional: Save token to localStorage/cookies here
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-4">Login</h2>

        {error && <p className="text-red-500 mb-2">{error}</p>}
        {message && <p className="text-green-500 mb-2">{message}</p>}

        <label className="block mb-2">
          <span className="text-gray-700">Email</span>
          <input
            type="email"
            className="mt-1 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label className="block mb-4">
          <span className="text-gray-700">Password</span>
          <input
            type="password"
            className="mt-1 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
}
