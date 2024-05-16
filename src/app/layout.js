
import { Inter } from "next/font/google";
import "./globals.css";
import 'react-toastify/dist/ReactToastify.css';
import StoreProvider from "./StoreProvider";
import { LoadData } from "@/components/other/LoadData";
import { Toaster } from "react-hot-toast";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Evault",
  description: "An Legal Records Management System",
};

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body className={inter.className}>
     
       <StoreProvider>
       <LoadData/>
       <Toaster position="bottom-center" />
       <div className="hidden lg:block">
      
        {children}
        </div>
        <div className=" flex justify-center items-center text-xl w-full h-screen p-3 text-center font-semibold lg:hidden">
         This site is blocked for mobile devices due to MetaMask extension requirement. Please use a desktop browser.
        </div>
        </StoreProvider>
         </body>
    </html>
  );
}
