"use client";
import { useAppSelector } from "@/redux/hooks";
import { selectUserAddress } from "@/redux/selector";
import React from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import axios from "axios";
import TableCases from "@/components/utlis/TableCases";
export default function Home() {
  return (
    <div>
      <div className="grid grid-cols-5 gap-8">
        <div className="col-span-5 ">
          <div className="rounded-sm flex w-full  items-center justify-between border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                History
              </h3>
            </div>
          </div>
        </div>
      </div>

      <TableCases />
    </div>
  );
}
