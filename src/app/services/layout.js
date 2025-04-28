"use client";
import { useAppSelector } from "@/redux/hooks";
import { Toaster } from "react-hot-toast";
import {
  Files,
  Share2,
  Clock,
  Folder,
  Users,
  Settings,
  LogOut,
  Shield,
  Bell,
  Menu
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import UserProfile from "@/components/utlis/UserProfile"; // Import the UserProfile component

export default function RootLayout({ children }) {
  const user = useAppSelector((state) => state.user);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and on resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    // Initial check
    checkIfMobile();

    // Add event listener
    window.addEventListener('resize', checkIfMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (user?.login || user?.firstName) {
   
  
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50">
      {/* Fixed Header */}
      <header className="z-30 w-full bg-black text-white shadow-md">
        <div className="px-4 sm:px-6 h-16 flex justify-between items-center">
          <div className="flex items-center">
            {isMobile && (
              <button 
                onClick={toggleSidebar}
                className="mr-2 p-2 rounded-md hover:bg-gray-800 transition-colors"
                aria-label="Toggle sidebar"
              >
                <Menu className="h-5 w-5" />
              </button>
            )}
            <Shield className="h-8 w-8 mr-2" />
            <span className="text-xl font-bold">ChainVault</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-gray-800 transition-colors relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-black"></span>
            </button>
            
            {/* Replace the user button with UserProfile component */}
            <UserProfile />
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden"> 
        {/* Fixed Sidebar - with conditional rendering based on state */}
        <aside 
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } fixed md:relative z-20 w-64 h-[calc(100vh-4rem)] bg-white shadow-md transition-transform duration-300 ease-in-out md:translate-x-0`}
        >
          <div className="flex flex-col h-full overflow-y-auto">
            <nav className="flex-1 space-y-1 p-4">
              <Link
                href="/dashboard"
                className="flex items-center px-4 py-3 text-sm font-medium rounded-md bg-black text-white"
              >
                <Files className="mr-3 h-5 w-5" />
                Documents
              </Link>
              <Link
                href="/shared"
                className="flex items-center px-4 py-3 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100"
              >
                <Share2 className="mr-3 h-5 w-5" />
                Shared
              </Link>
              <Link
                href="/recent"
                className="flex items-center px-4 py-3 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100"
              >
                <Clock className="mr-3 h-5 w-5" />
                Recent
              </Link>
              <Link
                href="/folders"
                className="flex items-center px-4 py-3 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100"
              >
                <Folder className="mr-3 h-5 w-5" />
                Folders
              </Link>
              <Link
                href="/access"
                className="flex items-center px-4 py-3 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100"
              >
                <Users className="mr-3 h-5 w-5" />
                Access Control
              </Link>
              <Link
                href="/settings"
                className="flex items-center px-4 py-3 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100"
              >
                <Settings className="mr-3 h-5 w-5" />
                Settings
              </Link>
            </nav>

            {/* Bottom section with storage usage */}
            <div className="p-4 border-t border-gray-200">
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Storage Used
                </h3>
                <div className="bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-black h-2.5 rounded-full"
                    style={{ width: `${user?.storagePercentage || 68}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{user?.storagePercentage || 68}% used</span>
                  <span>5GB Plan</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
        
        {/* Overlay for mobile */}
        {sidebarOpen && isMobile && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
            onClick={toggleSidebar}
          ></div>
        )}
        
        {/* Main Content - Scrollable */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>

      {/* Toast notifications */}
      <Toaster position="top-right" />
    </div>
  );
}
}