'use client'
import React, { useEffect } from "react";
import HomeMain from "@/components/Home/HomeMain";
import Navbar from "@/components/other/Navbar";
import Footer from "@/components/other/Footer";
import { Provider, useDispatch } from "react-redux";
import store from "@/redux/store";
import { setUser } from "@/redux/actions";
import StoreProvider from "./StoreProvider";
export default function Home() {
  return (
    <>

      <Navbar />
      <HomeMain />
      <Footer />

    </>
  );
}
