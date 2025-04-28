"use client";
import React from 'react';
import Link from 'next/link';
import { Lock, ArrowRight } from 'lucide-react';
import Footer from '@/components/other/Footer';
import Navbar from '@/components/other/Navbar';
import { motion } from 'framer-motion';

export default function AccessControl() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Lock className="h-16 w-16 mx-auto mb-4 text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold mb-4">Access Control</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Granular permissions and role-based access for complete control over your documents
          </p>
        </motion.div>

        <h2 className="text-3xl font-bold text-white mb-8 text-center">Why Choose Our Access Control?</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div 
            className="bg-gray-100 p-8 rounded-lg"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="flex items-start">
              <div className="bg-black text-white p-3 rounded-full mr-4">
                <Lock className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">Role-Based Access</h3>
                <p className="text-gray-700">Define custom roles with specific permissions to ensure users only have access to the documents they need.</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-gray-100 p-8 rounded-lg"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex items-start">
              <div className="bg-black text-white p-3 rounded-full mr-4">
                <Lock className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">Multi-Factor Authentication</h3>
                <p className="text-gray-700">Add an extra layer of security with MFA, ensuring only authorized users can access sensitive documents.</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-gray-100 p-8 rounded-lg"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="flex items-start">
              <div className="bg-black text-white p-3 rounded-full mr-4">
                <Lock className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">Granular Permissions</h3>
                <p className="text-gray-700">Set detailed access controls for each document, including view, edit, and share permissions.</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-gray-100 p-8 rounded-lg"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            <div className="flex items-start">
              <div className="bg-black text-white p-3 rounded-full mr-4">
                <Lock className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">Access Logging</h3>
                <p className="text-gray-700">Track and monitor all document access attempts with detailed audit logs for complete visibility.</p>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="mt-12 text-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link 
            href="/"
            className="inline-flex items-center bg-black hover:bg-gray-900 text-white px-8 py-4 rounded-lg transition-colors duration-200"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </motion.div>

        {/* Additional Content */}
        <motion.div 
          className="mt-20"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Access Management Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Role Management",
                description: "Create and manage custom roles with specific permissions for different user groups."
              },
              {
                title: "Access Logs",
                description: "Detailed logging of all access attempts and document interactions for audit purposes."
              },
              {
                title: "Temporary Access",
                description: "Grant time-limited access to external users with automatic expiration."
              }
            ].map((item, index) => (
              <motion.div 
                key={index}
                className="bg-gray-100 p-6 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1 + index * 0.2 }}
                whileHover={{ scale: 1.05 }}
              >
                <h3 className="text-xl font-semibold mb-4 text-black">{item.title}</h3>
                <p className="text-gray-700">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
} 