"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Web3 from 'web3';
import Loader from "@/components/utlis/Loader";
import { useAppDispatch } from "@/redux/hooks";
import { setUserAddress, setUserLogin } from "@/redux/slicers/userSlice";
import { Shield, Lock, AlertCircle } from "lucide-react";

// Import your animation here
// import loginAnimation from '/public/signin.json';

const Login = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  

  const handleMetaMaskSignIn = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      if (typeof window !== 'undefined') {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.enable(); // Request user's permission to connect

        const accounts = await web3.eth.getAccounts();
        const address = accounts[0];

        // Send address to backend API
        const response = await fetch('/api/users/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ethreumAddress: address }),
        });

        if (response.ok) {
          const data = await response.json();
          
          setLoading(false);
          dispatch(setUserAddress(address));
          dispatch(setUserLogin(true));
          toast.success("Login successful");
          router.push("/dashboard");
        } else {
          setError("Failed to authenticate with MetaMask");
          toast.error('Failed to authenticate with MetaMask');
          setLoading(false);
        }
      } else {
        setError("MetaMask not installed. Please install MetaMask to continue.");
        toast.error("MetaMask not installed");
        setLoading(false);
      }
    } catch (error) {
      console.error("MetaMask authentication error:", error);
      setError("Authentication error. Please try again.");
      toast.error("MetaMask authentication error");
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
        {/* Left Column - Animation and Info */}
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
              {/* Placeholder for animation - replace with your actual animation */}
              <div className="rounded-full bg-white/10 p-8">
                <Lock className="h-32 w-32 text-white/80" />
              </div>
              {/* {View} */}
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

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <form className="space-y-6">
              <div className="relative">
                <button
                  onClick={handleMetaMaskSignIn}
                  className="w-full flex items-center justify-center space-x-2 bg-black text-white py-4 px-4 rounded-lg transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                >
                  <Lock className="h-5 w-5" />
                  <span>Connect with MetaMask</span>
                </button>
              </div>

              <div className="relative flex items-center justify-center">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="flex-shrink mx-4 text-gray-600">or continue with</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
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