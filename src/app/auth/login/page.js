"use client";
import React, { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useLottie } from "lottie-react";
import groovyWalkAnimation from '/public/signin.json';
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/actions";
import Loader from "@/components/utlis/Loader";
import Web3 from 'web3';
import { set } from "mongoose";
 
const Home = () => {
  const dispatch = useDispatch(); 
  const[ loading,setLoading]= useState(false)
  const router = useRouter();
  const options = {
    animationData: groovyWalkAnimation,
    loop: true
  }
  const { View } = useLottie(options);

  const handleMetaMaskSignIn = async (e) => {
    e.preventDefault();
   
    setLoading(true);
    try {
      if (typeof window.ethereum !== 'undefined') {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.enable(); // Request user's permission to connect
  
        const accounts = await web3.eth.getAccounts();
        const address = accounts[0];
        
        // Send address to backend API
        const response = await fetch('/api/users/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ethreumAddress: address}),
        });
  
        if (response.ok) {
          const data = await response.json();
          const userData ={
            login:true,
            address:address,
          }
          console.log(data); // Log the response from the backend
          setLoading(false);
          dispatch(setUser(userData));
          toast.success("Login successful");
          router.push("/"); 
          // Optionally, you can perform further actions based on the response from the backend
        } else {
          // Handle non-successful response
          console.error('Failed to authenticate with MetaMask');
          toast.error('Failed to authenticate with MetaMask');
          setLoading(false);
        }
      } else {
        toast.error("MetaMask not installed");
        setLoading(false);
      }
    } catch (error) {
      console.error("MetaMask authentication error:", error);
      toast.error("MetaMask authentication error");
      setLoading(false);
    }
  };
  
  
  return (
    <div className="rounded-sm border border-stroke  bg-white shadow-default">
      <div className="flex flex-wrap items-center ">
        <div className="hidden w-full xl:block xl:w-1/2 h-screen">
          <div className="py-20 px-26 flex flex-col space-y-5 justify-center items-center text-center">
            <Link className="mb-5.5 inline-block" href="/">
           <h1 className=" text-4xl text-[#792938ed] font-bold">eVault</h1>
            </Link>
            <p className="2xl:px-20 text-[#792938ed]">
              eVault is a decentralized platform that allows you to store your
              important documents on the blockchain securely.
            </p>
            <span className="mt-15 inline-block ">
            {View}
            </span>
          </div>
        </div>
        <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
          <div className="w-full p-4 sm:p-12.5 xl:p-20">
            <h2 className="mb-9 text-4xl font-bold text-[#792938ed] sm:text-title-xl2">
              SignIn to eVault
            </h2>
            <form>
            
              <div className="mb-5">
                <input
                  type="submit"
                  value="Connect with Metamask"
                  onClick={handleMetaMaskSignIn}
                  className="w-full cursor-pointer rounded-lg bg-[#792938ed] p-4 text-white transition hover:bg-opacity-90"
                />
              </div>
              <div className="mt-6 text-center text-[#792938ed]">
                <p>
                  Don't have an account?{" "}
                  <Link href="/auth/signup" className="text-green-700 text font-semibold">
                    Sign Up
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
      { loading && <Loader/>}
    </div>
  );
};
export default Home;

