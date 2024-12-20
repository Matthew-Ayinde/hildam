"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {jwtDecode} from "jwt-decode";
import Image from "next/image";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Redirect to role-specific route if already authenticated
  useEffect(() => {
    const token = sessionStorage.getItem("access_token");
    if (token) {
      const decodedToken = jwtDecode<{ role: string }>(token);
      redirectToRole(decodedToken.role);
    }
  }, [router]);

  const redirectToRole = (role: string) => {
    switch (role) {
      case "admin":
        router.push("/admin");
        break;
      case "customer":
        router.push("/client/orders/list");
        break;
      case "project manager":
        router.push("/projectManager/customers/list");
        break;
      default:
        setError("Invalid role detected. Please contact support.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed. Please try again.");
      } else {
        sessionStorage.setItem("access_token", data.access_token);

        const decodedToken = jwtDecode<{ role: string }>(data.access_token);
        redirectToRole(decodedToken.role);
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }

    // Clear error after 5 seconds
    if (error) {
      setTimeout(() => setError(""), 5000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen dark:text-black bg-gray-100 text-black w-full px-40">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full"
      >
        <div className="flex flex-row space-x-2 items-center mb-5">
          <div className="w-7 h-7">
            <Image src={'/logo.png'} width={300} height={300} alt="Logo" className="w-full h-full"/>
          </div>
          <div className="font-bold">Hildam Couture</div>
        </div>
        <div className="text-3xl font-bold">Sign In</div>
        <div className="text-gray-700 my-8">Please enter your email and password</div>
        <div className="flex items-center justify-center">
          {error && (
            <p className="text-white py-1 px-3 text-sm rounded-lg max-w-96 items-center flex justify-center bg-red-500 mb-4">
              {error}
            </p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Please enter your email"
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            placeholder="Please enter your password"
            onChange={(e) => setPassword(e.target.value)}
            minLength={5}
            required
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-orange-500 text-black py-2 rounded ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-orange-600"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
