"use client";
import React from 'react';
import Link from 'next/link';
import { History, ArrowRight, Shield, FileText, AlertCircle, Clock } from 'lucide-react';
import Footer from '@/components/other/Footer';
import Navbar from '@/components/other/Navbar';
import { motion } from 'framer-motion';

export default function AuditTrail() {
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
            <History className="h-16 w-16 mx-auto mb-4 text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold mb-4">Audit Trail</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Comprehensive tracking and logging of all document activities with complete transparency
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div 
            className="bg-gray-100 p-8 rounded-lg"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="flex items-start">
              <div className="bg-black text-white p-3 rounded-full mr-4">
                <History className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">Complete Activity Logging</h3>
                <p className="text-gray-700">Track every action taken on your documents, from creation to deletion, with detailed timestamps and user information.</p>
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
                <AlertCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">Real-Time Monitoring</h3>
                <p className="text-gray-700">Monitor document activities in real-time with instant notifications for important events and changes.</p>
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
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">Compliance Reporting</h3>
                <p className="text-gray-700">Generate detailed compliance reports with customizable filters and export options for regulatory requirements.</p>
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
                <h3 className="text-xl font-semibold text-black mb-2">Forensic Analysis</h3>
                <p className="text-gray-700">Access comprehensive audit data for forensic analysis and investigation of security incidents.</p>
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