"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/public/logo.png";
import Spinner from "@/components/WhiteSpinner";
import { HiMail } from "react-icons/hi";
import { ApplicationRoutes } from "@/constants/ApplicationRoutes";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // auto-dismiss notifications
  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage("");
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      // TODO: call API to send reset link
      await new Promise((res) => setTimeout(res, 1500));
      setMessage("If this email is registered, a reset link has been sent.");
    } catch (err) {
      setError("Failed to send reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full items-center justify-center min-h-screen bg-gray-100 dar:bg-gray-800 text-black dar:text-white px-5 lg:px-40">
      {/* Notifications */}
      {message && (
        <div className="fixed top-5 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in">
          {message}
        </div>
      )}
      {error && (
        <div className="fixed top-5 z-50 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white dar:bg-gray-700 max-w-lg p-8 rounded-2xl shadow-xl w-full mx-auto space-y-6"
      >
        {/* Logo */}
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="w-8 h-8">
            <Image src={Logo} alt="Logo" width={300} height={300} className="w-full h-full" />
          </div>
          <span className="text-2xl font-extrabold text-gray-900 dar:text-gray-100">
            Hildam Couture
          </span>
        </div>

        {/* Heading */}
        <div className="text-center space-y-1">
          <h2 className="text-3xl font-bold text-gray-900 dar:text-gray-100">
            Forgot Password
          </h2>
          <p className="text-sm text-gray-500 dar:text-gray-400">
            Enter your email to receive a reset link
          </p>
        </div>

        {/* Email Input */}
        <div className="relative">
          <label htmlFor="email" className="sr-only">
            Email
          </label>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <HiMail className="text-gray-400 dar:text-gray-500" size={20} />
          </div>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Email address"
            className="w-full pl-10 pr-4 py-3 bg-gray-100 dar:bg-gray-700 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full flex justify-center items-center py-3 font-semibold rounded-lg shadow-md
            ${
              loading
                ? "bg-orange-300 text-white cursor-not-allowed opacity-60"
                : "bg-orange-500 text-white hover:bg-orange-600 focus:ring-2 focus:ring-orange-400 transition"
            }`}
        >
          {loading ? <Spinner /> : "Send Reset Link"}
        </button>

        {/* Back to Login */}
        <div className="text-center">
          <Link href={ApplicationRoutes.Login} className="text-sm text-orange-500 hover:underline">
            Remembered your password? Sign In
          </Link>
        </div>
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
