'use client'
import DefaultLayout from "@/components/other/DefaultLayout";
import { useAppSelector } from "@/redux/hooks";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
export default function RootLayout({ children }) {
  const login = useAppSelector((state) => state.user?.login)

  return (
    <div>

      <DefaultLayout>
        {
          login ? children : <div className=" justify-center items-center flex text-3xl font-semibold h-screen">Login to access the dashboard</div>
        }


      </DefaultLayout>

    </div>
  );
}
