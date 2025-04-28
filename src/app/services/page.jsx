"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Files, 
  Share2, 
  Clock, 
  FileText, 
  Plus, 
  Search, 
  Settings, 
  ChevronDown, 
  Download, 
  Eye, 
  AlertTriangle, 
  CheckCircle,
  Folder,
  Users,
  Bell,
  LogOut,
  User
} from 'lucide-react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('recent');
  
  // Mock data for recent documents
  const recentDocuments = [
    { 
      id: 1, 
      name: 'Contract_Agreement_2025.pdf', 
      type: 'PDF', 
      size: '2.4 MB', 
      dateModified: 'Today at 10:23 AM',
      status: 'verified',
      sharedWith: 3
    },
    { 
      id: 2, 
      name: 'Legal_Brief_Case123.docx', 
      type: 'DOCX', 
      size: '1.8 MB', 
      dateModified: 'Yesterday at 3:45 PM',
      status: 'verified',
      sharedWith: 2
    },
    { 
      id: 3, 
      name: 'NDA_TechPartner_2025.pdf', 
      type: 'PDF', 
      size: '3.2 MB', 
      dateModified: 'Apr 25, 2025',
      status: 'pending',
      sharedWith: 0
    },
    { 
      id: 4, 
      name: 'Patent_Application_Draft.docx', 
      type: 'DOCX', 
      size: '5.7 MB', 
      dateModified: 'Apr 23, 2025',
      status: 'verified',
      sharedWith: 5
    },
    { 
      id: 5, 
      name: 'Financial_Disclosure_Q1_2025.pdf', 
      type: 'PDF', 
      size: '8.1 MB', 
      dateModified: 'Apr 20, 2025',
      status: 'verified',
      sharedWith: 1
    }
  ];
  
  // Mock user data
  const userData = {
    name: 'Alex Miller',
    email: 'alex.miller@example.com',
    role: 'Legal Administrator',
    storageUsed: 68, // percentage
    documentsTotal: 128,
    documentsVerified: 112
  };
  
  // Mock recent activities
  const recentActivity = [
    { 
      id: 1,
      action: 'Document Viewed',
      document: 'Contract_Agreement_2025.pdf',
      user: 'Sarah Johnson',
      time: '2 hours ago'
    },
    { 
      id: 2,
      action: 'Access Granted',
      document: 'Legal_Brief_Case123.docx',
      user: 'Robert Chen',
      time: '5 hours ago'
    },
    { 
      id: 3,
      action: 'Document Uploaded',
      document: 'NDA_TechPartner_2025.pdf',
      user: 'You',
      time: 'Yesterday at 3:45 PM'
    },
    { 
      id: 4,
      action: 'Document Verification',
      document: 'Patent_Application_Draft.docx',
      user: 'Blockchain System',
      time: 'Yesterday at 4:12 PM'
    }
  ];
  
  // File icon helper
  const getFileIcon = (type) => {
    switch(type) {
      case 'PDF':
        return <FileText className="h-10 w-10 text-red-500" />;
      case 'DOCX':
        return <FileText className="h-10 w-10 text-blue-500" />;
      default:
        return <FileText className="h-10 w-10 text-gray-500" />;
    }
  };
  
  // Status badge helper
  const getStatusBadge = (status) => {
    switch(status) {
      case 'verified':
        return (
          <span className="flex items-center text-green-700 bg-green-100 px-2 py-1 rounded text-xs">
            <CheckCircle className="h-3 w-3 mr-1" /> Verified
          </span>
        );
      case 'pending':
        return (
          <span className="flex items-center text-yellow-700 bg-yellow-100 px-2 py-1 rounded text-xs">
            <Clock className="h-3 w-3 mr-1" /> Pending
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top navigation */}
 
      
      <div className="flex">
        {/* Sidebar */}
    
        
        {/* Main content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Welcome section */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Welcome back, {userData.name.split(' ')[0]}</h1>
              
              <div className="flex space-x-2">
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="focus:ring-black focus:border-black block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2"
                    placeholder="Search documents..."
                  />
                </div>
                
                <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
                  <Plus className="-ml-1 mr-2 h-5 w-5" />
                  Upload
                </button>
              </div>
            </div>
            
            {/* Stats overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-black rounded-md p-3">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Total Documents
                        </dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">
                            {userData.documentsTotal}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                      <CheckCircle className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Verified Documents
                        </dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">
                            {userData.documentsVerified}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                      <Share2 className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Shared With You
                        </dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">
                            16
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Tabs for documents */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('recent')}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'recent'
                      ? 'border-black text-black'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Recent Documents
                </button>
                <button
                  onClick={() => setActiveTab('shared')}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'shared'
                      ? 'border-black text-black'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Shared With Others
                </button>
                <button
                  onClick={() => setActiveTab('activity')}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'activity'
                      ? 'border-black text-black'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Recent Activity
                </button>
              </nav>
            </div>
            
            {/* Documents table */}
            {(activeTab === 'recent' || activeTab === 'shared') && (
              <div className="bg-white shadow overflow-hidden rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Shared With
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Modified
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Size
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentDocuments.map((doc) => (
                      <tr key={doc.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              {getFileIcon(doc.type)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{doc.name}</div>
                              <div className="text-sm text-gray-500">{doc.type} Document</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(doc.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {doc.sharedWith > 0 ? (
                            <div className="flex items-center">
                              <span className="bg-gray-200 text-gray-700 py-1 px-2 rounded-full text-xs">
                                {doc.sharedWith} users
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-500 text-sm">Not shared</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {doc.dateModified}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {doc.size}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex space-x-3">
                            <button className="text-gray-400 hover:text-gray-500">
                              <Eye className="h-5 w-5" />
                            </button>
                            <button className="text-gray-400 hover:text-gray-500">
                              <Download className="h-5 w-5" />
                            </button>
                            <button className="text-gray-400 hover:text-gray-500">
                              <Share2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {/* Activity feed */}
            {activeTab === 'activity' && (
              <div className="bg-white shadow overflow-hidden rounded-lg">
                <ul className="divide-y divide-gray-200">
                  {recentActivity.map((activity) => (
                    <li key={activity.id} className="p-4 hover:bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          {activity.action === 'Document Viewed' && (
                            <div className="p-2 rounded-full bg-blue-100">
                              <Eye className="h-5 w-5 text-blue-500" />
                            </div>
                          )}
                          {activity.action === 'Access Granted' && (
                            <div className="p-2 rounded-full bg-green-100">
                              <Users className="h-5 w-5 text-green-500" />
                            </div>
                          )}
                          {activity.action === 'Document Uploaded' && (
                            <div className="p-2 rounded-full bg-purple-100">
                              <Upload className="h-5 w-5 text-purple-500" />
                            </div>
                          )}
                          {activity.action === 'Document Verification' && (
                            <div className="p-2 rounded-full bg-yellow-100">
                              <Shield className="h-5 w-5 text-yellow-500" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {activity.action}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {activity.document} by {activity.user}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <span className="text-sm text-gray-500">{activity.time}</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}