"use client";

import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import Image from "next/image";
import Logo from "@/public/logo.png";
import Spinner from "@/components/WhiteSpinner";


export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Redirect upon session change
  useEffect(() => {
    if (status === "authenticated" && session) {
      // assume session.user.role is set in your NextAuth JWT callback
      const role = (session.user as any).role as string;
      redirectToRole(role);
    }
  }, [status, session, router]);

  // Auto-dismiss error after 5s
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const redirectToRole = (role: string) => {
    switch (role) {
      case "admin":
        router.push("/admin");
        break;
      case "client manager":
        router.push("/client-manager/orders");
        break;
      case "head of tailoring":
        router.push("/head-of-tailoring");
        break;
      default:
        setError("Invalid role detected. Please contact support.");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password");
    } else {
      setSuccess(true);
    }
  };

  if (status === "loading") {
    return <div className="flex space-x-2 items-center justify-center w-full h-screen">
      <Spinner />
    </div>
  }

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

      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-row space-x-2 items-center mb-5">
          <div className="w-7 h-7">
            <Image src={Logo} width={300} height={300} alt="Logo" className="w-full h-full" />
          </div>
          <div className="font-bold text-lg">Hildam Couture</div>
        </div>

        {/* Title */}
        <div className="text-3xl font-bold mb-2">Sign In</div>
        <div className="text-gray-700 mb-8">Please enter your email and password</div>

        {/* Email Input */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Please enter your email"
            className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Password Input */}
        <div className="mb-4 relative">
          <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
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
            {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-orange-500 text-white font-bold py-3 rounded ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-orange-600"} transition-all duration-300`}
        >
          {loading ? <div className="flex space-x-2 justify-center items-center">
            <span className="me-2">Logging in...</span>
            <Spinner />
          </div> : "Login"}
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
