"use client";
import React, { useState, useEffect } from "react";
import {
  Settings as SettingsIcon,
  User,
  Wallet,
  Shield,
  Bell,
  ArrowLeft,
  ExternalLink,
  Save,
  Key,
  LogOut,
  AlertTriangle,
  Check,
  Copy,
  RefreshCw,
} from "lucide-react";
import Web3 from "web3";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Settings() {
  const user = useAppSelector((state) => state.user);
  const router = useRouter();
  const dispatch = useAppDispatch();

  // State for user settings
  const [profileSettings, setProfileSettings] = useState({
    firstName: "",
    lastName: "",
    email: "",
    notifications: {
      documentUpdates: true,
      accessChanges: true,
      securityAlerts: true,
    },
  });

  // State for wallet settings
  const [walletSettings, setWalletSettings] = useState({
    connected: false,
    address: "",
    network: "",
    loading: false,
  });

  // State for security settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    lastLogin: "",
    activeSessions: [],
  });

  // State for UI settings
  const [uiSettings, setUiSettings] = useState({
    darkMode: false,
    compactView: false,
    autoRefresh: true,
  });

  // Active tab state
  const [activeTab, setActiveTab] = useState("profile");

  // Loading states
  const [loading, setLoading] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPreferences, setSavingPreferences] = useState(false);

  // Initialize settings from user data
  useEffect(() => {
    if (user) {
      setProfileSettings({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        notifications: {
          documentUpdates: user.notifications?.documentUpdates !== false,
          accessChanges: user.notifications?.accessChanges !== false,
          securityAlerts: user.notifications?.securityAlerts !== false,
        },
      });

      setWalletSettings({
        connected: !!user.ethreumAddress,
        address: user.ethreumAddress || "",
        network: "Ethereum Mainnet",
        loading: false,
      });

      // Mock security data (would come from an API in a real app)
      setSecuritySettings({
        twoFactorEnabled: user.twoFactorEnabled || false,
        lastLogin: user.lastLogin || new Date().toLocaleString(),
        activeSessions: user.activeSessions || [
          {
            id: "current-session",
            device: "Current browser",
            location: "Your location",
            lastActive: "Now",
            current: true,
          },
        ],
      });

      // Get UI preferences from localStorage
      const savedDarkMode = localStorage.getItem("darkMode") === "true";
      const savedCompactView = localStorage.getItem("compactView") === "true";
      const savedAutoRefresh = localStorage.getItem("autoRefresh") !== "false"; // Default to true

      setUiSettings({
        darkMode: savedDarkMode,
        compactView: savedCompactView,
        autoRefresh: savedAutoRefresh,
      });
    }
  }, [user]);

  // Handle profile form changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileSettings({
      ...profileSettings,
      [name]: value,
    });
  };

  // Handle notification toggle
  const handleNotificationToggle = (setting) => {
    setProfileSettings({
      ...profileSettings,
      notifications: {
        ...profileSettings.notifications,
        [setting]: !profileSettings.notifications[setting],
      },
    });
  };

  // Handle UI settings toggle
  const handleUIToggle = (setting) => {
    const newValue = !uiSettings[setting];

    setUiSettings({
      ...uiSettings,
      [setting]: newValue,
    });

    // Save to localStorage
    localStorage.setItem(setting, newValue);

    // Apply dark mode changes immediately
    if (setting === "darkMode") {
      if (newValue) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }

    toast.success(`${setting} ${newValue ? "enabled" : "disabled"}`);
  };

  // Handle profile save
  const handleProfileSave = async () => {
    setSavingProfile(true);

    try {
      // Mock API call to update user profile
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Profile updated successfully");

      // Update redux state (in a real app)
      // dispatch(updateUser({ ...profileSettings }));
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  // Connect wallet
  const connectWallet = async () => {
    if (!window.ethereum) {
      toast.error("MetaMask is not installed");
      return;
    }

    try {
      setWalletSettings({
        ...walletSettings,
        loading: true,
      });

      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const address = accounts[0];

      // Get the current network
      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      const networkName = getNetworkName(chainId);

      // Update the user's Ethereum address in the backend
      const response = await fetch("/api/wallet/connect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ethreumAddress: address }),
      });

      if (response.ok) {
        toast.success("Wallet connected successfully");

        setWalletSettings({
          connected: true,
          address: address,
          network: networkName,
          loading: false,
        });

        // Update redux state (in a real app)
        // dispatch(updateUser({ ethreumAddress: address }));
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to connect wallet");
        setWalletSettings({
          ...walletSettings,
          loading: false,
        });
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast.error("Failed to connect wallet");
      setWalletSettings({
        ...walletSettings,
        loading: false,
      });
    }
  };

  // Disconnect wallet
  const disconnectWallet = async () => {
    try {
      setWalletSettings({
        ...walletSettings,
        loading: true,
      });

      // Mock API call to disconnect wallet
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setWalletSettings({
        connected: false,
        address: "",
        network: "",
        loading: false,
      });

      toast.success("Wallet disconnected successfully");

      // Update redux state (in a real app)
      // dispatch(updateUser({ ethreumAddress: null }));
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      toast.error("Failed to disconnect wallet");
      setWalletSettings({
        ...walletSettings,
        loading: false,
      });
    }
  };

  // Enable/disable two-factor authentication
  const toggleTwoFactor = async () => {
    try {
      setLoading(true);

      // Mock API call to toggle 2FA
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSecuritySettings({
        ...securitySettings,
        twoFactorEnabled: !securitySettings.twoFactorEnabled,
      });

      toast.success(
        `Two-factor authentication ${securitySettings.twoFactorEnabled ? "disabled" : "enabled"}`,
      );

      // Update redux state (in a real app)
      // dispatch(updateUser({ twoFactorEnabled: !securitySettings.twoFactorEnabled }));
    } catch (error) {
      console.error("Error toggling 2FA:", error);
      toast.error("Failed to update two-factor authentication");
    } finally {
      setLoading(false);
    }
  };

  // End a session
  const endSession = async (sessionId) => {
    try {
      setLoading(true);

      // Mock API call to end session
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Filter out the ended session
      const updatedSessions = securitySettings.activeSessions.filter(
        (session) => session.id !== sessionId,
      );

      setSecuritySettings({
        ...securitySettings,
        activeSessions: updatedSessions,
      });

      toast.success("Session ended successfully");
    } catch (error) {
      console.error("Error ending session:", error);
      toast.error("Failed to end session");
    } finally {
      setLoading(false);
    }
  };

  // Copy wallet address to clipboard
  const copyAddress = () => {
    navigator.clipboard.writeText(walletSettings.address);
    toast.success("Address copied to clipboard");
  };

  // Helper function to get network name from chain ID
  const getNetworkName = (chainId) => {
    const networks = {
      "0x1": "Ethereum Mainnet",
      "0x3": "Ropsten Test Network",
      "0x4": "Rinkeby Test Network",
      "0x5": "Goerli Test Network",
      "0x2a": "Kovan Test Network",
      "0x89": "Polygon Mainnet",
      "0x13881": "Polygon Mumbai Testnet",
    };

    return networks[chainId] || `Chain ${chainId}`;
  };

  // Shortern Ethereum address for display
  const shortenAddress = (address) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header section */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => router.push("/dashboard")}
              className="text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          </div>
        </div>

        {/* Settings layout */}
        <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
          {/* Settings navigation */}
          <div className="w-full md:w-1/4">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-4 py-5 bg-gray-50 border-b">
                <h2 className="text-sm font-medium text-gray-700">Settings</h2>
              </div>
              <nav className="space-y-1 p-2">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`flex items-center w-full px-4 py-3 text-sm rounded-md ${
                    activeTab === "profile"
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <User className="mr-3 h-5 w-5 text-gray-400" />
                  Profile
                </button>

                <button
                  onClick={() => setActiveTab("wallet")}
                  className={`flex items-center w-full px-4 py-3 text-sm rounded-md ${
                    activeTab === "wallet"
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Wallet className="mr-3 h-5 w-5 text-gray-400" />
                  Wallet
                </button>

                <button
                  onClick={() => setActiveTab("security")}
                  className={`flex items-center w-full px-4 py-3 text-sm rounded-md ${
                    activeTab === "security"
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Shield className="mr-3 h-5 w-5 text-gray-400" />
                  Security
                </button>

                <button
                  onClick={() => setActiveTab("preferences")}
                  className={`flex items-center w-full px-4 py-3 text-sm rounded-md ${
                    activeTab === "preferences"
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <SettingsIcon className="mr-3 h-5 w-5 text-gray-400" />
                  Preferences
                </button>
              </nav>
            </div>
          </div>

          {/* Settings content */}
          <div className="w-full md:w-3/4 bg-white shadow rounded-lg overflow-hidden">
            {/* Profile settings */}
            {activeTab === "profile" && (
              <div>
                <div className="px-6 py-4 border-b">
                  <h2 className="text-lg font-medium text-gray-900">
                    Profile Settings
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Update your personal information and notification
                    preferences.
                  </p>
                </div>

                <div className="px-6 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="firstName"
                        className="block text-sm font-medium text-gray-700"
                      >
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        id="firstName"
                        value={profileSettings.firstName}
                        onChange={handleProfileChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="lastName"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        id="lastName"
                        value={profileSettings.lastName}
                        onChange={handleProfileChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={profileSettings.email}
                        onChange={handleProfileChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">
                      Notification Preferences
                    </h3>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            Document Updates
                          </p>
                          <p className="text-sm text-gray-500">
                            Receive notifications when your documents are
                            updated
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            handleNotificationToggle("documentUpdates")
                          }
                          className={`${
                            profileSettings.notifications.documentUpdates
                              ? "bg-black"
                              : "bg-gray-200"
                          } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black`}
                        >
                          <span className="sr-only">Enable notifications</span>
                          <span
                            className={`${
                              profileSettings.notifications.documentUpdates
                                ? "translate-x-5"
                                : "translate-x-0"
                            } pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            Access Changes
                          </p>
                          <p className="text-sm text-gray-500">
                            Receive notifications when document access changes
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            handleNotificationToggle("accessChanges")
                          }
                          className={`${
                            profileSettings.notifications.accessChanges
                              ? "bg-black"
                              : "bg-gray-200"
                          } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black`}
                        >
                          <span className="sr-only">Enable notifications</span>
                          <span
                            className={`${
                              profileSettings.notifications.accessChanges
                                ? "translate-x-5"
                                : "translate-x-0"
                            } pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            Security Alerts
                          </p>
                          <p className="text-sm text-gray-500">
                            Receive notifications about security events
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            handleNotificationToggle("securityAlerts")
                          }
                          className={`${
                            profileSettings.notifications.securityAlerts
                              ? "bg-black"
                              : "bg-gray-200"
                          } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black`}
                        >
                          <span className="sr-only">Enable notifications</span>
                          <span
                            className={`${
                              profileSettings.notifications.securityAlerts
                                ? "translate-x-5"
                                : "translate-x-0"
                            } pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleProfileSave}
                      disabled={savingProfile}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                    >
                      {savingProfile ? (
                        <>
                          <div className="mr-2 h-4 w-4 border-b-2 border-white rounded-full animate-spin"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="-ml-1 mr-2 h-5 w-5" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Wallet settings */}
            {activeTab === "wallet" && (
              <div>
                <div className="px-6 py-4 border-b">
                  <h2 className="text-lg font-medium text-gray-900">
                    Wallet Settings
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Manage your blockchain wallet connection.
                  </p>
                </div>

                <div className="px-6 py-4">
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="mb-4 md:mb-0">
                        <h3 className="text-sm font-medium text-gray-700">
                          Wallet Status
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {walletSettings.connected
                            ? "Your wallet is connected"
                            : "No wallet connected"}
                        </p>
                      </div>

                      {walletSettings.connected ? (
                        <button
                          type="button"
                          onClick={disconnectWallet}
                          disabled={walletSettings.loading}
                          className="inline-flex items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          {walletSettings.loading ? (
                            <>
                              <div className="mr-2 h-4 w-4 border-b-2 border-red-700 rounded-full animate-spin"></div>
                              Disconnecting...
                            </>
                          ) : (
                            <>
                              <LogOut className="-ml-1 mr-2 h-5 w-5" />
                              Disconnect Wallet
                            </>
                          )}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={connectWallet}
                          disabled={walletSettings.loading}
                          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                        >
                          {walletSettings.loading ? (
                            <>
                              <div className="mr-2 h-4 w-4 border-b-2 border-white rounded-full animate-spin"></div>
                              Connecting...
                            </>
                          ) : (
                            <>
                              <Wallet className="-ml-1 mr-2 h-5 w-5" />
                              Connect Wallet
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {walletSettings.connected && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">
                          Connected Address
                        </h3>
                        <div className="flex items-center p-3 bg-gray-100 rounded-md">
                          <span className="text-sm font-mono text-gray-800 flex-1 truncate mr-2">
                            {walletSettings.address}
                          </span>
                          <button
                            type="button"
                            onClick={copyAddress}
                            className="p-1.5 text-gray-400 hover:text-gray-600 focus:outline-none"
                          >
                            <Copy className="h-5 w-5" />
                          </button>
                          <a
                            href={`https://etherscan.io/address/${walletSettings.address}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-gray-400 hover:text-gray-600 focus:outline-none ml-1"
                          >
                            <ExternalLink className="h-5 w-5" />
                          </a>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">
                          Connected Network
                        </h3>
                        <div className="p-3 bg-gray-100 rounded-md">
                          <span className="text-sm text-gray-800">
                            {walletSettings.network}
                          </span>
                        </div>
                      </div>

                      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <AlertTriangle className="h-5 w-5 text-yellow-400" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-yellow-700">
                              Your wallet is used to sign blockchain
                              transactions. Keep your wallet secure and never
                              share your private keys with anyone.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Security settings */}
            {activeTab === "security" && (
              <div>
                <div className="px-6 py-4 border-b">
                  <h2 className="text-lg font-medium text-gray-900">
                    Security Settings
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Manage your account security and active sessions.
                  </p>
                </div>

                <div className="px-6 py-4">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-3">
                        Two-Factor Authentication
                      </h3>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div
                              className={`p-2 rounded-full ${securitySettings.twoFactorEnabled ? "bg-green-100" : "bg-gray-100"}`}
                            >
                              <Key
                                className={`h-5 w-5 ${securitySettings.twoFactorEnabled ? "text-green-600" : "text-gray-400"}`}
                              />
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-700">
                                {securitySettings.twoFactorEnabled
                                  ? "Enabled"
                                  : "Disabled"}
                              </p>
                              <p className="text-xs text-gray-500">
                                {securitySettings.twoFactorEnabled
                                  ? "Your account is protected with 2FA"
                                  : "Enhance your account security with 2FA"}
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={toggleTwoFactor}
                            disabled={loading}
                            className={`inline-flex items-center px-3 py-1.5 border shadow-sm text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                              securitySettings.twoFactorEnabled
                                ? "border-red-300 text-red-700 bg-white hover:bg-red-50 focus:ring-red-500"
                                : "border-transparent text-white bg-black hover:bg-gray-800 focus:ring-black"
                            }`}
                          >
                            {loading ? (
                              <div className="h-4 w-4 border-b-2 border-current rounded-full animate-spin"></div>
                            ) : securitySettings.twoFactorEnabled ? (
                              "Disable"
                            ) : (
                              "Enable"
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-3">
                        Recent Activity
                      </h3>

                      <div className="overflow-hidden rounded-lg border border-gray-200">
                        <div className="bg-gray-50 px-4 py-3 border-b">
                          <p className="text-xs text-gray-500">
                            Last login: {securitySettings.lastLogin}
                          </p>
                        </div>

                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th
                                scope="col"
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Device
                              </th>
                              <th
                                scope="col"
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Location
                              </th>
                              <th
                                scope="col"
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Last Active
                              </th>
                              <th scope="col" className="relative px-4 py-3">
                                <span className="sr-only">Action</span>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {securitySettings.activeSessions.map((session) => (
                              <tr key={session.id}>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <div className="flex items-center">
                                    {session.current && (
                                      <span
                                        className="flex-shrink-0 h-2 w-2 rounded-full bg-green-500 mr-2"
                                        aria-hidden="true"
                                      />
                                    )}
                                    <span className="text-sm text-gray-900">
                                      {session.device}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                  {session.location}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                  {session.lastActive}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                                  {!session.current && (
                                    <button
                                      onClick={() => endSession(session.id)}
                                      className="text-red-600 hover:text-red-900"
                                    >
                                      End
                                    </button>
                                  )}
                                  {session.current && (
                                    <span className="text-green-600">
                                      Current
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <AlertTriangle className="h-5 w-5 text-yellow-400" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-yellow-700">
                            Enable two-factor authentication for enhanced
                            security. If you notice any suspicious activity, end
                            the session and change your password immediately.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Preferences settings */}
            {activeTab === "preferences" && (
              <div>
                <div className="px-6 py-4 border-b">
                  <h2 className="text-lg font-medium text-gray-900">
                    Preferences
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Customize your application experience.
                  </p>
                </div>

                <div className="px-6 py-4">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-3">
                        Interface Settings
                      </h3>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-700">
                              Dark Mode
                            </p>
                            <p className="text-sm text-gray-500">
                              Use dark theme for the interface
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleUIToggle("darkMode")}
                            className={`${
                              uiSettings.darkMode ? "bg-black" : "bg-gray-200"
                            } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black`}
                          >
                            <span className="sr-only">Enable dark mode</span>
                            <span
                              className={`${
                                uiSettings.darkMode
                                  ? "translate-x-5"
                                  : "translate-x-0"
                              } pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                            />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-700">
                              Compact View
                            </p>
                            <p className="text-sm text-gray-500">
                              Use compact view for document lists
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleUIToggle("compactView")}
                            className={`${
                              uiSettings.compactView
                                ? "bg-black"
                                : "bg-gray-200"
                            } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black`}
                          >
                            <span className="sr-only">Enable compact view</span>
                            <span
                              className={`${
                                uiSettings.compactView
                                  ? "translate-x-5"
                                  : "translate-x-0"
                              } pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                            />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-700">
                              Auto-Refresh
                            </p>
                            <p className="text-sm text-gray-500">
                              Automatically refresh document list
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleUIToggle("autoRefresh")}
                            className={`${
                              uiSettings.autoRefresh
                                ? "bg-black"
                                : "bg-gray-200"
                            } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black`}
                          >
                            <span className="sr-only">Enable auto-refresh</span>
                            <span
                              className={`${
                                uiSettings.autoRefresh
                                  ? "translate-x-5"
                                  : "translate-x-0"
                              } pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                            />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-3">
                        Document Display
                      </h3>

                      <div className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center mb-4">
                          <RefreshCw className="h-5 w-5 text-gray-400 mr-2" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">
                              Auto-refresh interval
                            </p>
                            <p className="text-xs text-gray-500">
                              How often to refresh document data
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-5 gap-2">
                          {[
                            { value: "0", label: "Off" },
                            { value: "30", label: "30s" },
                            { value: "60", label: "1m" },
                            { value: "300", label: "5m" },
                            { value: "600", label: "10m" },
                          ].map((option) => (
                            <button
                              key={option.value}
                              type="button"
                              className={`px-3 py-2 rounded-md text-sm font-medium ${
                                option.value === "60"
                                  ? "bg-black text-white"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-md">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <Check className="h-5 w-5 text-green-400" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-green-700">
                            Your preferences are automatically saved as you make
                            changes.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
