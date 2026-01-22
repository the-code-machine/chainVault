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
  Menu,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import UserProfile from "@/components/utlis/UserProfile"; // Import the UserProfile component
import { usePathname } from "next/navigation"; // Import usePathname hook

export default function RootLayout({ children }) {
  const user = useAppSelector((state) => state.user);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname(); // Get current pathname for active link highlighting

  // Function to determine if a navigation item is active
  const isActive = (path) => {
    if (path === "/services" && pathname === "/services") {
      return true;
    }

    if (path !== "/services" && pathname.startsWith(path)) {
      return true;
    }

    return false;
  };

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
    window.addEventListener("resize", checkIfMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile);
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
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            } fixed md:relative z-20 w-64 h-[calc(100vh-4rem)] bg-white shadow-md transition-transform duration-300 ease-in-out md:translate-x-0`}
          >
            <div className="flex flex-col h-full overflow-y-auto">
              <nav className="flex-1 space-y-1 p-4">
                <Link
                  href="/services"
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                    isActive("/services") && pathname === "/services"
                      ? "bg-black text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Files className="mr-3 h-5 w-5" />
                  Documents
                </Link>
                <Link
                  href="/services/shared"
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                    isActive("/services/shared")
                      ? "bg-black text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Share2 className="mr-3 h-5 w-5" />
                  Shared
                </Link>
                <Link
                  href="/services/recent"
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                    isActive("/services/recent")
                      ? "bg-black text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Clock className="mr-3 h-5 w-5" />
                  Recent
                </Link>

                <Link
                  href="/services/access"
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                    isActive("/services/access")
                      ? "bg-black text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Users className="mr-3 h-5 w-5" />
                  Access Control
                </Link>
                <Link
                  href="/services/settings"
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                    isActive("/services/settings")
                      ? "bg-black text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Settings className="mr-3 h-5 w-5" />
                  Settings
                </Link>
              </nav>
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
            <div className="p-6">{children}</div>
          </main>
        </div>

        {/* Toast notifications */}
        <Toaster position="top-right" />
      </div>
    );
  }
}
