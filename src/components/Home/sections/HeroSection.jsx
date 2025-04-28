"use client";
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield, Lock, FileText, History } from 'lucide-react';

// Hero service items
const heroItems = [
  {
    icon: <Shield className="h-8 w-8 text-gray-800" />,
    title: "Secure Storage",
    href: "/services/storage"
  },
  {
    icon: <Lock className="h-8 w-8 text-gray-800" />,
    title: "Access Control",
    href: "/services/access"
  },
  {
    icon: <FileText className="h-8 w-8 text-gray-800" />,
    title: "Document Verification",
    href: "/services/verify"
  },
  {
    icon: <History className="h-8 w-8 text-gray-800" />,
    title: "Audit Trails",
    href: "/services/audit"
  }
];

export default function HeroSection() {
  return (
    <div className="relative bg-black text-white min-h-screen flex flex-col justify-center">
      {/* Abstract background pattern */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <svg
          className="absolute w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.path
              key={i}
              d={`M${i * 5},0 Q${i * 5 + 2.5},50 ${i * 5},100`}
              stroke="white"
              strokeWidth="0.2"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: 1, 
                opacity: 0.8,
                transition: { 
                  duration: 2.5,
                  delay: i * 0.1,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "reverse"
                }
              }}
            />
          ))}
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
              <span className="block">Secure Your Legal Records</span>
              <span className="block text-gray-400">On The Blockchain</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto"
          >
            Chain Vault provides immutable, tamper-proof storage for your most important legal documents with advanced permissions management and complete audit trails.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center gap-4 mb-16"
          >
            <Link href="/auth/signup" className="px-8 py-3 bg-white text-black font-medium rounded-md hover:bg-gray-200 transition-colors duration-300">
              Get Started
            </Link>
            <Link href="#features" className="px-8 py-3 bg-transparent border border-white text-white font-medium rounded-md hover:bg-white hover:text-black transition-colors duration-300">
              Learn More
            </Link>
          </motion.div>
        </div>

        {/* Service cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12"
        >
          {heroItems.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -10, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              transition={{ duration: 0.2 }}
              className="bg-white text-black rounded-lg shadow-lg overflow-hidden"
            >
              <Link href={item.href} className="block p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-gray-100 p-3 rounded-full mb-4">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Animated scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex flex-col items-center"
          >
            <span className="text-sm text-gray-400 mb-2">Scroll to explore</span>
            <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center p-1">
              <motion.div
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1 h-2 bg-white rounded-full"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}