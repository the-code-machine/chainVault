"use client";
import React, { useState, useEffect } from "react";
import {
  FileText,
  Users,
  Shield,
  User,
  Plus,
  ArrowLeft,
  X,
  CheckCircle,
  AlertTriangle,
  Eye,
  Edit,
  Trash,
} from "lucide-react";
import Web3 from "web3";
import { useAppSelector } from "@/redux/hooks";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { DocumentAddress, MintAbi } from "@/contracts/ABIs/mint";

export default function AccessControl() {
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [collaborators, setCollaborators] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processingAction, setProcessingAction] = useState(false);
  const [newCollaborator, setNewCollaborator] = useState({
    address: "",
    permission: "view",
  });

  const user = useAppSelector((state) => state.user);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get the document ID from URL query params if present
  useEffect(() => {
    const docId = searchParams.get("docId");
    if (docId) {
      const numericId = parseInt(docId);
      if (!isNaN(numericId)) {
        // Set the initial selected document ID
        // We'll load the full document details in fetchDocuments
        setSelectedDocument({ id: numericId });
      }
    }
  }, [searchParams]);

  // Fetch documents on component mount
  useEffect(() => {
    if (user?.ethreumAddress) {
      fetchDocuments();
    }
  }, [user?.ethreumAddress]);

  // Update selected document once documents are loaded
  useEffect(() => {
    if (documents.length > 0 && selectedDocument && selectedDocument.id) {
      // Find the full document details
      const fullDocument = documents.find(
        (doc) => doc.id === selectedDocument.id,
      );
      if (fullDocument) {
        setSelectedDocument(fullDocument);
        fetchCollaborators(fullDocument);
      }
    }
  }, [documents, selectedDocument?.id]);

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

      // Get documents owned by the user (only show docs the user actually owns)
      let ownedTokens = [];
      try {
        ownedTokens = await documentContract.methods
          .tokensOfOwner(user.ethreumAddress)
          .call();
      } catch (error) {
        console.error("Error getting owned tokens:", error);
      }

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

            // Skip if user is not the author (we only want documents the user can manage)
            if (
              authorAddress.toLowerCase() !== user.ethreumAddress.toLowerCase()
            ) {
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

            return {
              id: tokenId,
              name: fileName,
              type: fileType,
              ipfsHash,
              authorAddress,
            };
          } catch (error) {
            console.error(`Error processing token ${tokenId}:`, error);
            return null;
          }
        }),
      );

      // Filter out nulls
      const validDocuments = documentsData.filter((doc) => doc !== null);
      setDocuments(validDocuments);

      // If there are documents and none is selected, select the first one
      if (validDocuments.length > 0 && !selectedDocument) {
        setSelectedDocument(validDocuments[0]);
        fetchCollaborators(validDocuments[0]);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
      toast.error("Failed to fetch documents");
    } finally {
      setLoading(false);
    }
  };

  // Fetch collaborators for a document
  const fetchCollaborators = async (document) => {
    if (!document || !user?.ethreumAddress) {
      return;
    }

    try {
      setProcessingAction(true);

      // Initialize Web3
      const web3 = new Web3(window.ethereum);
      const documentContract = new web3.eth.Contract(MintAbi, DocumentAddress);

      let allCollaborators = [];

      // Get viewers
      try {
        const viewers = await documentContract.methods
          .getViewers(document.id)
          .call();
        // Filter out zero address and current user
        const filteredViewers = viewers.filter(
          (addr) =>
            addr !== "0x0000000000000000000000000000000000000000" &&
            addr.toLowerCase() !== user.ethreumAddress.toLowerCase(),
        );

        const viewerCollaborators = filteredViewers.map((addr) => ({
          address: addr,
          permission: "view",
        }));

        allCollaborators = [...allCollaborators, ...viewerCollaborators];
      } catch (error) {
        console.warn("Error getting viewers:", error);
      }

      // Get modifiers
      try {
        const modifiers = await documentContract.methods
          .getModifiers(document.id)
          .call();
        // Filter out zero address, current user, and those already in viewers
        const filteredModifiers = modifiers.filter(
          (addr) =>
            addr !== "0x0000000000000000000000000000000000000000" &&
            addr.toLowerCase() !== user.ethreumAddress.toLowerCase() &&
            !allCollaborators.some(
              (collab) => collab.address.toLowerCase() === addr.toLowerCase(),
            ),
        );

        const modifierCollaborators = filteredModifiers.map((addr) => ({
          address: addr,
          permission: "modify",
        }));

        allCollaborators = [...allCollaborators, ...modifierCollaborators];
      } catch (error) {
        console.warn("Error getting modifiers:", error);
      }

      setCollaborators(allCollaborators);
    } catch (error) {
      console.error("Error fetching collaborators:", error);
      toast.error("Failed to fetch collaborators");
    } finally {
      setProcessingAction(false);
    }
  };

  // Handle document selection
  const handleSelectDocument = (document) => {
    setSelectedDocument(document);
    fetchCollaborators(document);
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

  // Permission icon helper
  const getPermissionIcon = (permission) => {
    switch (permission.toLowerCase()) {
      case "view":
        return <Eye className="h-5 w-5 text-blue-500" />;
      case "modify":
        return <Edit className="h-5 w-5 text-green-500" />;
      default:
        return <Eye className="h-5 w-5 text-gray-500" />;
    }
  };

  // Shortern Ethereum address for display
  const shortenAddress = (address) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Handle input change for new collaborator form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCollaborator({ ...newCollaborator, [name]: value });
  };

  // Add a new collaborator
  const handleAddCollaborator = async (e) => {
    e.preventDefault();

    if (!selectedDocument || !newCollaborator.address) {
      toast.error("Please enter a valid Ethereum address");
      return;
    }

    // Validate Ethereum address
    if (!Web3.utils.isAddress(newCollaborator.address)) {
      toast.error("Invalid Ethereum address format");
      return;
    }

    try {
      setProcessingAction(true);

      // Initialize Web3
      const web3 = new Web3(window.ethereum);
      const documentContract = new web3.eth.Contract(MintAbi, DocumentAddress);

      // Determine which permission to set
      if (newCollaborator.permission === "view") {
        // Add viewer permission
        await documentContract.methods
          .modifyViewPermission(
            selectedDocument.id,
            newCollaborator.address,
            true,
          )
          .send({ from: user.ethreumAddress });

        // Remove modifier permission if it exists (to avoid having both)
        await documentContract.methods
          .modifyModifyPermission(
            selectedDocument.id,
            newCollaborator.address,
            false,
          )
          .send({ from: user.ethreumAddress });
      } else if (newCollaborator.permission === "modify") {
        // Add modifier permission
        await documentContract.methods
          .modifyModifyPermission(
            selectedDocument.id,
            newCollaborator.address,
            true,
          )
          .send({ from: user.ethreumAddress });

        // Remove viewer permission if it exists (to avoid having both)
        await documentContract.methods
          .modifyViewPermission(
            selectedDocument.id,
            newCollaborator.address,
            false,
          )
          .send({ from: user.ethreumAddress });
      }

      // Log the action
      await documentContract.methods
        .logDocumentAction(
          selectedDocument.id,
          `Grant ${newCollaborator.permission} permission to ${newCollaborator.address}`,
        )
        .send({ from: user.ethreumAddress });

      toast.success(
        `Successfully added collaborator with ${newCollaborator.permission} permission`,
      );

      // Refresh collaborators list
      fetchCollaborators(selectedDocument);

      // Reset form
      setNewCollaborator({ address: "", permission: "view" });
    } catch (error) {
      console.error("Error adding collaborator:", error);
      toast.error("Failed to add collaborator");
    } finally {
      setProcessingAction(false);
    }
  };

  // Remove a collaborator
  const handleRemoveCollaborator = async (collaborator) => {
    if (!selectedDocument || !collaborator.address) {
      return;
    }

    try {
      setProcessingAction(true);

      // Initialize Web3
      const web3 = new Web3(window.ethereum);
      const documentContract = new web3.eth.Contract(MintAbi, DocumentAddress);

      // Remove permissions based on the current type
      if (collaborator.permission === "view") {
        await documentContract.methods
          .modifyViewPermission(
            selectedDocument.id,
            collaborator.address,
            false,
          )
          .send({ from: user.ethreumAddress });
      } else if (collaborator.permission === "modify") {
        await documentContract.methods
          .modifyModifyPermission(
            selectedDocument.id,
            collaborator.address,
            false,
          )
          .send({ from: user.ethreumAddress });
      }

      // Log the action
      await documentContract.methods
        .logDocumentAction(
          selectedDocument.id,
          `Remove ${collaborator.permission} permission from ${collaborator.address}`,
        )
        .send({ from: user.ethreumAddress });

      toast.success("Successfully removed collaborator");

      // Refresh collaborators list
      fetchCollaborators(selectedDocument);
    } catch (error) {
      console.error("Error removing collaborator:", error);
      toast.error("Failed to remove collaborator");
    } finally {
      setProcessingAction(false);
    }
  };

  // Change a collaborator's permission
  const handleChangePermission = async (collaborator) => {
    if (!selectedDocument || !collaborator.address) {
      return;
    }

    // Toggle permission
    const newPermission =
      collaborator.permission === "view" ? "modify" : "view";

    try {
      setProcessingAction(true);

      // Initialize Web3
      const web3 = new Web3(window.ethereum);
      const documentContract = new web3.eth.Contract(MintAbi, DocumentAddress);

      if (newPermission === "view") {
        // Add viewer permission
        await documentContract.methods
          .modifyViewPermission(selectedDocument.id, collaborator.address, true)
          .send({ from: user.ethreumAddress });

        // Remove modifier permission
        await documentContract.methods
          .modifyModifyPermission(
            selectedDocument.id,
            collaborator.address,
            false,
          )
          .send({ from: user.ethreumAddress });
      } else {
        // newPermission === 'modify'
        // Add modifier permission
        await documentContract.methods
          .modifyModifyPermission(
            selectedDocument.id,
            collaborator.address,
            true,
          )
          .send({ from: user.ethreumAddress });

        // Remove viewer permission
        await documentContract.methods
          .modifyViewPermission(
            selectedDocument.id,
            collaborator.address,
            false,
          )
          .send({ from: user.ethreumAddress });
      }

      // Log the action
      await documentContract.methods
        .logDocumentAction(
          selectedDocument.id,
          `Change permission for ${collaborator.address} from ${collaborator.permission} to ${newPermission}`,
        )
        .send({ from: user.ethreumAddress });

      toast.success(`Changed permission to ${newPermission}`);

      // Refresh collaborators list
      fetchCollaborators(selectedDocument);
    } catch (error) {
      console.error("Error changing permission:", error);
      toast.error("Failed to change permission");
    } finally {
      setProcessingAction(false);
    }
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
            <h1 className="text-2xl font-bold text-gray-900">Access Control</h1>
          </div>
        </div>

        {/* Info message */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-md">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Shield className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Manage who can view or modify your documents. You can grant
                view-only access or editing permissions to specific Ethereum
                addresses.
              </p>
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

        {/* No documents */}
        {!loading && documents.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              No documents found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              You don't have any documents to manage access for
            </p>
          </div>
        )}

        {/* Main content with document selection and collaborator management */}
        {!loading && documents.length > 0 && (
          <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
            {/* Document selection sidebar */}
            <div className="w-full md:w-1/3 bg-white rounded-lg shadow overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b">
                <h2 className="text-sm font-medium text-gray-700">
                  Your Documents
                </h2>
              </div>
              <div className="p-2">
                <ul className="divide-y divide-gray-200">
                  {documents.map((doc) => (
                    <li key={doc.id}>
                      <button
                        onClick={() => handleSelectDocument(doc)}
                        className={`w-full text-left px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 ${
                          selectedDocument?.id === doc.id ? "bg-gray-100" : ""
                        }`}
                      >
                        <div className="flex-shrink-0">
                          {getFileIcon(doc.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {doc.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            ID: {doc.id}
                          </p>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Collaborator management panel */}
            <div className="w-full md:w-2/3 bg-white rounded-lg shadow overflow-hidden">
              {selectedDocument ? (
                <>
                  {/* Document info header */}
                  <div className="px-6 py-4 bg-gray-50 border-b">
                    <div className="flex items-center space-x-3">
                      {getFileIcon(selectedDocument.type)}
                      <div>
                        <h2 className="text-lg font-medium text-gray-900">
                          {selectedDocument.name}
                        </h2>
                        <p className="text-sm text-gray-500">
                          Document ID: {selectedDocument.id}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Add new collaborator form */}
                  <div className="px-6 py-4 border-b">
                    <h3 className="text-md font-medium text-gray-700 mb-3">
                      Add New Collaborator
                    </h3>
                    <form
                      onSubmit={handleAddCollaborator}
                      className="flex flex-col space-y-4"
                    >
                      <div>
                        <label
                          htmlFor="address"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Ethereum Address
                        </label>
                        <input
                          type="text"
                          name="address"
                          id="address"
                          value={newCollaborator.address}
                          onChange={handleInputChange}
                          placeholder="0x..."
                          className="mt-1 focus:ring-black focus:border-black block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-3"
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="permission"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Permission Level
                        </label>
                        <select
                          id="permission"
                          name="permission"
                          value={newCollaborator.permission}
                          onChange={handleInputChange}
                          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                        >
                          <option value="view">View Only</option>
                          <option value="modify">Modify</option>
                        </select>
                      </div>

                      <div>
                        <button
                          type="submit"
                          disabled={processingAction}
                          className="inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                        >
                          {processingAction ? (
                            <>
                              <div className="mr-2 h-4 w-4 border-b-2 border-white rounded-full animate-spin"></div>
                              Processing...
                            </>
                          ) : (
                            <>
                              <Plus className="-ml-1 mr-2 h-5 w-5" />
                              Add Collaborator
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Current collaborators list */}
                  <div className="px-6 py-4">
                    <h3 className="text-md font-medium text-gray-700 mb-3">
                      Current Collaborators
                    </h3>

                    {processingAction && collaborators.length === 0 ? (
                      <div className="py-4 text-center text-gray-500">
                        <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 mr-2"></div>
                        Loading collaborators...
                      </div>
                    ) : collaborators.length > 0 ? (
                      <ul className="divide-y divide-gray-200">
                        {collaborators.map((collaborator, index) => (
                          <li key={index} className="py-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0">
                                  <User className="h-6 w-6 text-gray-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900">
                                    {shortenAddress(collaborator.address)}
                                  </p>
                                  <div className="flex items-center">
                                    {getPermissionIcon(collaborator.permission)}
                                    <span className="ml-1 text-xs text-gray-500 capitalize">
                                      {collaborator.permission} Permission
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex space-x-2">
                                <button
                                  onClick={() =>
                                    handleChangePermission(collaborator)
                                  }
                                  disabled={processingAction}
                                  className="inline-flex items-center p-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                                >
                                  {collaborator.permission === "view"
                                    ? "Make Editor"
                                    : "Make Viewer"}
                                </button>
                                <button
                                  onClick={() =>
                                    handleRemoveCollaborator(collaborator)
                                  }
                                  disabled={processingAction}
                                  className="inline-flex items-center p-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                  <Trash className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="py-4 text-center text-gray-500">
                        No collaborators yet. Add someone using the form above.
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="p-6 text-center text-gray-500">
                  <Shield className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                  <p>Select a document to manage access</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
