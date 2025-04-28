"use client";
import React from 'react';
import Link from 'next/link';
import { File, ArrowRight } from 'lucide-react';
import Footer from '@/components/other/Footer';
import Navbar from '@/components/other/Navbar';
import { motion } from 'framer-motion';

export default function LegalFirms() {
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
            <File className="h-16 w-16 mx-auto mb-4 text-blue-500" />
          </motion.div>
          <h1 className="text-4xl font-bold mb-4">Legal Firms Solution</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Secure and efficient document management for legal professionals
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-stretch">
          <motion.div 
            className="bg-gray-100 p-8 rounded-lg h-full"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2 className="text-2xl font-semibold text-black mb-6">Key Features</h2>
            <ul className="space-y-4">
              {[
                "Secure document storage and sharing",
                "Client confidentiality protection",
                "Case file management",
                "Digital signature verification",
                "Document version history"
              ].map((feature, index) => (
                <motion.li 
                  key={index}
                  className="flex items-start"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                >
                  <span className="text-blue-500 mr-2">•</span>
                  <span className="text-gray-800">{feature}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div 
            className="bg-gray-100 p-8 rounded-lg h-full"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <h3 className="text-2xl font-semibold mb-6 text-black">Why Choose Our Solution?</h3>
            <p className="text-gray-700 mb-6">
              Our legal firms solution provides a secure, blockchain-based platform for
              managing sensitive legal documents. With advanced encryption and access
              controls, you can ensure client confidentiality while streamlining your
              document workflow.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                href="/"
                className="inline-flex items-center bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg transition-colors duration-200"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Additional Content */}
        <motion.div 
          className="mt-20"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Streamlined Legal Operations</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Case Management",
                description: "Organize and track case files with our intuitive interface and automated workflow tools."
              },
              {
                title: "Client Collaboration",
                description: "Securely share documents with clients while maintaining complete control over access permissions."
              },
              {
                title: "Document Verification",
                description: "Verify the authenticity of legal documents using blockchain technology and digital signatures."
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