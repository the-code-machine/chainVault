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
                Create New Case
              </h3>
            </div>
            <Modal />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-8 mt-10">
        <div className="col-span-5 ">
          <div className="">
            <div className="border-b border-stroke py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Recent Cases
              </h3>
            </div>
          </div>
        </div>
      </div>
      <TableCases />
    </div>
  );
}
const Modal = () => {
  const [showModal, setShowModal] = useState(false);
  const address = useAppSelector((state) => state.user?.address);
  const [formData, setFormData] = useState({
    caseNumber: "",
    title: "",
    courtName: "",
    stateName: "",
    date: "",
  });
  const [error, setError] = useState(null); // Error state for better error handling

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Ensure formData and address are available
    if (!formData || !address) {
      toast.error("Form data or address is missing");
      return;
    }

    // Add ethreumAddress to form data
    const payload = {
      ...formData,
      ethreumAddress: address, // Assuming ethreumAddress comes from the user's Redux state
    };
    console.log(payload);
    try {
      const response = await axios.post("/api/create-case", payload);

      toast.success("Case created successfully");
      setShowModal(false); // Close the modal after submission
      setError(null); // Reset error state
    } catch (error) {
      console.error("Error creating case:", error);
      toast.error(`Error creating case: ${error.message || "Unknown error"}`);
    }
  };

  return (
    <div>
      <button
        onClick={() => setShowModal(true)}
        className="bg-red-600 text-white w-10 h-10 mr-5 flex justify-center items-center text-xl font-bold rounded-sm"
      >
        +
      </button>
      {showModal ? (
        <>
          <div className="justify-center w-full items-center grid place-content-center place-items-center grid-cols-5 overflow-x-hidden overflow-y-auto fixed inset-0 z-[999] outline-none focus:outline-none">
            <div className="relative my-6 w-1/2 col-span-5">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="text-3xl font-semibold">Create Case</h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                <div className="relative p-6 flex-auto">
                  {error && <p className="text-red-600 mb-4">{error}</p>}
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="caseNumber"
                      >
                        Case Number
                      </label>
                      <input
                        id="caseNumber"
                        name="caseNumber"
                        type="text"
                        className="border rounded w-full py-2 px-3 text-gray-700"
                        value={formData.caseNumber}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="title"
                      >
                        Title
                      </label>
                      <input
                        id="title"
                        name="title"
                        type="text"
                        className="border rounded w-full py-2 px-3 text-gray-700"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="courtName"
                      >
                        Court Name
                      </label>
                      <input
                        id="courtName"
                        name="courtName"
                        type="text"
                        className="border rounded w-full py-2 px-3 text-gray-700"
                        value={formData.courtName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="stateName"
                      >
                        State Name
                      </label>
                      <input
                        id="stateName"
                        name="stateName"
                        type="text"
                        className="border rounded w-full py-2 px-3 text-gray-700"
                        value={formData.stateName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="date"
                      >
                        Date
                      </label>
                      <input
                        id="date"
                        name="date"
                        type="date"
                        className="border rounded w-full py-2 px-3 text-gray-700"
                        value={formData.date}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="flex items-center justify-end">
                      <button
                        className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="button"
                        onClick={() => setShowModal(false)}
                      >
                        Close
                      </button>
                      <button
                        className="bg-primary text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="submit"
                      >
                        Submit Case
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </div>
  );
};
