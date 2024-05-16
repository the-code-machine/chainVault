'use client'
import React, { useState } from 'react'
import { AnimatePresence, motion } from "framer-motion";
import Link from 'next/link';
import { NavbarItems } from '../data/Navbar';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '@/redux/actions';
import { Link as Link1 } from 'react-scroll';
export default function Navbar() {
  return (
    <div>
      <TopBar />
      <BottomBar />
    </div>
  )
}

const TopBar = () => {
  return (
    <>
      <div className=' w-screen h-36  bg-bg-secondary flex justify-between px-8 py-5'>
        <div className=' w-1/2 flex space-x-5 '>
          <img src='https://gwalior.dcourts.gov.in/wp-content/themes/sdo-theme/images/emblem.svg' className=' h-full ' />
          <div className=' flex flex-col  text-black text-lg'>
            <h1>

            डिजिटल भारत से सशक्त भारत
            </h1>
            <p className=' text-4xl font-bold'>
              eVault for Legal Records
            </p>
            <h1>
              विधिक रिकॉर्ड के लिए ई-वॉल्ट
            </h1>
          </div>
        </div>
        <div className=' w-1/2 flex space-x-5 justify-end'>
        
          <img src='https://gwalior.dcourts.gov.in/wp-content/themes/sdo-theme/images/digital-india.png' className='h-full' />
        </div>
      </div>
    </>
  )
}
const BottomBar = () => {
  const user = useSelector((state) => state);
 
  
  return (
    <>
      <div className=' w-screen h-12 bg-primary flex px-8  justify-between items-center'>
        <div className=' text-white'>
          Home
        </div>
        <div className='flex justify-center items-center space-x-5'>
        {
          NavbarItems.map((item, index) => (
            <>
              <FlyoutLink key={index + 1} href={item.href} innerItems={item.innerItems}>
                {item.name}
              </FlyoutLink>
            </>
          ))
        }</div>
        {
          user.login ? <div className=' bg-white text-[#792938] font-medium px-2 py-1.5 w-24 overflow-hidden text-ellipsis'>{user?.address}</div> :
 <Link href={'/auth/login'} className=' bg-white text-[#792938] font-medium px-4 py-1.5'>Login</Link>
        }
        
      </div>
    </>
  )
}

const FlyoutLink = ({ children, href, innerItems }) => {
  const [open, setOpen] = useState(false);

  const showFlyout = innerItems && open;
  return (
    <>
      {innerItems != [] && <div
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className="relative w-fit h-fit"
      >{!(href.includes('about') || href.includes('features') || href.includes('contact')) ?
      <Link href={href} className="relative text-gray-200 hover:text-white">
          {children}
          <span
              style={{
                  transform: showFlyout ? "scaleX(1)" : "scaleX(0)",
              }}
              className="absolute -bottom-2 -left-2 -right-2 h-1 origin-left scale-x-0 rounded-full  bg-white transition-transform duration-300 ease-out"
          />
      </Link>
      :
      <Link1 to={href} className="relative text-gray-200 cursor-pointer hover:text-white" smooth duration={2000}>
          {children}
          <span
              style={{
                  transform: showFlyout ? "scaleX(1)" : "scaleX(0)",
              }}
              className="absolute -bottom-2 -left-2 -right-2 h-1 origin-left scale-x-0 rounded-full  bg-white transition-transform duration-300 ease-out"
          />
      </Link1>
  }
        <AnimatePresence>
          {showFlyout && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              style={{ translateX: "-50%" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute left-1/2 top-12 bg-white z-[1000000000000] text-black"
            >
              <div className="absolute -top-6 left-0 right-0 h-6 bg-transparent" />
              <div className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-white" />
              <InnerContent items={innerItems} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      }</>
  );
};

const InnerContent = ({ items }) => {
  return (<>
    {items = ! null && items.length > 0 &&
      <div className="w-64 bg-white p-6 shadow-xl">
        <div className="mb-6 space-y-3">
          {items.map((item, index) => (
            <Link key={index + 1} href={item?.href} className="block text-sm hover:underline">
              {item?.name}
            </Link>
          ))}
        </div>

      </div>}</>
  );
};