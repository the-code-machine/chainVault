'use client'
import DefaultLayout from "@/components/other/DefaultLayout";
import { useSelector } from "react-redux";
export default function RootLayout({ children }) {
  const user = useSelector((state) => state);

  return (
    <html lang="en">
      <body >
      <DefaultLayout>
       {
        user.login ? children:<div  className=" justify-center items-center flex text-3xl font-semibold h-screen">Login to access the dashboard</div>
       }
    
  
        </DefaultLayout>
        
         </body>
    </html>
  );
}
