"use client";
import React from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useLottie } from "lottie-react";
import groovyWalkAnimation from '/public/signin.json';
import toast from "react-hot-toast";
import Loader from "@/components/utlis/Loader";
import Web3 from "web3";

const Home = () => {
  const [loading,setLoading] = React.useState(false);
  const router = useRouter();
  const options = {
    animationData: groovyWalkAnimation,
    loop: true
  }
  const { View } = useLottie(options);
  const [userName, setUserName] = React.useState('');
;
const handleMetaMaskSignUp = async (e) => {
  e.preventDefault();
  if(userName === "") {
    toast.warn("Please enter your name");
    return;}
 
  setLoading(true);
  try {
    if (typeof window.ethereum !== 'undefined') {
      const web3 = new Web3(window.ethereum);
      await window.ethereum.enable(); // Request user's permission to connect

      const accounts = await web3.eth.getAccounts();
      const address = accounts[0];
      
      // Send address to backend API
      const response = await fetch('/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ethreumAddress: address ,name : userName}),
      });

      if (response.ok) {
        const data = await response.json();
        setLoading(false);
        toast.success("Signup successful");
        router.push("/auth/login"); 
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
    <div className="rounded-sm border border-stroke  bg-white shadow-default overflow-y-hidden">
      <div className="flex flex-wrap items-center ">
        <div className="hidden w-full xl:block xl:w-1/2 h-screen">
          <div className="py-20 px-26 flex flex-col space-y-5 justify-center items-center text-center">
            <Link className="mb-5.5 inline-block" href="/">
           <h1 className=" text-4xl text-[#792938ed] font-bold">eVault</h1>
            </Link>
            <p className=" text-[#792938ed] w-11/12">
            Experience the fusion of technology and security. With <span className="font-bold text-2xl ">BlockChain </span>encryption, we ensure your legal documents are safe. Trust us to guard your peace of mind..
            </p>
            <span className="mt-15 inline-block ">
            {View}
            </span>
          </div>
        </div>
        <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
          <div className="w-full p-4 sm:p-12.5 xl:p-20">
            <h2 className="mb-9 text-4xl font-bold text-[#792938ed] sm:text-title-xl2">
              Sign Up to eVault
            </h2>
            <form>
              {/* Name */}
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-[#792938ed]">
                  Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={userName}
                    placeholder="username"
                    onChange={(e) =>
                      setUserName(e.target.value)
                    }
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-[#792938ed] outline-none"
                  />
                  <span className="absolute right-4 top-4">
                    <svg
                      className="fill-current"
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g opacity="0.5">
                        <path
                          d="M11.0008 9.52185C13.5445 9.52185 15.607 7.5281 15.607 5.0531C15.607 2.5781 13.5445 0.584351 11.0008 0.584351C8.45703 0.584351 6.39453 2.5781 6.39453 5.0531C6.39453 7.5281 8.45703 9.52185 11.0008 9.52185ZM11.0008 2.1656C12.6852 2.1656 14.0602 3.47185 14.0602 5.08748C14.0602 6.7031 12.6852 8.00935 11.0008 8.00935C9.31641 8.00935 7.94141 6.7031 7.94141 5.08748C7.94141 3.47185 9.31641 2.1656 11.0008 2.1656Z"
                          fill=""
                        />
                        <path
                          d="M13.2352 11.0687H8.76641C5.08828 11.0687 2.09766 14.0937 2.09766 17.7719V20.625C2.09766 21.0375 2.44141 21.4156 2.88828 21.4156C3.33516 21.4156 3.67891 21.0719 3.67891 20.625V17.7719C3.67891 14.9531 5.98203 12.6156 8.83516 12.6156H13.2695C16.0883 12.6156 18.4258 14.9187 18.4258 17.7719V20.625C18.4258 21.0375 18.7695 21.4156 19.2164 21.4156C19.6633 21.4156 20.007 21.0719 20.007 20.625V17.7719C19.9039 14.0937 16.9133 11.0687 13.2352 11.0687Z"
                          fill=""
                        />
                      </g>
                    </svg>
                  </span>
                </div>
              </div>
          
              <div className="mb-5">
                <input
                  type="submit"
                  value="Connect MetaMask"
                  placeholder="Create account"
                  onClick={handleMetaMaskSignUp}
                  className="w-full cursor-pointer rounded-lg bg-[#792938ed] p-4 text-white transition hover:bg-opacity-90"
                />
              </div>
              <div className="mt-6 text-center text-[#792938ed]">
                <p>
                  Already have an account?{" "}
                  <Link href="/auth/login" className="text-green-700 font-semibold">
                    Sign In
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