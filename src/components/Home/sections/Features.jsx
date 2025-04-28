"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Fingerprint, 
  Upload, 
  Link as LinkIcon, 
  History, 
  Lock, 
  Shield, 
  Database, 
  FileSearch 
} from 'lucide-react';

const Features = () => {
  // Feature data with Lucide icons
  const features = [
    {
      icon: <Fingerprint size={32} />,
      title: "Multi-Factor Authentication",
      description: "Advanced identity verification with biometric options ensures only authorized personnel can access sensitive records."
    },
    {
      icon: <Upload size={32} />,
      title: "Secure Document Upload",
      description: "End-to-end encrypted document upload with format validation and automatic classification."
    },
    {
      icon: <LinkIcon size={32} />,
      title: "Blockchain Verification",
      description: "Each document is cryptographically linked to the blockchain, providing tamper-proof verification of authenticity."
    },
    {
      icon: <History size={32} />,
      title: "Complete Audit Trail",
      description: "Every view, edit, and access attempt is permanently recorded with timestamp and user identification."
    },
    {
      icon: <Lock size={32} />,
      title: "Smart Contract Access Control",
      description: "Granular permissions management through blockchain-based smart contracts with automated access expiration."
    },
    {
      icon: <Shield size={32} />,
      title: "Military-Grade Encryption",
      description: "Documents are protected with AES-256 encryption and fragmented storage across the network."
    },
    {
      icon: <Database size={32} />,
      title: "Distributed Storage",
      description: "Records are stored across multiple nodes, eliminating single points of failure and ensuring 24/7 availability."
    },
    {
      icon: <FileSearch size={32} />,
      title: "Instant Document Retrieval",
      description: "Advanced search algorithms and indexed metadata allow for near-instantaneous document retrieval."
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 text-black">
            Blockchain-Powered Features
          </h2>
          <div className="h-1 w-20 bg-black mx-auto mb-6"></div>
          <p className="text-xl text-gray-700">
            Chain Vault brings cutting-edge technology to legal record management, providing unmatched security and efficiency.
          </p>
        </motion.div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:border-black transition-all duration-300 h-full"
            >
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-black text-white mb-6">
                {feature.icon}
              </div>
              <h3 className="font-bold text-xl text-black mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-700">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <a 
            href="#contact" 
            className="inline-flex items-center px-6 py-3 bg-black text-white font-medium rounded-md hover:bg-gray-800 transition-colors"
          >
            Schedule a Demo
            <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;