'use client'
import DefaultLayout from '@/components/other/DefaultLayout'
import Table from '@/components/utlis/Table'
import TableShared from '@/components/utlis/TableShared'
import TableTransactions from '@/components/utlis/TableTransactions'
import TableView from '@/components/utlis/TableView'
import { set } from 'mongoose'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Web3 from 'web3'
const axios = require('axios');
export default function Home() {
    const user = useSelector(state => state);
    const [web3, setWeb3] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [balance, setBalance] = useState('');
    const [lastTransactions, setLastTransactions] = useState(null);
   
    useEffect(() => {
        const loadWeb3 = async () => {
            if (window.ethereum) {
                const web3Instance = new Web3(window.ethereum);
                setWeb3(web3Instance);

                try {
                    // Request account access
                    await window.ethereum.request({ method: 'eth_requestAccounts' });

                    // Get the current accounts
                    const accounts = await web3Instance.eth.getAccounts();
                    setAccounts(accounts);

                    // Get the current balance
                    const balance = await web3Instance.eth.getBalance(accounts[0]);
                    setBalance(web3Instance.utils.fromWei(balance, 'ether'));
                    
                 
                    
                } catch (error) {
                    console.error('Error fetching wallet info:', error);
                }
            } else {
                console.error('MetaMask not detected!');
            }
        };

        loadWeb3();

        return () => {
            if (web3) {
                // Clean up
                setWeb3(null);
                setAccounts([]);
                setBalance('');

                setLastTransactions(null);
            }
        };
    }, []);
    return (
        <div>
            <div className="grid grid-cols-5 gap-8 my-5">
                <div className="col-span-5 ">
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="border-b border-stroke py-4 px-7 flex justify-between dark:border-strokedark">
                            <div className="font-medium text-ellipsis w-24 overflow-hidden text-black dark:text-white">
                                {user.address}
                            </div>
                            <div className="font-medium text-black dark:text-white">
                                {parseFloat(balance).toFixed(4)} ETH
                            </div>
                        </div>
                        <div className="p-7">
                            <TableTransactions />

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
