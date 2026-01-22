"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  User,
  LogOut,
  Wallet,
  Copy,
  ExternalLink,
  CheckCircle,
  UserCircle,
  Mail,
  Building,
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
// Make sure these actions exist in your userSlice!
import {
  setUserLogin,
  setUserAddress,
  setUserDetails,
} from "@/redux/slicers/userSlice";
import Web3 from "web3";
import toast from "react-hot-toast";

const UserProfile = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const [isOpen, setIsOpen] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const switchToSepolia = async () => {
    const SEPOLIA_CHAIN_ID = "0xaa36a7"; // Hexadecimal for 11155111

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: SEPOLIA_CHAIN_ID }],
      });
    } catch (error) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: SEPOLIA_CHAIN_ID,
                chainName: "Sepolia Test Network",
                rpcUrls: ["https://ethereum-sepolia-rpc.publicnode.com"],
                nativeCurrency: {
                  name: "Sepolia Ether",
                  symbol: "SEP",
                  decimals: 18,
                },
                blockExplorerUrls: ["https://sepolia.etherscan.io"],
              },
            ],
          });
        } catch (addError) {
          console.error("Failed to add Sepolia:", addError);
        }
      } else {
        console.error("Failed to switch network:", error);
      }
    }
  };
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

  // Fetch user details when component mounts (if logged in but missing details)
  useEffect(() => {
    const fetchUserDetails = async () => {
      // Only fetch if logged in AND missing basic info like firstName
      if (user?.login && !user?.firstName) {
        setLoading(true);
        try {
          const response = await fetch("/api/users/profile");
          if (response.ok) {
            const data = await response.json();
            // Assuming the API returns the full user object
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

  // Shorten Ethereum address for display (e.g., 0x1234...5678)
  const shortenAddress = (address) => {
    if (!address) return "";
    // Ensure it's a string before slicing to prevent crashes
    const addrStr = String(address);
    return `${addrStr.substring(0, 6)}...${addrStr.substring(addrStr.length - 4)}`;
  };

  // Copy address to clipboard
  const copyToClipboard = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success("Address copied to clipboard");
  };

  // Connect MetaMask wallet
  const connectWallet = async () => {
    // Check if MetaMask is installed
    if (typeof window.ethereum === "undefined") {
      toast.error("MetaMask is not installed");
      return;
    }

    setConnecting(true);

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      switchToSepolia();

      const address = accounts[0];

      // 1. Update Backend
      const response = await fetch("/api/wallet/connect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Note: using 'ethreumAddress' to match your backend schema
        body: JSON.stringify({ ethreumAddress: address }),
      });

      if (response.ok) {
        // 2. CRITICAL: Update Redux state immediately so UI reflects connection
        dispatch(setUserAddress(address));
        toast.success("Wallet connected successfully");
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to connect wallet");
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
      await fetch("/api/auth/logout", {
        method: "POST",
      });

      // Clear all user state
      dispatch(setUserLogin(false));
      dispatch(setUserAddress(null));
      // You might want a 'clearUser' action to reset everything

      setIsOpen(false);
      router.push("/auth/login");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Error logging out");
    }
  };

  // Helper to check if wallet is connected and valid
  const isWalletConnected =
    user?.ethreumAddress && user.ethreumAddress.startsWith("0x");

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
        className="flex items-center space-x-2 focus:outline-none hover:opacity-80 transition-opacity"
      >
        <div className="bg-gray-700 rounded-full h-8 w-8 flex items-center justify-center border border-gray-600">
          <User className="h-5 w-5 text-white" />
        </div>
        <span className="hidden md:block text-white font-medium text-sm">
          {loading ? "Loading..." : getDisplayName()}
        </span>
        <svg
          className={`w-4 h-4 text-white transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-100"
        >
          {/* User Details Section */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center mb-3">
              <div className="bg-gray-100 rounded-full h-12 w-12 flex items-center justify-center mr-3">
                <UserCircle className="h-7 w-7 text-gray-500" />
              </div>
              <div className="overflow-hidden">
                <p className="font-semibold text-gray-900 truncate">
                  {getDisplayName()}
                </p>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                  {user?.role || "Member"}
                </p>
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <Mail className="h-3.5 w-3.5 mr-2 text-gray-400 flex-shrink-0" />
                <span className="truncate">{user?.email || "No email"}</span>
              </div>

              {user?.companyName && (
                <div className="flex items-center">
                  <Building className="h-3.5 w-3.5 mr-2 text-gray-400 flex-shrink-0" />
                  <span className="truncate">{user.companyName}</span>
                </div>
              )}
            </div>
          </div>

          {/* Wallet Section */}
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Blockchain Wallet
            </p>

            {isWalletConnected ? (
              <div>
                <div className="flex items-center justify-between bg-white border border-gray-200 rounded-md p-2 mb-2 shadow-sm">
                  <div className="flex items-center overflow-hidden">
                    <Wallet className="h-4 w-4 text-blue-600 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-700 font-mono truncate">
                      {shortenAddress(user.ethreumAddress)}
                    </span>
                  </div>
                  <div className="flex space-x-1 flex-shrink-0 ml-2">
                    <button
                      onClick={() => copyToClipboard(user.ethreumAddress)}
                      className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-700 transition-colors"
                      title="Copy Address"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                    <a
                      href={`https://sepolia.etherscan.io/address/${user.ethreumAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-700 transition-colors"
                      title="View on Etherscan"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
                <div className="flex items-center text-xs text-green-600 font-medium">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  <span>Connected to Sepolia</span>
                </div>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                disabled={connecting}
                className="w-full flex items-center justify-center space-x-2 bg-black text-white py-2 px-3 rounded-md hover:bg-gray-800 transition-colors text-sm font-medium shadow-sm disabled:opacity-70"
              >
                {connecting ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <Wallet className="h-4 w-4 mr-1" />
                    <span>Connect Wallet</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Action Items */}
          <div className="p-1">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default UserProfile;
