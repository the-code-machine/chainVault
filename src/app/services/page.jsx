"use client";
import React, { useState, useEffect } from 'react';
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
  Upload,
  Wallet,
  ExternalLink
} from 'lucide-react';
import Web3 from 'web3';
import { useAppSelector } from '@/redux/hooks';
import UserProfile from '@/components/utlis/UserProfile';
import UploadDocumentModal from '@/components/utlis/UploadDocumentModal';
import toast from 'react-hot-toast';
import { DocumentAddress, MintAbi } from '@/contracts/ABIs/mint';
export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('recent');
  const [documents, setDocuments] = useState([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingWallet, setLoadingWallet] = useState(false);
  const [recentActivity, setRecentActivity] = useState([]);
  
  const user = useAppSelector((state) => state.user);
  
  // Fetch documents on component mount
  useEffect(() => {
    if (user?.ethreumAddress) {
      fetchDocuments();
    }
  }, [user?.ethreumAddress]);

  // Fetch documents from blockchain
  const fetchDocuments = async () => {
    if (!user?.ethreumAddress) {
      return;
    }

    try {
      setLoading(true);
      
      // Initialize Web3
      const web3 = new Web3(window.ethereum);
      const documentContract = new web3.eth.Contract(MintAbi, DocumentAddress);

      // Get documents owned/viewable/modifiable by the user
      const ownedTokens = await documentContract.methods.tokensOfOwner(user.ethreumAddress).call();
      const viewableTokens = await documentContract.methods.tokensOfViewer(user.ethreumAddress).call();
      const modifiableTokens = await documentContract.methods.tokensOfModifier(user.ethreumAddress).call();
      
      // Combine all tokens and remove duplicates
      const allTokenIds = [...new Set([...ownedTokens, ...viewableTokens, ...modifiableTokens])];
      
      // Fetch document details for each token
      const documentsData = await Promise.all(
        allTokenIds.map(async (tokenId) => {
          // Get IPFS hash
          const ipfsHash = await documentContract.methods.tokenURI(tokenId).call();
      
          // Get document logs
          const logs = await documentContract.methods.getDocumentLogs(tokenId).call();
      
          // Get permissions
          const canUserView = await documentContract.methods.canView(tokenId, user.ethreumAddress).call();
          const canUserModify = await documentContract.methods.canModify(tokenId, user.ethreumAddress).call();
          const authorAddress = await documentContract.methods.tokenAuthor(tokenId).call();
      
          // 🆕 Fetch viewers and modifiers just to count them
          let viewers = [];
          let modifiers = [];
          try {
            viewers = await documentContract.methods.getViewers(tokenId).call();
            modifiers = await documentContract.methods.getModifiers(tokenId).call();
          } catch (error) {
            console.error(`Failed to fetch viewers/modifiers for token ${tokenId}`, error);
          }
      
          // Only use length
          const sharedCount = new Set([...viewers, ...modifiers]).size;
           console.log(viewers, modifiers, sharedCount)
          // Mock name and type logic
          let metadata = { name: `Document-${tokenId}` };
          const fileExtension = metadata.name ? metadata.name.split('.').pop().toUpperCase() : "";
          const fileType = fileExtension === "PDF" ? "PDF" :
                          (fileExtension === "DOCX" || fileExtension === "DOC") ? "DOCX" :
                          "Other";
      
          const lastModified = logs.length > 0 
            ? new Date(parseInt(logs[logs.length - 1].timestamp) * 1000).toLocaleString()
            : "Unknown";
      
          return {
            id: tokenId,
            name: metadata.name || `Document-${tokenId}`,
            type: fileType,
            size: metadata.size || "Unknown",
            dateModified: lastModified,
            status: 'verified',
            ipfsHash,
            authorAddress,
            canView: canUserView,
            canModify: canUserModify,
            logs,
            sharedWith: sharedCount   // 🆕 Only number (count)
          };
        })
      );
      
      setDocuments(documentsData);
      
      // Extract activity logs
      const allLogs = documentsData.flatMap(doc => 
        doc.logs.map(log => ({
          id: `${doc.id}-${log.timestamp}`,
          action: log.action,
          document: doc.name,
          user: log.account === user.ethreumAddress ? 'You' : `${log.account.substring(0, 6)}...${log.account.substring(log.account.length - 4)}`,
          time: new Date(parseInt(log.timestamp) * 1000).toLocaleString()
        }))
      );
      
      // Sort by timestamp (newest first) and take the latest 10
      const latestLogs = allLogs.sort((a, b) => {
        const timeA = new Date(a.time).getTime();
        const timeB = new Date(b.time).getTime();
        return timeB - timeA;
      }).slice(0, 10);
      
      setRecentActivity(latestLogs);
      
    } catch (error) {
      console.error("Error fetching documents:", error);
      toast.error("Failed to fetch documents");
    } finally {
      setLoading(false);
    }
  };

  // Connect wallet if not already connected
  const connectWallet = async () => {
    if (!window.ethereum) {
      toast.error("MetaMask is not installed");
      return;
    }
    
    try {
      setLoadingWallet(true);
      
      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      const address = accounts[0];
      
      // Update the user's Ethereum address in the backend
      const response = await fetch('/api/wallet/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ethreumAddress: address }),
      });
      
      if (response.ok) {
        toast.success("Wallet connected successfully");
        fetchDocuments(); // Refresh documents after connecting wallet
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to connect wallet");
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast.error("Failed to connect wallet");
    } finally {
      setLoadingWallet(false);
    }
  };
  
  // Shortern Ethereum address for display
  const shortenAddress = (address) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

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

  // Function to handle the refresh after uploading a new document
  const handleDocumentUploaded = () => {
    fetchDocuments();
  };

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Welcome section */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.firstName || 'User'}
          </h1>
          
          <div className="flex space-x-3 items-center">
            {/* Wallet status */}
            {user?.ethreumAddress ? (
              <div className="flex items-center bg-gray-100 rounded-md px-3 py-1.5 mr-2">
                <Wallet className="h-4 w-4 text-gray-600 mr-2" />
                <span className="text-sm text-gray-600 mr-1">
                  {shortenAddress(user.ethreumAddress)}
                </span>
                <a 
                  href={`https://etherscan.io/address/${user.ethreumAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-600"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                disabled={loadingWallet}
                className="flex items-center space-x-1 bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1.5 rounded-md text-sm transition mr-2"
              >
                <Wallet className="h-4 w-4 mr-1" />
                <span>{loadingWallet ? "Connecting..." : "Connect Wallet"}</span>
              </button>
            )}
            
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
            
            <button 
              onClick={() => setIsUploadModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
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
                        {documents.length}
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
                        {documents.filter(doc => doc.status === 'verified').length}
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
                        {documents.filter(doc => doc.authorAddress !== user?.ethreumAddress).length}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Empty state when wallet not connected */}
        {!user?.ethreumAddress && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <Wallet className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No wallet connected</h3>
            <p className="mt-1 text-sm text-gray-500">
              Connect your MetaMask wallet to view and manage your documents
            </p>
            <div className="mt-6">
              <button
                onClick={connectWallet}
                disabled={loadingWallet}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              >
                <Wallet className="mr-2 h-5 w-5" />
                {loadingWallet ? "Connecting..." : "Connect Wallet"}
              </button>
            </div>
          </div>
        )}
        
        {/* Loading state */}
        {loading && user?.ethreumAddress && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-2 text-gray-600">Loading documents...</p>
          </div>
        )}
        
        {/* Empty state when no documents */}
        {!loading && user?.ethreumAddress && documents.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No documents yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Upload your first document to get started
            </p>
            <div className="mt-6">
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              >
                <Plus className="mr-2 h-5 w-5" />
                Upload Document
              </button>
            </div>
          </div>
        )}
        
        {/* Document content when documents exist */}
        {!loading && user?.ethreumAddress && documents.length > 0 && (
          <>
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
                        Owner
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {documents
                      .filter(doc => {
                        if (activeTab === 'recent') return true;
                        if (activeTab === 'shared') return doc.authorAddress === user.ethreumAddress && doc.sharedWith > 0;
                        return false;
                      })
                      .map((doc) => (
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
                            {doc.authorAddress === user.ethreumAddress 
                              ? "You" 
                              : shortenAddress(doc.authorAddress)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex space-x-3 justify-end">
                              {doc.canView && (
                                <a 
                                  href={`https://ipfs.io/ipfs/${doc.ipfsHash}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-gray-400 hover:text-gray-500"
                                  title="View"
                                >
                                  <Eye className="h-5 w-5" />
                                </a>
                              )}
                              {doc.canView && (
                                <a 
                                  href={`https://ipfs.io/ipfs/${doc.ipfsHash}?download=true`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-gray-400 hover:text-gray-500"
                                  title="Download"
                                >
                                  <Download className="h-5 w-5" />
                                </a>
                              )}
                          
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
                  {recentActivity.length > 0 ? (
                    recentActivity.map((activity) => (
                      <li key={activity.id} className="p-4 hover:bg-gray-50">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            {activity.action === 'View' && (
                              <div className="p-2 rounded-full bg-blue-100">
                                <Eye className="h-5 w-5 text-blue-500" />
                              </div>
                            )}
                            {activity.action === 'Grant' && (
                              <div className="p-2 rounded-full bg-green-100">
                                <Users className="h-5 w-5 text-green-500" />
                              </div>
                            )}
                            {activity.action === 'Upload' && (
                              <div className="p-2 rounded-full bg-purple-100">
                                <Upload className="h-5 w-5 text-purple-500" />
                              </div>
                            )}
                            {activity.action === 'Verify' && (
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
                    ))
                  ) : (
                    <li className="py-8 text-center text-gray-500">
                      No activity recorded yet
                    </li>
                  )}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Upload Document Modal */}
      <UploadDocumentModal 
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={handleDocumentUploaded}
      />
    </main>
  );
}
