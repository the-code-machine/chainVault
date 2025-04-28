"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { User, LogOut, Wallet, Copy, ExternalLink, CheckCircle, UserCircle, Mail, Building } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { setUserLogin, setUserAddress, setUserDetails } from '@/redux/slicers/userSlice';
import Web3 from 'web3';
import toast from 'react-hot-toast';

const UserProfile = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const [isOpen, setIsOpen] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch user details when component mounts
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (user?.login && !user?.firstName) {
        setLoading(true);
        try {
          const response = await fetch('/api/users/profile');
          if (response.ok) {
            const data = await response.json();
            dispatch(setUserDetails(data));
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserDetails();
  }, [user?.login, user?.firstName, dispatch]);

  // Shorten Ethereum address for display
  const shortenAddress = (address) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Copy address to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Address copied to clipboard");
  };

  // Connect MetaMask wallet
  const connectWallet = async () => {
    setConnecting(true);
    
    try {
      if (typeof window.ethereum !== 'undefined') {
        const web3 = new Web3(window.ethereum);
        
        // Request account access
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        
        const address = accounts[0];
        
        // Update the user's Ethereum address in the backend
        const response = await fetch('/api/wallet/connect', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ethreumAddress: address }),
        });
        
        if (response.ok) {
          // Update Redux state
          dispatch(setUserAddress(address));
          toast.success("Wallet connected successfully");
        } else {
          const data = await response.json();
          toast.error(data.error || "Failed to connect wallet");
        }
      } else {
        toast.error("MetaMask not installed");
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast.error("Failed to connect wallet");
    } finally {
      setConnecting(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });
      
      // Clear user state regardless of response
      dispatch(setUserLogin(false));
      dispatch(setUserAddress(null));
      
      // Close dropdown
      setIsOpen(false);
      
      // Redirect to login page
      router.push('/auth/login');
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Check if wallet is connected
  const isWalletConnected = !!user?.ethreumAddress;

  // Get user display name
  const getDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    } else if (user?.firstName) {
      return user.firstName;
    } else if (user?.name) {
      return user.name;
    } else {
      return "User";
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 focus:outline-none"
      >
        <div className="bg-gray-700 rounded-full h-8 w-8 flex items-center justify-center">
          <User className="h-5 w-5 text-white" />
        </div>
        <span className="hidden md:block text-white">
          {loading ? "Loading..." : getDisplayName()}
        </span>
        <svg className={`w-4 h-4 text-white transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg py-2 z-50"
        >
          {/* User Details Section */}
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex items-center mb-2">
              <div className="bg-gray-200 rounded-full h-12 w-12 flex items-center justify-center mr-3">
                <UserCircle className="h-8 w-8 text-gray-500" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{getDisplayName()}</p>
                <p className="text-sm text-gray-500 truncate">{user?.role || "Member"}</p>
              </div>
            </div>
            
            <div className="mt-2 space-y-1 text-sm text-gray-600">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-gray-400" />
                <span className="truncate">{user?.email || "email@example.com"}</span>
              </div>
              
              {user?.company && (
                <div className="flex items-center">
                  <Building className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="truncate">{user.company}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Wallet Section */}
          <div className="px-4 py-3 border-b border-gray-200">
            <p className="text-sm font-medium text-gray-900 mb-2">Blockchain Wallet</p>
            
            {isWalletConnected ? (
              <div>
                <div className="flex items-center justify-between bg-gray-50 rounded p-2 mb-2">
                  <div className="flex items-center">
                    <Wallet className="h-4 w-4 text-gray-600 mr-2" />
                    <span className="text-sm text-gray-600">
                      {shortenAddress(user.ethreumAddress)}
                    </span>
                  </div>
                  <div className="flex space-x-1">
                    <button 
                      onClick={() => copyToClipboard(user.ethreumAddress)}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <Copy className="h-3.5 w-3.5 text-gray-500" />
                    </button>
                    <a 
                      href={`https://etherscan.io/address/${user.ethreumAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <ExternalLink className="h-3.5 w-3.5 text-gray-500" />
                    </a>
                  </div>
                </div>
                <div className="flex items-center text-xs text-green-600">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  <span>Wallet connected</span>
                </div>
              </div>
            ) : (
              <button 
                onClick={connectWallet}
                disabled={connecting}
                className="w-full flex items-center justify-center space-x-2 bg-black text-white py-2 px-3 rounded hover:bg-gray-800 transition text-sm"
              >
                {connecting ? (
                  <span>Connecting...</span>
                ) : (
                  <>
                    <Wallet className="h-4 w-4 mr-1" />
                    <span>Connect MetaMask</span>
                  </>
                )}
              </button>
            )}
          </div>
          
          {/* Action Items */}
          <div className="px-1 py-1">
          
            
            <button 
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <LogOut className="h-4 w-4 mr-2 text-gray-500" />
              Sign out
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default UserProfile;