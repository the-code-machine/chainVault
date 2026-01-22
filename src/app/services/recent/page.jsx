"use client";
import React, { useState, useEffect } from "react";
import {
  FileText,
  Search,
  Filter,
  Eye,
  Download,
  Clock,
  CheckCircle,
  ArrowLeft,
  Upload,
  Users,
  Shield,
} from "lucide-react";
import Web3 from "web3";
import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { DocumentAddress, MintAbi } from "@/contracts/ABIs/mint";

export default function Recent() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [documentLogs, setDocumentLogs] = useState([]);
  const [showLogs, setShowLogs] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);

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
      let allTokenIds = [];
      try {
        const ownedTokens = await documentContract.methods
          .tokensOfOwner(user.ethreumAddress)
          .call();
        console.log("Owned tokens:", ownedTokens);
        allTokenIds = [...allTokenIds, ...ownedTokens];
      } catch (error) {
        console.error("Error getting owned tokens:", error);
      }

      // Get documents user can view
      try {
        const viewableTokens = await documentContract.methods
          .tokensOfViewer(user.ethreumAddress)
          .call();
        console.log("Viewable tokens:", viewableTokens);
        allTokenIds = [...allTokenIds, ...viewableTokens];
      } catch (error) {
        console.error("Error getting viewable tokens:", error);
      }

      // Get documents user can modify
      try {
        const modifiableTokens = await documentContract.methods
          .tokensOfModifier(user.ethreumAddress)
          .call();
        console.log("Modifiable tokens:", modifiableTokens);
        allTokenIds = [...allTokenIds, ...modifiableTokens];
      } catch (error) {
        console.error("Error getting modifiable tokens:", error);
      }

      // Remove duplicates
      allTokenIds = [...new Set(allTokenIds)];
      console.log("All token IDs:", allTokenIds);

      // Fetch document details for each token
      const documentsData = await Promise.all(
        allTokenIds.map(async (tokenId) => {
          try {
            // Get IPFS hash
            const ipfsHash = await documentContract.methods
              .tokenURI(tokenId)
              .call();

            // Get document logs
            const logs = await documentContract.methods
              .getDocumentLogs(tokenId)
              .call();

            // Get permissions
            const canUserView = await documentContract.methods
              .canView(tokenId, user.ethreumAddress)
              .call();
            const canUserModify = await documentContract.methods
              .canModify(tokenId, user.ethreumAddress)
              .call();
            const authorAddress = await documentContract.methods
              .tokenAuthor(tokenId)
              .call();

            // Calculate shared count
            let sharedCount = 0;
            try {
              const viewers = await documentContract.methods
                .getViewers(tokenId)
                .call();
              const modifiers = await documentContract.methods
                .getModifiers(tokenId)
                .call();

              // Filter out the current user's address and the zero address
              const uniqueViewers = viewers.filter(
                (addr) =>
                  addr !== user.ethreumAddress &&
                  addr !== "0x0000000000000000000000000000000000000000",
              );

              const uniqueModifiers = modifiers.filter(
                (addr) =>
                  addr !== user.ethreumAddress &&
                  addr !== "0x0000000000000000000000000000000000000000" &&
                  !uniqueViewers.includes(addr), // Avoid double counting
              );

              sharedCount = uniqueViewers.length + uniqueModifiers.length;
            } catch (error) {
              console.warn("Error calculating shared count:", error);
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

            return {
              id: tokenId,
              name: fileName,
              type: fileType,
              size: "Unknown",
              dateModified: lastModified,
              timestamp:
                logs.length > 0 ? parseInt(logs[logs.length - 1].timestamp) : 0,
              status: "verified",
              ipfsHash,
              authorAddress,
              isOwner:
                authorAddress.toLowerCase() ===
                user.ethreumAddress.toLowerCase(),
              canView: canUserView,
              canModify: canUserModify,
              logs: logs.map((log) => ({
                ...log,
                formattedTime: new Date(
                  parseInt(log.timestamp) * 1000,
                ).toLocaleString(),
              })),
              sharedWith: sharedCount,
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
        .sort((a, b) => b.timestamp - a.timestamp);

      setDocuments(validDocuments);
    } catch (error) {
      console.error("Error fetching documents:", error);
      toast.error("Failed to fetch documents");
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

  // Show document logs
  const handleViewLogs = (document) => {
    setSelectedDocument(document);
    setDocumentLogs(document.logs);
    setShowLogs(true);
  };

  // Close logs panel
  const closeLogs = () => {
    setShowLogs(false);
    setSelectedDocument(null);
    setDocumentLogs([]);
  };

  // Handle filter change
  const handleFilterChange = (filter) => {
    setFilterType(filter);
    setFilterMenuOpen(false);
  };

  // Toggle filter menu
  const toggleFilterMenu = () => {
    setFilterMenuOpen(!filterMenuOpen);
  };

  // Filter documents based on search query and type filter
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    if (filterType === "all") return matchesSearch;
    if (filterType === "owned") return matchesSearch && doc.isOwner;
    if (filterType === "shared") return matchesSearch && !doc.isOwner;

    return matchesSearch;
  });

  // Get the appropriate icon for a log action
  const getActionIcon = (action) => {
    if (action === "View") return <Eye className="h-5 w-5 text-blue-500" />;
    if (action === "Upload")
      return <Upload className="h-5 w-5 text-purple-500" />;
    if (action === "Grant" || action === "Share")
      return <Users className="h-5 w-5 text-green-500" />;
    if (action === "Verify")
      return <Shield className="h-5 w-5 text-yellow-500" />;
    return <Clock className="h-5 w-5 text-gray-500" />;
  };

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header section */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => router.push("/dashboard")}
              className="text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              Recent Documents
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

            <div className="relative inline-block text-left">
              <div>
                <button
                  type="button"
                  onClick={toggleFilterMenu}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                  id="filter-menu"
                  aria-expanded="true"
                  aria-haspopup="true"
                >
                  <Filter className="mr-2 h-5 w-5 text-gray-400" />
                  {filterType === "all"
                    ? "All Documents"
                    : filterType === "owned"
                      ? "My Documents"
                      : "Shared With Me"}
                </button>
              </div>

              {filterMenuOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                  <div
                    className="py-1"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="filter-menu"
                  >
                    <button
                      onClick={() => handleFilterChange("all")}
                      className={`${filterType === "all" ? "bg-gray-100 text-gray-900" : "text-gray-700"} block px-4 py-2 text-sm w-full text-left`}
                      role="menuitem"
                    >
                      All Documents
                    </button>
                    <button
                      onClick={() => handleFilterChange("owned")}
                      className={`${filterType === "owned" ? "bg-gray-100 text-gray-900" : "text-gray-700"} block px-4 py-2 text-sm w-full text-left`}
                      role="menuitem"
                    >
                      My Documents
                    </button>
                    <button
                      onClick={() => handleFilterChange("shared")}
                      className={`${filterType === "shared" ? "bg-gray-100 text-gray-900" : "text-gray-700"} block px-4 py-2 text-sm w-full text-left`}
                      role="menuitem"
                    >
                      Shared With Me
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-2 text-gray-600">Loading documents...</p>
          </div>
        )}

        {/* Document list */}
        {!loading && filteredDocuments.length > 0 && !showLogs && (
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
                    Owner
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {doc.authorAddress === user.ethreumAddress ? (
                        <span className="text-green-600 font-medium">You</span>
                      ) : (
                        shortenAddress(doc.authorAddress)
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {doc.dateModified}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-3 justify-end">
                        <button
                          onClick={() => handleViewLogs(doc)}
                          className="text-gray-400 hover:text-gray-500"
                          title="View Logs"
                        >
                          <Clock className="h-5 w-5" />
                        </button>
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

        {/* Empty state */}
        {!loading && filteredDocuments.length === 0 && !showLogs && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              No documents found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery
                ? `No documents matching "${searchQuery}"`
                : filterType === "owned"
                  ? "You don't have any documents yet"
                  : filterType === "shared"
                    ? "No documents have been shared with you"
                    : "No documents available"}
            </p>
          </div>
        )}

        {/* Document Logs View */}
        {showLogs && selectedDocument && (
          <div className="bg-white shadow overflow-hidden rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={closeLogs}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  <h2 className="text-lg font-medium text-gray-900">
                    Document Activity Logs
                  </h2>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-500">
                    Document ID: {selectedDocument.id}
                  </span>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50">
              <div className="flex items-center space-x-4">
                {getFileIcon(selectedDocument.type)}
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {selectedDocument.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Owner:{" "}
                    {selectedDocument.authorAddress === user.ethreumAddress
                      ? "You"
                      : shortenAddress(selectedDocument.authorAddress)}
                  </p>
                </div>
              </div>
            </div>

            {documentLogs.length > 0 ? (
              <div className="overflow-hidden">
                <ul className="divide-y divide-gray-200">
                  {documentLogs.map((log, index) => (
                    <li key={index} className="p-4 hover:bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="p-2 rounded-full bg-gray-100">
                            {getActionIcon(log.action)}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {log.action}
                          </p>
                          <p className="text-sm text-gray-500">
                            By:{" "}
                            {log.account === user.ethreumAddress
                              ? "You"
                              : shortenAddress(log.account)}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <span className="text-sm text-gray-500">
                            {log.formattedTime}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500">
                No activity logs found for this document
              </div>
            )}

            {/* Document actions */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex justify-between">
                <div>
                  {selectedDocument.canView && (
                    <a
                      href={`https://ipfs.io/ipfs/${selectedDocument.ipfsHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black mr-3"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Document
                    </a>
                  )}

                  {selectedDocument.canView && (
                    <a
                      href={`https://ipfs.io/ipfs/${selectedDocument.ipfsHash}?download=true`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </a>
                  )}
                </div>

                {selectedDocument.isOwner && (
                  <button
                    onClick={() =>
                      router.push(
                        `/dashboard/access-control?docId=${selectedDocument.id}`,
                      )
                    }
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Manage Access
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Breadcrumbs */}
        {showLogs && (
          <div className="flex items-center space-x-2 text-sm text-gray-500 mt-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="hover:text-gray-700"
            >
              Dashboard
            </button>
            <span>›</span>
            <button onClick={closeLogs} className="hover:text-gray-700">
              Recent Documents
            </button>
            <span>›</span>
            <span className="text-gray-900 font-medium truncate max-w-xs">
              {selectedDocument?.name} Logs
            </span>
          </div>
        )}
      </div>
    </main>
  );
}
