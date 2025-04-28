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
import { Shield, Lock, AlertCircle, CheckCircle, ArrowRight, FileText } from "lucide-react";

const SignUp = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [step, setStep] = useState(1); // 1: Personal Info, 2: Account Setup, 3: Wallet Connection
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateStep1 = () => {
    if (!formData.firstName || !formData.lastName) {
      setError("First name and last name are required");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.email) {
      setError("Email is required");
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    
    if (!formData.password) {
      setError("Password is required");
      return false;
    }
    
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    
    return true;
  };

  const goToNextStep = () => {
    if (step === 1 && validateStep1()) {
      setError("");
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setError("");
      setStep(3);
    }
  };

  const goToPreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
      setError("");
    }
  };

  const handleMetaMaskConnect = async () => {
    setError("");
    setLoading(true);
    
    try {
      if (typeof window.ethereum !== 'undefined') {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.enable(); // Request user's permission to connect

        const accounts = await web3.eth.getAccounts();
        const address = accounts[0];

        // Here you would typically send all form data along with the wallet address to your API
        const response = await fetch('/api/users/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
            ethreumAddress: address 
          }),
        });

        if (response.ok) {
          setLoading(false);
          dispatch(setUserAddress(address));
          dispatch(setUserLogin(true));
          toast.success("Account created successfully!");
          router.push("/dashboard");
        } else {
          setError("Failed to create account. Please try again.");
          toast.error('Registration failed');
          setLoading(false);
        }
      } else {
        setError("MetaMask not installed. Please install MetaMask to continue.");
        toast.error("MetaMask not installed");
        setLoading(false);
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError("Registration error. Please try again.");
      toast.error("Registration failed");
      setLoading(false);
    }
  };

  const submitForm = (e) => {
    e.preventDefault();
    if (step === 3) {
      handleMetaMaskConnect();
    } else {
      goToNextStep();
    }
  };

  const renderStepIndicator = () => {
    return (
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 1 ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'}`}>
            1
          </div>
          <div className={`w-12 h-1 ${step >= 2 ? 'bg-black' : 'bg-gray-200'}`}></div>
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 2 ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'}`}>
            2
          </div>
          <div className={`w-12 h-1 ${step >= 3 ? 'bg-black' : 'bg-gray-200'}`}></div>
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 3 ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'}`}>
            3
          </div>
        </div>
      </div>
    );
  };

  const renderFormStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                />
              </div>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <h3 className="text-xl font-semibold mb-4">Account Setup</h3>
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
                <p className="text-xs text-gray-500 mt-1">
                  Must be at least 8 characters long
                </p>
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                />
              </div>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <h3 className="text-xl font-semibold mb-4">Connect Your Wallet</h3>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
              <p className="text-gray-700 mb-4">
                To complete your registration, connect your MetaMask wallet. This will be used to securely manage your documents on the blockchain.
              </p>
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <p className="text-sm text-gray-600">Secure document verification</p>
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <p className="text-sm text-gray-600">Tamper-proof storage</p>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <p className="text-sm text-gray-600">Complete control over your data</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleMetaMaskConnect}
              className="w-full flex items-center justify-center space-x-2 bg-black text-white py-4 px-4 rounded-lg transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
            >
              <img 
                src="/metamask-fox.svg" 
                alt="MetaMask" 
                className="h-6 w-6"
              />
              <span>Connect MetaMask Wallet</span>
            </button>
          </>
        );
      default:
        return null;
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
            <FileText className="h-16 w-16 mb-6" />
            <h1 className="text-4xl font-bold mb-6">Join Chain Vault</h1>
            <p className="text-xl mb-8">
              Create an account to securely store, manage, and share your important legal documents with blockchain verification.
            </p>
            
            <div className="w-full bg-white/10 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold mb-4">Benefits of Chain Vault</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3 flex-shrink-0 mt-0.5" />
                  <span>Military-grade encryption for all your documents</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3 flex-shrink-0 mt-0.5" />
                  <span>Blockchain verification ensures tamper-proof storage</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3 flex-shrink-0 mt-0.5" />
                  <span>Granular access control with smart contracts</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3 flex-shrink-0 mt-0.5" />
                  <span>Complete audit trail for all document activity</span>
                </li>
              </ul>
            </div>

            <div className="flex items-center justify-center space-x-2 text-sm">
              <Lock className="h-4 w-4" />
              <span>Your data is secure and private</span>
            </div>
          </div>
        </motion.div>

        {/* Right Column - Sign Up Form */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full md:w-1/2 px-6 py-10 flex items-center justify-center"
        >
          <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 md:p-10">
            <div className="text-center mb-4">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h2>
              <p className="text-gray-600">Step {step} of 3</p>
            </div>

            {renderStepIndicator()}

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={submitForm} className="space-y-6">
              {renderFormStep()}

              <div className="flex justify-between pt-4">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={goToPreviousStep}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                  >
                    Back
                  </button>
                ) : (
                  <div></div>
                )}
                
                {step < 3 ? (
                  <button
                    type="submit"
                    className="px-6 py-2 bg-black text-white rounded-md flex items-center hover:bg-gray-800 transition focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                  >
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </button>
                ) : null}
              </div>
            </form>

            <div className="text-center mt-6 pt-4 border-t border-gray-200">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-black font-semibold hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {loading && <Loader />}
    </div>
  );
};

export default SignUp;