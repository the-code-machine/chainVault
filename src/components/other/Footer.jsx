"use client";
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Facebook, 
  Twitter, 
  Github, 
  Linkedin, 
  ArrowRight,
  Mail
} from 'lucide-react';

export default function Footer() {
  // Footer navigation items
  const footerNavs = [
    {
      label: "Company",
      items: [
        { name: "About", href: "about" },
        { name: "Careers", href: "/careers" },
        { name: "Press", href: "/press" },
        { name: "Blog", href: "/blog" }
      ]
    },
    {
      label: "Solutions",
      items: [
        { name: "Corporate Records", href: "/solutions/corporate" },
        { name: "Legal Firms", href: "/solutions/legal" },
        { name: "Government", href: "/solutions/government" },
        { name: "Healthcare", href: "/solutions/healthcare" }
      ]
    },
    {
      label: "Resources",
      items: [
        { name: "Documentation", href: "/docs" },
        { name: "API Reference", href: "/api" },
        { name: "White Paper", href: "/whitepaper" },
        { name: "Case Studies", href: "/case-studies" }
      ]
    },
    {
      label: "Legal",
      items: [
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Service", href: "/terms" },
        { name: "Security", href: "/security" },
        { name: "Compliance", href: "/compliance" }
      ]
    }
  ];

  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* Newsletter Section */}
        <div className="mb-16 px-4 py-8 border border-gray-800 rounded-xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0 md:w-1/2">
              <h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
              <p className="text-gray-400">
                Subscribe to our newsletter for the latest blockchain security updates.
              </p>
            </div>
            <div className="w-full md:w-1/2 max-w-md">
              <form className="flex">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="email"
                    className="block w-full bg-gray-900 border border-gray-700 rounded-l-md py-3 pl-10 pr-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                    placeholder="Your email"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-white text-black px-4 py-2 rounded-r-md hover:bg-gray-200 transition-colors flex items-center"
                >
                  Subscribe
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center mb-6">
              <Shield className="h-8 w-8 mr-2" />
              <span className="text-2xl font-bold">ChainVault</span>
            </Link>
            <p className="text-gray-400 mb-6">
              Blockchain-powered security for your most critical legal records and documents.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                aria-label="Facebook"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="#" 
                aria-label="Twitter"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Twitter size={20} />
              </a>
              <a 
                href="#" 
                aria-label="Github"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Github size={20} />
              </a>
              <a 
                href="#" 
                aria-label="LinkedIn"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Navigation Columns */}
          {footerNavs.map((nav, idx) => (
            <div key={idx} className="lg:col-span-1">
              <h4 className="text-lg font-semibold mb-6">{nav.label}</h4>
              <ul className="space-y-4">
                {nav.items.map((item, i) => (
                  <li key={i}>
                    {item.href.includes('about') || item.href.includes('features') || item.href.includes('contact') ? (
                      <a
                        href={`#${item.href}`}
                        className="text-gray-400 hover:text-white transition-colors flex items-center"
                      >
                        <span className="mr-2">&gt;</span>
                        {item.name}
                      </a>
                    ) : (
                      <Link
                        href={item.href}
                        className="text-gray-400 hover:text-white transition-colors flex items-center"
                      >
                        <span className="mr-2">&gt;</span>
                        {item.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 mb-4 md:mb-0">
            © {new Date().getFullYear()} ChainVault Inc. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
              Terms
            </Link>
            <Link href="/sitemap" className="text-gray-400 hover:text-white transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}