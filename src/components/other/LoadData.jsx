'use client';
import { setUser } from '@/redux/actions';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Web3 from 'web3';
export const LoadData = () => {
    const dispatch = useDispatch();  
    const location = window.location
    useEffect(() => {
      const checkMetaMaskLogin = async () => {
        try {
          if (typeof window.ethereum !== "undefined") {
            // Create a new Web3 instance using the Ethereum provider
            const web3 = new Web3(window.ethereum);
    
            // Get the current accounts from MetaMask
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            const address = accounts[0];
            // Check if there is at least one account
            if (accounts.length > 0) {
              // Set the user as logged in
              const userData = {
                login: true,
                address:address,
              };
              dispatch(setUser(userData));
            } else {
              // The user is not logged in
              const userData = {
                login: false,
                address:''
              };
              dispatch(setUser(userData));
            }
          } else {
            // MetaMask is not installed
            // Handle the case where MetaMask is not installed
          }
        } catch (error) {
          console.error("Error checking MetaMask login:", error);
          // Handle the error
        }
      };
    
      // Call the function to check MetaMask login status
      checkMetaMaskLogin();
    }, [dispatch, setUser,location]);
  return (
    <div></div>
  )
}
