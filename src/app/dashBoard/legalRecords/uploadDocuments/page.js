'use client'
import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import Select from 'react-select';
import Loader from "@/components/utlis/Loader";
import Table from "@/components/utlis/Table";
import Web3 from 'web3';
import { MintAbi } from '@/contracts/ABIs/mint';
import { DocumentAddress } from '@/contracts/ABIs/mint';
import toast from "react-hot-toast";
export default function Home() {
  const [file, setFile] = useState(null); // Change to null initial state
  const [uploading, setUploading] = useState(false);
  const user = useSelector(state => state);
  const [users, setUsers] = useState([]);
  const [options, setOptions] = useState([]);
  const inputFile = useRef(null);
  const [viewPermissions, setViewPermissions] = useState([]);
  const [modifyPermissions, setModifyPermissions] = useState([]);

  const fetchUsers = async () => {
    try {
      setUploading(true);
      const response = await fetch('/api/users/getallusers');
      if (response.ok) {
        setUploading(false);
        const data = await response.json();
        setUsers(data.data);
      } else {
        setUploading(false);
        throw new Error('Failed to fetch users');
      }
    } catch (error) {
      setUploading(false);
      console.error(error);
    }
  };

  useEffect(() => {
    if (user.address) {
      fetchUsers();
    }
  }, [user.address]);

  useEffect(() => {
    // Transform users into options array
    const newOptions = users.map(item => {
      if(item.ethreumAddress.toLowerCase() === user.address){
        return null;
      }
      else{
        return {
          value: item.ethreumAddress,
          label: item.name
        }
      }
    }).filter(Boolean); // remove null values
    setOptions(newOptions);
  }, [users,user.address]);

  const handleOptionChange = (selectedOptions, permissionType) => {
    const usernames = selectedOptions.map(option => option.value);
    if (permissionType === 'view') {
      setViewPermissions(usernames);
    } else if (permissionType === 'modify') {
      setModifyPermissions(usernames);
    }
   
  };

  const handleChange = (e) => {
    e.preventDefault();
    const selectedFile = e.target.files[0];
    setFile(selectedFile); // Set the file in state
  };

  const uploadFile = async (e) => {
    const web3 = new Web3(window.ethereum);
    const contract = new web3.eth.Contract(MintAbi, DocumentAddress);
    e.preventDefault();
    if (!file) {
      toast.warn("Please select a file.");
      return;
    }

    try {
      setUploading(true);
      const data = new FormData();
      data.append("file", file);

      const res = await fetch("/api/legalRecords/uploadDocuments", {
        method: "POST",
        body: data,
      });

      const resData = await res.json();
      if (res.ok) {
        const { status, ipfsHash} = resData;
        {

            try {
                // Request user permission to interact with the wallet (MetaMask)
                await window.ethereum.enable();
      
                const accounts = await web3.eth.getAccounts();
                const account = accounts[0];
    
      
                const tx = await contract.methods.mintDocumentNFT(ipfsHash, viewPermissions, modifyPermissions).send({from: account}); // Send the transaction
                if (tx && tx.transactionHash) {
                  console.log("Document minted with IPFS hash:", tx);
                    toast.success(tx.transactionHash);
                    setUploading(false);
                    setFile(null); 
                } else {
                    toast.error("Transaction was not mined or returned an undefined hash.");
                    setUploading(false);

                    setFile(null); 
                    
                }
            } catch (error) {
              setUploading(false);

              setFile(null); 
                toast.error("Error during minting:", error);
                return null;
            }
        }
       
      } else {
        console.error("Error during upload");
      }

      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };

  return (
    <>
      {uploading ? (
        <Loader />
      ) : (
        <>
        <div className="grid grid-cols-5 gap-8">
          <div className="col-span-5 ">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Legal Records information
                </h3>
              </div>
              <div className="p-7">
                <div className="rounded-sm border border-stroke px-4 bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                  <div className="flex flex-col gap-5.5 p-6.5">
                    <div>
                      <label className="mb-3 block text-black font-medium ">
                        Upload Document
                      </label>
                      <input
                        type="file"
                        ref={inputFile}
                        onChange={(e)=>handleChange(e)}
                        className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-[#793938] file:py-3 file:px-5 file:hover:bg-black file:hover:bg-opacity-10 focus:border-black active:border-black disabled:cursor-default disabled:bg-[#C5F2DD] dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30  text-black dark:focus:border-black"
                      />
                    </div>
                  </div>

                  <div className="flex gap-5.5 p-6.5">
                    <div className="w-full sm:w-1/2">
                      <div className="mb-3 block text-lg font-medium text-black">View Permissions</div>
                      <Select options={options} isMulti onChange={selectedOptions => handleOptionChange(selectedOptions, 'view')} />
                    </div>
                    <div className="w-full sm:w-1/2">
                      <div className="mb-3 block text-lg font-medium text-black">Modify Permissions</div>
                      <Select options={options} isMulti onChange={selectedOptions => handleOptionChange(selectedOptions, 'modify')} />
                    </div>
                  </div>
                  <div className="flex justify-end gap-4.5 my-5">
                    <button
                      onClick={uploadFile}
                      className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-white hover:bg-opacity-90"
                    >
                      Upload
                    </button>
                  </div>
                </div>
             
              </div>
            </div>
          </div>
        </div>

        
        </>
      )}
    </>
  );
}
