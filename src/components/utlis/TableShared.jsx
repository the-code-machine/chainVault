import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import Loader from './Loader';
import Web3 from 'web3';
import { MintAbi } from '@/contracts/ABIs/mint';
import { DocumentAddress } from '@/contracts/ABIs/mint';

export default function TableShared() {
    const [documents, setDocuments] = useState([])
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [LogDocumentId, setLogDocumentId] = useState(null);
    const user = useSelector((state) => state);
    const [logs, setLogs] = useState([])
    const web3 = new Web3(window.ethereum);
    const contract = new web3.eth.Contract(MintAbi, DocumentAddress);
    const fetchTokensViewer = async (ownerAddress) => {
        console.log(ownerAddress)
        try {
            const tokenIds = await contract.methods.tokensOfViewer(ownerAddress).call();
            console.log(tokenIds)
            return tokenIds;
        } catch (error) {
            console.error('Error fetching token IDs by owner:', error);
            return [];
        }
    }
    const fetchTokensModifier = async (ownerAddress) => {
        console.log(ownerAddress)
        try {
            const tokenIds = await contract.methods.tokensOfModifier(ownerAddress).call();
            console.log(tokenIds)
            return tokenIds;
        } catch (error) {
            console.error('Error fetching token IDs by owner:', error);
            return [];
        }
    }
    const fetchUri = async (tokenId) => {

        try {
            const uri = await contract.methods.tokenURI(tokenId).call();

            return uri;
        } catch (error) {
            console.error('Error fetching token URI:', error);
            return null;
        }

    }
    const fetchAuthors = async (tokenId) => {

        try {
            const author = await contract.methods.tokenAuthor(tokenId).call();

            return author;
        } catch (error) {
            console.error('Error fetching token URI:', error);
            return null;
        }

    }
    
    const logDocs = async (tokenId, action) => {
        await window.ethereum.enable();
      
        const accounts = await web3.eth.getAccounts();
        const account = accounts[0];
        try {
            await contract.methods.logDocumentAction(tokenId, action).send({ from: account });
            console.log("Document action logged successfully");
        } catch (error) {
            console.error('Error fetching logs:', error);
        }
    }
    
    const fetchDataView= async () => {
      
        const tokenIds = await fetchTokensViewer(user.address);
        const authors = await Promise.all(tokenIds.map(tokenId => fetchAuthors(tokenId)));
        const uris = await Promise.all(tokenIds.map(tokenId => fetchUri(tokenId)));
        const docs = tokenIds.map((tokenId, index) => ({
            documentId: tokenId.toString(),
            userId: authors[index],
            tokenId: tokenId,
            tokenUri: uris[index],
            permissions: 'View'
        }));
      return docs;
    };
    const fetchDataModify= async () => {
      
        const tokenIds = await fetchTokensModifier(user.address);
        const authors = await Promise.all(tokenIds.map(tokenId => fetchAuthors(tokenId)));
        const uris = await Promise.all(tokenIds.map(tokenId => fetchUri(tokenId)));
        const docs = tokenIds.map((tokenId, index) => ({
            documentId: tokenId.toString(),
            userId: authors[index],
            tokenId: tokenId,
            tokenUri: uris[index],
            permissions: 'Modify'
        }));
      return docs;
    };
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const data = new Map();
            const docs1 = await fetchDataView();
            const docs2 = await fetchDataModify();
        
            docs1.forEach((doc) => {
                data.set(doc.tokenId, { ...doc, permissions: 'View' });
            });
        
            docs2.forEach((doc2) => {
                if (data.has(doc2.tokenId)) {
                    const doc = data.get(doc2.tokenId);
                    doc.permissions = 'View+Modify';
                    data.set(doc2.tokenId, doc);
                } else {
                    data.set(doc2.tokenId, { ...doc2, permissions: 'Modify' });
                }
            });
        
            setLoading(false);
            setDocuments(Array.from(data.values()));
        };

        fetchData();
    }, [user?.address]);

    async function handleOpen(uri, tokenId) {
        setLoading(true);
        await logDocs(tokenId, 'Viewed')
        window.location.href = "https://lavender-certain-yak-875.mypinata.cloud/ipfs/" + uri;
        setLoading(false);
    }


    return (
        <div>
            {loading && <Loader />}
            <div class="overflow-x-auto">
                <table class="w-full bg-white divide-y divide-gray-200 rounded-lg shadow-md">
                    <thead class="bg-gray-50">
                        <tr>
                            <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document </th>
                            <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th>
                            <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permissions</th>
                            

                            <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">View</th>
                        
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        {
                            documents.map((index, item) => (
                                <>
                                    <tr key={item + 1}>
                                        <td class="px-3 py-4 whitespace-nowrap">{index.documentId}</td>
                                        <td class="px-3 py-4 whitespace-nowrap">{index.userId}</td>


                                        <td class="px-3 py-4 whitespace-nowrap"><button class=" inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 px-3 py-1.5">{index.permissions}</button></td>
                              
                                        <td class="px-3 py-4 whitespace-nowrap"><button onClick={() => handleOpen(index.tokenUri, index.tokenId)} class="px-4 py-1.5 inline-flex text-md leading-5 font-semibold rounded-full bg-primary text-white">View Doument</button></td>
                                    </tr>
                                </>
                            )

                            )
                        }



                    </tbody>
                </table>

                {
                    open && <Logs logs={logs} setOpen={setOpen} />

                }
            </div>
        </div>
    )
}

const Logs = ({ logs, setOpen }) => {
   
    const [loading, setLoading] = useState(false);
  
    const convert = (timestamp) => {
        const date = new Date(Number(timestamp) * 1000); // Explicitly convert BigInt to number
        const dateString = date.toLocaleString();
        return dateString;
    }
    

    return (
        <div onClick={() => setOpen(false)} className=' fixed top-0 left-0 z-[1000000000] bg-white   bg-opacity-80 h-screen w-full flex justify-center items-center'>
            <table class="w-1/2 rounded-xl bg-white divide-y divide-gray-400  shadow-md">
                <thead class="bg-gray-100">
                    <tr>
        
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"> User</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Operation</th>

                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Timestamp</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                    {
                        logs?.map((index, item) => (
                            <>
                                <tr key={item + 1}>
                                 
                                    <td class="px-6 py-4 whitespace-nowrap">{index.account}</td>


                                    <td class="px-6 py-4 whitespace-nowrap"><span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">{index.action}</span></td>
                                    <td class="px-6 py-4 whitespace-nowrap">{convert(index.timestamp)}</td>

                                </tr>
                            </>
                        )

                        )
                    }



                </tbody>
            </table>
            {loading && <Loader />}
        </div>
    )
}