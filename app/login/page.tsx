"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Image from "next/image";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
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

  // Auto-dismiss error message after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 5000);

      return () => clearTimeout(timer); // Clear timer on component unmount or when error changes
    }
  }, [error]);

  const redirectToRole = (role: string) => {
    switch (role) {
      case "admin":
        router.push("/admin");
        break;
      case "customer":
        router.push("/client/orders");
        break;
      case "project manager":
        router.push("/projectmanager/joblists/projects");
        break;
      case "store manager":
        router.push("/storemanager/inventory/list");
        break;
      case "client manager":
        router.push("/client-manager/orders");
        break;
      case "head of tailoring":
        router.push("/headoftailoring/joblists/tailorjoblists");
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
      const response = await fetch("https://hildam.insightpublicis.com/api/login", {
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

        // Show success notification
        setSuccess(true);

        // Redirect after a brief delay for the notification to display
        setTimeout(() => {
          redirectToRole(decodedToken.role);
        }, 500);
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-black w-full px-5 lg:px-40">
      {/* Success Notification */}
      {success && (
        <div className="fixed top-5 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg text-center animate-fade-in">
          Login successful!
        </div>
      )}

      {/* Error Notification */}
      {error && (
        <div className="fixed top-5 z-50 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg text-center animate-fade-in">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex flex-row space-x-2 items-center mb-5">
          <div className="w-7 h-7">
            <Image
              src={"/logo.png"}
              width={300}
              height={300}
              alt="Logo"
              className="w-full h-full"
            />
          </div>
          <div className="font-bold text-lg">Hildam Couture</div>
        </div>

        {/* Title */}
        <div className="text-3xl font-bold mb-2">Sign In</div>
        <div className="text-gray-700 mb-8">
          Please enter your email and password
        </div>

        {/* Email Input */}
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
            className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Password Input */}
        <div className="mb-4 relative">
          <label className="block text-gray-700 mb-2" htmlFor="password">
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Please enter your password"
            className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-11 text-gray-500"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-orange-500 text-white font-bold py-3 rounded ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-orange-600"
          } transition-all duration-300`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {/* Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
