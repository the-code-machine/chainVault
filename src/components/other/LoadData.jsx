"use client";
import { setUser } from "@/redux/actions";
import { useAppDispatch } from "@/redux/hooks";
import { setUserAddress, setUserLogin } from "@/redux/slicers/userSlice";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Web3 from "web3";
export const LoadData = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const checkMetaMaskLogin = async () => {
      try {
        if (typeof window.ethereum !== "undefined") {
          // Create a new Web3 instance using the Ethereum provider
          const web3 = new Web3(window.ethereum);

          // Get the current accounts from MetaMask
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });
          const address = accounts[0];
          // Check if there is at least one account
          console.log(address);
          if (accounts.length > 0) {
            dispatch(setUserAddress(address));
            dispatch(setUserLogin(true));
          } else {
            // The user is not logged in

            dispatch(setUserAddress(""));
            dispatch(setUserLogin(false));
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
  }, [dispatch]);
  return <div></div>;
};
