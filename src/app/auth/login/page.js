"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Loader from "@/components/utlis/Loader";
import { useAppDispatch } from "@/redux/hooks";
import { setUserAddress, setUserLogin } from "@/redux/slicers/userSlice";
import { Shield, Lock, AlertCircle, User, Building } from "lucide-react";

const Login = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginType, setLoginType] = useState("user"); // "user" or "company"
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);
    
    try {
      // Different API endpoints for user vs company
      const endpoint = loginType === "user" ? "/api/users/login" : "/api/companies/login";
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        setLoading(false);
        dispatch(setUserLogin(true));
        
        // Store user or company info in redux state
        toast.success("Login successful");
        
        // Redirect to appropriate dashboard
        router.push("/services");
      } else {
        const data = await response.json();
        setError(data.error || "Login failed. Please check your credentials.");
        toast.error('Login failed');
        setLoading(false);
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Login error. Please try again.");
      toast.error("Login failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header with logo */}
      <header className="bg-black py-4">
        <div className="container mx-auto px-6">
          <Link href="/" className="flex items-center">
            <Shield className="h-8 w-8 text-white mr-2" />
            <span className="text-xl font-bold text-white">ChainVault</span>
          </Link>
        </div>
      </header>

      <div className="flex flex-1 flex-col md:flex-row">
        {/* Left Column - Info */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden md:flex md:w-1/2 bg-black text-white p-8 justify-center items-center"
        >
          <div className="max-w-md px-6 py-10 flex flex-col items-center text-center">
            <Shield className="h-16 w-16 mb-6" />
            <h1 className="text-4xl font-bold mb-6">Secure Document Storage</h1>
            <p className="text-xl mb-8">
              Chain Vault provides blockchain-powered security for your most important legal records and documents.
            </p>
            <div className="w-full h-64 flex items-center justify-center mb-8">
              <div className="rounded-full bg-white/10 p-8">
                <Lock className="h-32 w-32 text-white/80" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 w-full">
              <div className="bg-white/10 rounded-lg p-4 text-center">
                <p className="text-sm">Secure Storage</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4 text-center">
                <p className="text-sm">Tamper-Proof</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4 text-center">
                <p className="text-sm">Access Control</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column - Login Form */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full md:w-1/2 px-6 py-10 flex items-center justify-center"
        >
          <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 md:p-10">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
              <p className="text-gray-600">Sign in to access your secure documents</p>
            </div>

            {/* Login Type Toggle */}
            <div className="flex rounded-md shadow-sm p-1 bg-gray-100 mb-6">
              <button
                type="button"
                className={`w-1/2 py-2 text-sm font-medium rounded-md transition ${
                  loginType === "user"
                    ? "bg-black text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setLoginType("user")}
              >
                <div className="flex items-center justify-center">
                  <User className="h-4 w-4 mr-2" />
                  User Login
                </div>
              </button>
              <button
                type="button"
                className={`w-1/2 py-2 text-sm font-medium rounded-md transition ${
                  loginType === "company"
                    ? "bg-black text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setLoginType("company")}
              >
                <div className="flex items-center justify-center">
                  <Building className="h-4 w-4 mr-2" />
                  Company Login
                </div>
              </button>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                      Remember me
                    </label>
                  </div>
                  <div className="text-sm">
                    <a href="#" className="font-medium text-black hover:text-gray-800">
                      Forgot password?
                    </a>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-black text-white py-3 px-4 rounded-lg transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                >
                  Sign In
                </button>
              </div>

              <div className="text-center mt-6">
                <p className="text-gray-600">
                  Don't have an account?{" "}
                  <Link href="/auth/signup" className="text-black font-semibold hover:underline">
                    Sign Up
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </motion.div>
      </div>

      {loading && <Loader />}
    </div>
  );
};

export default Login;