"use client";
import React, { useState, useEffect } from "react";
import {
  FileText,
  Share2,
  Search,
  Plus,
  Eye,
  Download,
  X,
  Users,
  UserPlus,
  Clock,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import Web3 from "web3";
import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { DocumentAddress, MintAbi } from "@/contracts/ABIs/mint";

export default function Shared() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const user = useAppSelector((state) => state.user);
  const router = useRouter();

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

      // Get documents owned by the user
      const ownedTokens = await documentContract.methods
        .tokensOfOwner(user.ethreumAddress)
        .call();

      // Fetch document details for each token
      const documentsData = await Promise.all(
        ownedTokens.map(async (tokenId) => {
          try {
            // Get IPFS hash
            const ipfsHash = await documentContract.methods
              .tokenURI(tokenId)
              .call();

            // Get author address
            const authorAddress = await documentContract.methods
              .tokenAuthor(tokenId)
              .call();

            // Skip if user is not the author (we only want documents the user has shared)
            if (
              authorAddress.toLowerCase() !== user.ethreumAddress.toLowerCase()
            ) {
              return null;
            }

            // Get shared users (viewers)
            let viewers = [];
            try {
              viewers = await documentContract.methods
                .getViewers(tokenId)
                .call();
              // Filter out zero address and current user
              viewers = viewers.filter(
                (addr) =>
                  addr !== "0x0000000000000000000000000000000000000000" &&
                  addr.toLowerCase() !== user.ethreumAddress.toLowerCase(),
              );
            } catch (error) {
              console.warn("Error getting viewers:", error);
            }

            // Get shared users (modifiers)
            let modifiers = [];
            try {
              modifiers = await documentContract.methods
                .getModifiers(tokenId)
                .call();
              // Filter out zero address, current user, and those already in viewers
              modifiers = modifiers.filter(
                (addr) =>
                  addr !== "0x0000000000000000000000000000000000000000" &&
                  addr.toLowerCase() !== user.ethreumAddress.toLowerCase() &&
                  !viewers.includes(addr),
              );
            } catch (error) {
              console.warn("Error getting modifiers:", error);
            }

            // Get document logs
            const logs = await documentContract.methods
              .getDocumentLogs(tokenId)
              .call();

            // Skip if no shares
            if (viewers.length === 0 && modifiers.length === 0) {
              return null;
            }

            // Mock name and type logic
            let fileName = `Document-${tokenId}`;
            let fileType = "Other";

            // Try to extract name from IPFS hash (if metadata is available)
            try {
              const metadataUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}/metadata.json`;
              const response = await fetch(metadataUrl);
              if (response.ok) {
                const metadata = await response.json();
                if (metadata.name) {
                  fileName = metadata.name;

                  // Determine document type from extension
                  const fileExtension = fileName.split(".").pop().toUpperCase();
                  if (fileExtension === "PDF") fileType = "PDF";
                  else if (["DOCX", "DOC"].includes(fileExtension))
                    fileType = "DOCX";
                }
              }
            } catch (error) {
              console.log("Error fetching metadata:", error);
            }

            const lastModified =
              logs.length > 0
                ? new Date(
                    parseInt(logs[logs.length - 1].timestamp) * 1000,
                  ).toLocaleString()
                : "Unknown";

            // Create collaborators list
            const collaborators = [
              ...viewers.map((addr) => ({
                address: addr,
                permission: "View",
              })),
              ...modifiers.map((addr) => ({
                address: addr,
                permission: "Modify",
              })),
            ];

            return {
              id: tokenId,
              name: fileName,
              type: fileType,
              dateModified: lastModified,
              status: "verified",
              ipfsHash,
              authorAddress,
              collaborators,
              sharedWith: collaborators.length,
              logs,
            };
          } catch (error) {
            console.error(`Error processing token ${tokenId}:`, error);
            return null;
          }
        }),
      );

      // Filter out nulls and sort by most recently modified
      const validDocuments = documentsData
        .filter((doc) => doc !== null)
        .sort((a, b) => {
          const dateA =
            a.dateModified !== "Unknown"
              ? new Date(a.dateModified).getTime()
              : 0;
          const dateB =
            b.dateModified !== "Unknown"
              ? new Date(b.dateModified).getTime()
              : 0;
          return dateB - dateA;
        });

      setDocuments(validDocuments);
    } catch (error) {
      console.error("Error fetching documents:", error);
      toast.error("Failed to fetch shared documents");
    } finally {
      setLoading(false);
    }
  };

  // File icon helper
  const getFileIcon = (type) => {
    switch (type) {
      case "PDF":
        return <FileText className="h-10 w-10 text-red-500" />;
      case "DOCX":
        return <FileText className="h-10 w-10 text-blue-500" />;
      default:
        return <FileText className="h-10 w-10 text-gray-500" />;
    }
  };

  // Status badge helper
  const getStatusBadge = (status) => {
    switch (status) {
      case "verified":
        return (
          <span className="flex items-center text-green-700 bg-green-100 px-2 py-1 rounded text-xs">
            <CheckCircle className="h-3 w-3 mr-1" /> Verified
          </span>
        );
      case "pending":
        return (
          <span className="flex items-center text-yellow-700 bg-yellow-100 px-2 py-1 rounded text-xs">
            <Clock className="h-3 w-3 mr-1" /> Pending
          </span>
        );
      default:
        return null;
    }
  };

  // Shortern Ethereum address for display
  const shortenAddress = (address) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter documents based on search query
  const filteredDocuments = documents.filter((doc) =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header section */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => router.push("/services")}
              className="text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              Shared Documents
            </h1>
          </div>

          <div className="flex space-x-3">
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                className="focus:ring-black focus:border-black block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2"
                placeholder="Search documents..."
              />
            </div>

            <button
              onClick={() => router.push("/services/access")}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              <UserPlus className="-ml-1 mr-2 h-5 w-5" />
              Manage Access
            </button>
          </div>
        </div>

        {/* Info message */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded-md">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Share2 className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                This page shows all documents you've shared with others. To
                manage access permissions, click on "Manage Access".
              </p>
            </div>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-2 text-gray-600">Loading shared documents...</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && documents.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <Share2 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              No shared documents
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              You haven't shared any documents with others yet
            </p>
            <div className="mt-6">
              <button
                onClick={() => router.push("/services/access")}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              >
                <UserPlus className="mr-2 h-5 w-5" />
                Manage Access
              </button>
            </div>
          </div>
        )}

        {/* Document list */}
        {!loading && filteredDocuments.length > 0 && (
          <div className="bg-white shadow overflow-hidden rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Shared With
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Last Modified
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDocuments.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          {getFileIcon(doc.type)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {doc.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {doc.type} Document
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(doc.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="bg-gray-200 text-gray-700 py-1 px-2 rounded-full text-xs">
                            {doc.sharedWith} users
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {doc.collaborators.slice(0, 3).map((collab, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center text-xs bg-gray-100 text-gray-800 rounded-full px-2 py-0.5"
                            >
                              {shortenAddress(collab.address)}
                              <span
                                className={`ml-1 text-xs ${collab.permission === "View" ? "text-blue-600" : "text-green-600"}`}
                              >
                                ({collab.permission})
                              </span>
                            </span>
                          ))}
                          {doc.collaborators.length > 3 && (
                            <span className="inline-flex items-center text-xs bg-gray-100 text-gray-800 rounded-full px-2 py-0.5">
                              +{doc.collaborators.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {doc.dateModified}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-3 justify-end">
                        <button
                          onClick={() => router.push(`/services/recent`)}
                          className="text-gray-400 hover:text-gray-500"
                          title="View Logs"
                        >
                          <Clock className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => router.push(`/services/access`)}
                          className="text-gray-400 hover:text-gray-500"
                          title="Manage Access"
                        >
                          <UserPlus className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
