import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import Loader from './Loader';
import Web3 from 'web3';
import { MintAbi } from '@/contracts/ABIs/mint';
import { DocumentAddress } from '@/contracts/ABIs/mint';
import { set } from 'mongoose';

export default function TableTransactions() {
    const [documents, setDocuments] = useState([])
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [LogDocumentId, setLogDocumentId] = useState(null);
    const user = useSelector((state) => state);
    const [logs, setLogs] = useState([])
    const web3 = new Web3(window.ethereum);
    const contract = new web3.eth.Contract(MintAbi, DocumentAddress);
    const fetchTokens = async (ownerAddress) => {
        console.log(ownerAddress)
        try {
            const tokenIds = await contract.methods.tokensOfOwner(ownerAddress).call();
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
    
    const fetchLogsData = async (tokenId) => {
        try {
            const logs = await contract.methods.getDocumentLogs(tokenId).call();
            console.log(logs)
            return logs;

        }
        catch (error) {
            console.error('Error fetching logs:', error);
        }
    }
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const tokenIds = await fetchTokens(user.address);
            const authors = await Promise.all(tokenIds.map(tokenId => fetchAuthors(tokenId)));
            const uris = await Promise.all(tokenIds.map(tokenId => fetchUri(tokenId)));
            const docs = tokenIds.map((tokenId, index) => ({
                documentId: tokenId.toString(),
                userId: authors[index],
                tokenId: tokenId,
                tokenUri: uris[index]
            }));
            setLoading(false);
            setDocuments(docs);
        };

        fetchData();
    }, [user?.address]);

    async function handleOpen(uri, tokenId) {
        setLoading(true);
        await logDocs(tokenId, 'Viewed')
        window.location.href = "https://lavender-certain-yak-875.mypinata.cloud/ipfs/" + uri;
        setLoading(false);
    }

    const handleOpenLogs = async(tokenId) => {
        setLoading(true);
        const logs = await fetchLogsData(tokenId);
        setLogs(logs);
        setLogDocumentId(tokenId);
        setLoading(false);
        setOpen(true);
    }
    return (
        <div>
            {loading && <Loader />}
            <div class="overflow-x-auto">
                <table class="w-full bg-white divide-y divide-gray-200 rounded-lg shadow-md">
                    <thead class="bg-gray-50">
                        <tr className=' flex justify-between'>
                            <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document </th>
                            

                            <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">View</th>
                        
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        {
                            documents.map((index, item) => (
                                <>
                                    <tr key={item + 1} className='flex justify-between'>
                                        <td class="px-3 py-4 whitespace-nowrap">{index.documentId}</td>
                    
                                        <td class="px-3 py-4 whitespace-nowrap"><button onClick={() => handleOpen(index.tokenUri, index.tokenId)} class="px-4 py-1.5 inline-flex text-md leading-5 font-semibold rounded-full bg-primary text-white">View Doument</button></td>
                                    </tr>
                                </>
                            )

                            )
                        }



                    </tbody>
                </table>

            
            </div>
        </div>
    )
}

