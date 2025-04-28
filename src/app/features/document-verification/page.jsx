"use client";
import React from 'react';
import Link from 'next/link';
import { FileCheck, ArrowRight } from 'lucide-react';
import Footer from '@/components/other/Footer';
import Navbar from '@/components/other/Navbar';
import { motion } from 'framer-motion';

export default function DocumentVerification() {
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
            <FileCheck className="h-16 w-16 mx-auto mb-4 text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold mb-4">Document Verification</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Advanced verification and validation of document authenticity
          </p>
        </motion.div>

        <h2 className="text-3xl font-bold text-white mb-8 text-center">Why Choose Our Document Verification?</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div 
            className="bg-gray-100 p-8 rounded-lg"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="flex items-start">
              <div className="bg-black text-white p-3 rounded-full mr-4">
                <FileCheck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">Digital Signature Verification</h3>
                <p className="text-gray-700">Verify the authenticity of digital signatures with advanced cryptographic techniques.</p>
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
                <FileCheck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">Document Integrity Check</h3>
                <p className="text-gray-700">Ensure documents haven't been tampered with using cryptographic hashing and blockchain verification.</p>
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
                <FileCheck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">Automated Validation</h3>
                <p className="text-gray-700">Automatically validate document formats, signatures, and content against predefined rules.</p>
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
                <FileCheck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">Compliance Verification</h3>
                <p className="text-gray-700">Verify documents against regulatory requirements and industry standards automatically.</p>
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
      </div>
      <Footer />
    </div>
  );
} 