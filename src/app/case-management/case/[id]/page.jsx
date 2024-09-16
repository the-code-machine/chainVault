"use client";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "@/components/utlis/Loader";
import { useAppSelector } from "@/redux/hooks";
import Home from "../../case-management/uploadDocuments/page";
import Table from "@/components/utlis/Table";
import TableView from "@/components/utlis/TableView";
export default function Page() {
  const pathname = usePathname();
  const caseNumber = pathname.split("/").pop();
  const [caseInfo, setCaseInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCaseInfo = async () => {
      try {
        const response = await axios.get(
          `/api/getCaseByNumber?caseNumber=${caseNumber}`
        );
        if (response.status === 200) {
          setCaseInfo(response.data);
        } else {
          setError(response.data.error || "An error occurred");
        }
      } catch (err) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (caseNumber) {
      fetchCaseInfo();
    }
  }, [caseNumber]);

  if (loading)
    return (
      <>
        <Loader />
      </>
    );
  function formatDate(dateString) {
    const options = { day: "numeric", month: "long", year: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", options);
  }
  return (
    <div>
      <div className="grid grid-cols-5 gap-8">
        <div className="col-span-5 ">
          <div className="rounded-sm flex w-full  items-center justify-between border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Case:#{caseNumber}
              </h3>
            </div>
            <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                {formatDate(caseInfo?.createdAt)}
              </h3>
            </div>

            <Modal />
          </div>
        </div>
      </div>
      <div className=" w-full h-8"></div>
      <TableView />
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
        className="bg-green-600 text-white  px-5 py-3 shadow h-10 mr-5 flex justify-center items-center text-sm font-bold rounded-sm"
      >
        Upload +
      </button>
      {showModal ? (
        <>
          <Home setShowModal={setShowModal} />
        </>
      ) : null}
    </div>
  );
};
