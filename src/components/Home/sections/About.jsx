"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Clock, 
  Fingerprint, 
  Lock,
  Users,
  Award
} from 'lucide-react';

export default function About() {
  // Team members data
  const teamMembers = [
    {
      name: "Sarthak Khare",
      role: "Blockchain Developer",
      image: "https://media.licdn.com/dms/image/v2/D4D03AQFUHnGdTJC5hw/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1716127531824?e=1751500800&v=beta&t=IYPrVgdhU0Cmhf-Ln-JY9T69w1SUQZ15zdSedJDzN2A",
      bio: "Specializing in building secure and scalable blockchain solutions. Branch: ICB."
    },
    {
      name: "Pankaj Kumar",
      role: "Node.js Backend Developer",
      image: "https://media.licdn.com/dms/image/v2/D4D03AQF8ioZlpm0ZAg/profile-displayphoto-shrink_400_400/B4DZQl6vngGkAk-/0/1735802944952?e=1751500800&v=beta&t=rIV0PpGKgm2KncxAZtF56RcqBpShMvffAwPPKdaoarw",
      bio: "Focused on building robust and efficient server-side applications. Branch: ICB."
    },
    {
      name: "Aditi Gupta",
      role: "Next.js UI Developer",
      image: "https://media.licdn.com/dms/image/v2/D4D35AQHqhMh8Vkc2-g/profile-framedphoto-shrink_400_400/profile-framedphoto-shrink_400_400/0/1726596637116?e=1746439200&v=beta&t=931WwJ61XAeUnuLAEZTwZo2l44IvZ8bpbxQi7ECzyp8",
      bio: "Dedicated to creating responsive and user-friendly web interfaces. Branch: ICB."
    },
    {
      name: "Dishita Joshi",
      role: "Next.js UI Developer",
      image: "https://media.licdn.com/dms/image/v2/D4D35AQG8n9cRW_Rt1g/profile-framedphoto-shrink_400_400/profile-framedphoto-shrink_400_400/0/1730099268860?e=1746439200&v=beta&t=DBI0EWB82CILEuTnvbDzw2V3ySCGngIR6MvpbWW1FbM",
      bio: "Passionate about developing dynamic and modern web applications. Branch: ICB."
    }
  ];
  
  // Timeline data
  const timeline = [
    {
      phase: "July 2024",
      title: "Project Initiation",
      description: "Idea conceptualization, requirement gathering, and initial project planning."
    },
    {
      phase: "August - October 2024",
      title: "Core Development",
      description: "Development of blockchain system, backend APIs using Node.js, and frontend UI with Next.js."
    },
    {
      phase: "November 2024 - January 2025",
      title: "Integration & Testing",
      description: "Integrating blockchain with backend, connecting frontend interfaces, and rigorous testing."
    },
    {
      phase: "February - March 2025",
      title: "Optimization & Finalization",
      description: "Performance tuning, bug fixing, documentation, and preparing the final project deliverables."
    },
    {
      phase: "April 2025",
      title: "Project Completion",
      description: "Final presentation, submission, and deployment of the major project."
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
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mission and Vision */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl font-bold mb-6 text-black">Our Mission</h2>
          <p className="text-xl text-gray-700 mb-8">
            Chain Vault is revolutionizing legal record management through blockchain technology, 
            providing unparalleled security, transparency, and accessibility for organizations 
            that handle sensitive legal documents.
          </p>
          <div className="border-t border-b border-gray-200 py-6">
            <p className="text-2xl font-light italic text-gray-600">
              "Securing tomorrow's legal documents with today's most advanced technology."
            </p>
          </div>
        </motion.div>

        {/* Key Values */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
        >
          <motion.div
            variants={itemVariants}
            className="bg-white p-8 rounded-lg shadow-sm border border-gray-100"
          >
            <ShieldCheck className="h-12 w-12 text-black mb-6" />
            <h3 className="text-xl font-bold mb-3">Security First</h3>
            <p className="text-gray-600">
              We prioritize the security of your legal documents with military-grade encryption and blockchain verification.
            </p>
          </motion.div>
          
          <motion.div
            variants={itemVariants}
            className="bg-white p-8 rounded-lg shadow-sm border border-gray-100"
          >
            <Clock className="h-12 w-12 text-black mb-6" />
            <h3 className="text-xl font-bold mb-3">Immutable Records</h3>
            <p className="text-gray-600">
              Once stored on our blockchain, records cannot be altered or deleted, ensuring complete auditability and traceability.
            </p>
          </motion.div>
          
          <motion.div
            variants={itemVariants}
            className="bg-white p-8 rounded-lg shadow-sm border border-gray-100"
          >
            <Lock className="h-12 w-12 text-black mb-6" />
            <h3 className="text-xl font-bold mb-3">Privacy Controlled</h3>
            <p className="text-gray-600">
              Smart contracts enable granular access control, allowing you to decide exactly who can view or modify each document.
            </p>
          </motion.div>
        </motion.div>

        {/* Company Timeline */}
        <div className="mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold mb-12 text-center"
          >
            Our Journey
          </motion.h2>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gray-200"></div>
            
            {/* Timeline items */}
            <div className="relative z-10">
              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`mb-12 flex items-center ${
                    index % 2 === 0 ? "justify-start" : "justify-end"
                  }`}
                >
                  <div className={`w-5/12 ${index % 2 === 0 ? "text-right pr-8" : "text-left pl-8"}`}>
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                      <div className="text-2xl font-bold text-black mb-1">{item.phase}</div>
                      <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                  
                  {/* Center dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-black border-4 border-white"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Our Leadership Team</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            We bring together experts in blockchain technology, cybersecurity, and legal compliance to provide the most secure document management solution.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-lg overflow-hidden shadow-sm"
              >
                <div className="bg-gray-100 h-64 flex items-center justify-center ">
                 <img src={member.image} alt="" className=' rounded-full w-full h-full' />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-gray-500 mb-4">{member.role}</p>
                  <p className="text-gray-600">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Clients & Partners */}
    
      </div>
    </section>
  );
}