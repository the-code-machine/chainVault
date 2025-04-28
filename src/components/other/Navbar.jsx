"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useAppSelector } from "@/redux/hooks";
import { 
  Shield, 
  File, 
  Menu, 
  X, 
  ChevronDown, 
  LogIn,
  Layers,
  Users,
  Lock
} from "lucide-react";

// Navigation items
const NavbarItems = [
  {
    name: "Services",
    href: "#",
    innerItems: [
      { name: "Document Upload", href: "/services/upload" },
      { name: "Document Verification", href: "/services/verify" },
      { name: "Access Management", href: "/services/access" },
      { name: "Audit Trail", href: "/services/audit" }
    ]
  },
  {
    name: "Solutions",
    href: "#",
    innerItems: [
      { name: "Corporate Compliance", href: "/solutions/corporate" },
      { name: "Legal Firms", href: "/solutions/legal" },
      { name: "Government Records", href: "/solutions/government" },
      { name: "Healthcare Documentation", href: "/solutions/healthcare" }
    ]
  },
  { name: "About", href: "about", innerItems: [] },
  { name: "Features", href: "features", innerItems: [] },
  { name: "Contact", href: "contact", innerItems: [] }
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? "bg-black bg-opacity-90 shadow-lg" : "bg-black bg-opacity-50"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Shield className="h-8 w-8 mr-2 text-white" />
              <div className="text-white font-bold text-xl">ChainVault</div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {NavbarItems.map((item, index) => (
              <FlyoutLink
                key={index}
                href={item.href}
                innerItems={item.innerItems}
              >
                {item.name}
              </FlyoutLink>
            ))}
            
            <LoginButton />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white hover:text-gray-300 focus:outline-none"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {NavbarItems.map((item, index) => (
                <div key={index}>
                  {item.innerItems.length > 0 ? (
                    <MobileAccordionLink item={item} />
                  ) : (
                    <Link
                      href={item.href}
                      className="block px-3 py-2 text-base font-medium text-white hover:bg-gray-900 rounded-md"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
              <div className="pt-2">
                <Link
                  href="/auth/login"
                  className="block w-full text-center px-3 py-2 text-base font-medium bg-white text-black hover:bg-gray-200 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

const LoginButton = () => {
  const user = useAppSelector((state) => state.user);

  return (
    <>
      {user?.login ? (
        <div className="bg-white text-black px-3 py-1.5 rounded-md font-medium max-w-[140px] truncate">
          {user?.address}
        </div>
      ) : (
        <Link
          href="/auth/login"
          className="flex items-center bg-white text-black hover:bg-gray-200 px-4 py-1.5 rounded-md font-medium transition-colors duration-200"
        >
          <LogIn className="h-4 w-4 mr-2" />
          Login
        </Link>
      )}
    </>
  );
};

const FlyoutLink = ({ children, href, innerItems }) => {
  const [open, setOpen] = useState(false);
  const showFlyout = innerItems && innerItems.length > 0 && open;

  return (
    <div
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      className="relative h-full flex items-center"
    >
      {href.includes("about") || href.includes("features") || href.includes("contact") ? (
        <Link
          href={`/#${href}`}
          className="flex items-center text-gray-300 hover:text-white transition-colors py-2"
        >
          {children}
        </Link>
      ) : (
        <button className="flex items-center text-gray-300 hover:text-white transition-colors">
          {children}
          {innerItems && innerItems.length > 0 && (
            <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
          )}
        </button>
      )}

      <AnimatePresence>
        {showFlyout && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute left-0 top-full w-64 bg-black border border-gray-800 shadow-xl rounded-md"
            style={{ marginTop: "1rem" }}
          >
            <div className="p-3">
              {innerItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="block px-3 py-2 text-sm text-gray-300 hover:bg-gray-900 hover:text-white rounded-md transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MobileAccordionLink = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-800">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-3 py-2 text-base font-medium text-white"
      >
        {item.name}
        <ChevronDown
          className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden bg-gray-900"
          >
            <div className="px-4 py-2">
              {item.innerItems.map((subItem, index) => (
                <Link
                  key={index}
                  href={subItem.href}
                  className="block px-3 py-2 text-sm text-gray-300 hover:text-white"
                >
                  {subItem.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};