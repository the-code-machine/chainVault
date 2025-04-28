"use client";
import React from 'react';
import Link from 'next/link';
import { Shield, ArrowRight } from 'lucide-react';
import Footer from '@/components/other/Footer';
import Navbar from '@/components/other/Navbar';
import { motion } from 'framer-motion';

export default function SecureStorage() {
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
            <Shield className="h-16 w-16 mx-auto mb-4 text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold mb-4">Secure Storage</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Military-grade encryption and blockchain technology for your most sensitive documents
          </p>
        </motion.div>

        <h2 className="text-3xl font-bold text-white mb-8 text-center">Why Choose Our Secure Storage?</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div 
            className="bg-gray-100 p-8 rounded-lg"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="flex items-start">
              <div className="bg-black text-white p-3 rounded-full mr-4">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">Military-Grade Encryption</h3>
                <p className="text-gray-700">Your documents are protected with state-of-the-art encryption algorithms, ensuring they remain secure even in the most demanding environments.</p>
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
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">Blockchain Technology</h3>
                <p className="text-gray-700">Leverage the power of blockchain for immutable document storage and verification, providing an unalterable record of your data.</p>
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
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">Distributed Storage</h3>
                <p className="text-gray-700">Your data is stored across multiple secure locations, ensuring redundancy and protection against data loss or system failures.</p>
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
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">Immutable Records</h3>
                <p className="text-gray-700">Once stored, your documents cannot be altered or deleted, providing a permanent and tamper-proof record of your data.</p>
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
          <h2 className="text-3xl font-bold mb-8 text-center">Advanced Security Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Encryption",
                description: "Military-grade encryption ensures your documents are protected at rest and in transit."
              },
              {
                title: "Blockchain",
                description: "Blockchain technology provides immutable records and tamper-proof verification."
              },
              {
                title: "Redundancy",
                description: "Distributed storage with multiple backups ensures your data is always available."
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