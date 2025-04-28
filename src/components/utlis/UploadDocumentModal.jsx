"use client";
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Upload, 
  File, 
  FileText, 
  FilePlus, 
  AlertCircle, 
  Plus,
  UserPlus,
  Clock,
  Pencil
} from 'lucide-react';
import Web3 from 'web3';
import { DocumentAddress, MintAbi } from '@/contracts/ABIs/mint';
import { useAppSelector } from '@/redux/hooks';
import toast from 'react-hot-toast';
import axios from 'axios';

// Pinata API credentials - use your own API keys from Pinata dashboard
const PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY;

const UploadDocumentModal = ({ isOpen, onClose, onSuccess }) => {
  const user = useAppSelector((state) => state.user);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [viewers, setViewers] = useState([{ address: "", email: "" }]);
  const [modifiers, setModifiers] = useState([{ address: "", email: "" }]);
  const fileInputRef = useRef(null);

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setError("");
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Add a new viewer input field
  const addViewer = () => {
    setViewers([...viewers, { address: "", email: "" }]);
  };

  // Remove a viewer input field
  const removeViewer = (index) => {
    const updatedViewers = [...viewers];
    updatedViewers.splice(index, 1);
    setViewers(updatedViewers);
  };

  // Update viewer information
  const updateViewer = (index, field, value) => {
    const updatedViewers = [...viewers];
    updatedViewers[index][field] = value;
    setViewers(updatedViewers);
  };

  // Add a new modifier input field
  const addModifier = () => {
    setModifiers([...modifiers, { address: "", email: "" }]);
  };

  // Remove a modifier input field
  const removeModifier = (index) => {
    const updatedModifiers = [...modifiers];
    updatedModifiers.splice(index, 1);
    setModifiers(updatedModifiers);
  };

  // Update modifier information
  const updateModifier = (index, field, value) => {
    const updatedModifiers = [...modifiers];
    updatedModifiers[index][field] = value;
    setModifiers(updatedModifiers);
  };

  // Go to next step
  const goToNextStep = () => {
    if (step === 1) {
      if (!file) {
        setError("Please select a file to upload");
        return;
      }
      setStep(2);
    }
  };

  // Go back to previous step
  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Reset the form
  const resetForm = () => {
    setFile(null);
    setFileName("");
    setViewers([{ address: "", email: "" }]);
    setModifiers([{ address: "", email: "" }]);
    setStep(1);
    setError("");
  };

  // Close modal
  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Upload document to Pinata IPFS and mint NFT
  const uploadDocument = async () => {
    console.log("Uploading document...");
    console.log(PINATA_API_KEY, PINATA_SECRET_API_KEY);
    if (!file) {
      setError("Please select a file to upload");
      return;
    }

    if (!user.ethreumAddress) {
      setError("Please connect your MetaMask wallet first");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Create form data for Pinata
      const formData = new FormData();
      formData.append('file', file);
      
      const metadata = JSON.stringify({
        name: fileName,
        keyvalues: {
          owner: user.ethreumAddress,
          uploadDate: new Date().toISOString(),
          fileType: file.type,
          fileSize: file.size
        }
      });
      formData.append('pinataMetadata', metadata);
      
      // Upload to Pinata
      const pinataResponse = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          maxBodyLength: "Infinity",
          headers: {
            'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
            'pinata_api_key': PINATA_API_KEY,
            'pinata_secret_api_key': PINATA_SECRET_API_KEY
          }
        }
      );
      
      const ipfsHash = pinataResponse.data.IpfsHash;

      // Filter out empty addresses
      const viewerAddresses = viewers
        .map(viewer => viewer.address)
        .filter(address => address.trim() !== "");
        
      const modifierAddresses = modifiers
        .map(modifier => modifier.address)
        .filter(address => address.trim() !== "");

      // Initialize Web3
      const web3 = new Web3(window.ethereum);
      const documentContract = new web3.eth.Contract(MintAbi, DocumentAddress);

      // Get current account
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];

      // Mint the NFT
      await documentContract.methods
        .mintDocumentNFT(ipfsHash, viewerAddresses, modifierAddresses)
        .send({ from: account });

      // Log action to backend
      // const response = await fetch('/api/documents', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     name: fileName,
      //     ipfsHash: ipfsHash,
      //     viewers: viewers.filter(v => v.address || v.email),
      //     modifiers: modifiers.filter(m => m.address || m.email),
      //     size: formatFileSize(file.size),
      //     fileType: file.type
      //   }),
      // });

      // if (!response.ok) {
      //   throw new Error("Failed to save document metadata");
      // }

      toast.success("Document uploaded and minted successfully!");
      handleClose();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error uploading document:", error);
      setError(error.message || "Failed to upload document");
      toast.error("Failed to upload document");
    } finally {
      setLoading(false);
    }
  };

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      setFileName(droppedFile.name);
      setError("");
    }
  };

  // If modal is not open, don't render anything
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
        {/* Overlay */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" 
          onClick={handleClose}
          aria-hidden="true"
        ></div>

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full relative z-50"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">
              {step === 1 ? "Upload Document" : "Set Permissions"}
            </h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
              type="button"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            {/* Step Indicator */}
            <div className="mb-6 flex items-center justify-center">
              <div className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  step >= 1 ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  1
                </div>
                <div className={`w-12 h-1 ${step >= 2 ? 'bg-black' : 'bg-gray-200'}`}></div>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  step >= 2 ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  2
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Step 1: File Upload */}
            {step === 1 && (
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                />

                {!file ? (
                  <div 
                    onClick={() => fileInputRef.current.click()}
                    onDragOver={handleDrag}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 cursor-pointer"
                  >
                    <Upload className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 mb-1">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500">PDF, DOCX, JPG, PNG (MAX. 20MB)</p>
                  </div>
                ) : (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="mr-3">
                        <FileText className="h-10 w-10 text-gray-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">{fileName}</h4>
                        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                      </div>
                      <button 
                        onClick={() => {
                          setFile(null);
                          setFileName("");
                        }}
                        className="ml-2 text-gray-400 hover:text-gray-500"
                        type="button"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                )}

                <div className="mt-6">
                  <p className="text-sm text-gray-500 mb-2">This document will be:</p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 mt-0.5">
                        <Clock className="h-4 w-4 text-gray-400 mr-2" />
                      </div>
                      <p>Timestamped on the blockchain</p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 mt-0.5">
                        <UserPlus className="h-4 w-4 text-gray-400 mr-2" />
                      </div>
                      <p>Accessible only to permissioned users</p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 mt-0.5">
                        <Pencil className="h-4 w-4 text-gray-400 mr-2" />
                      </div>
                      <p>Have a complete audit trail of all actions</p>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* Step 2: Set Permissions */}
            {step === 2 && (
              <div>
                {/* Viewers */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Who can view this document?</h4>
                  <div className="space-y-3">
                    {viewers.map((viewer, index) => (
                      <div key={index} className="flex space-x-2">
                        <input
                          type="text"
                          value={viewer.address}
                          onChange={(e) => updateViewer(index, "address", e.target.value)}
                          placeholder="Ethereum Address"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                        />
                        <input
                          type="email"
                          value={viewer.email}
                          onChange={(e) => updateViewer(index, "email", e.target.value)}
                          placeholder="Email (optional)"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                        />
                        {viewers.length > 1 && (
                          <button
                            onClick={() => removeViewer(index)}
                            className="p-2 text-red-500 hover:text-red-600"
                            type="button"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={addViewer}
                    className="mt-2 flex items-center text-sm text-black hover:text-gray-600"
                    type="button"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Viewer
                  </button>
                </div>

                {/* Modifiers */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Who can modify this document?</h4>
                  <div className="space-y-3">
                    {modifiers.map((modifier, index) => (
                      <div key={index} className="flex space-x-2">
                        <input
                          type="text"
                          value={modifier.address}
                          onChange={(e) => updateModifier(index, "address", e.target.value)}
                          placeholder="Ethereum Address"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                        />
                        <input
                          type="email"
                          value={modifier.email}
                          onChange={(e) => updateModifier(index, "email", e.target.value)}
                          placeholder="Email (optional)"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                        />
                        {modifiers.length > 1 && (
                          <button
                            onClick={() => removeModifier(index)}
                            className="p-2 text-red-500 hover:text-red-600"
                            type="button"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={addModifier}
                    className="mt-2 flex items-center text-sm text-black hover:text-gray-600"
                    type="button"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Modifier
                  </button>
                </div>

                <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-sm text-blue-600">
                    You will be asked to approve a transaction with your connected wallet. 
                    Gas fees will apply.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            {step === 1 ? (
              <button
                type="button"
                onClick={goToNextStep}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-black text-base font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black sm:ml-3 sm:w-auto sm:text-sm"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={uploadDocument}
                disabled={loading}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-black text-base font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black sm:ml-3 sm:w-auto sm:text-sm"
              >
                {loading ? "Uploading..." : "Upload to Blockchain"}
              </button>
            )}
            
            {step === 2 && (
              <button
                type="button"
                onClick={goBack}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Back
              </button>
            )}
            
            <button
              type="button"
              onClick={handleClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UploadDocumentModal;