"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Loader from "./Loader";
import { useAppSelector } from "@/redux/hooks";
import Link from "next/link";

export default function TableCases() {
  const [cases, setCases] = useState([]);
  const user = useAppSelector((state) => state.user);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCases = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `/api/create-case?ethreumAddress=${user?.address}`
        );
        if (response.status !== 200) {
          // Handle error response
          const errorData = response.data;
          console.error(errorData.error);
          return;
        }
        setCases(response.data.cases || []);
      } catch (error) {
        // Handle network or other errors
        console.error("Error fetching cases:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.address) {
      fetchCases();
    }
  }, [user?.address]);

  return (
    <div>
      {loading && <Loader />}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white divide-y divide-gray-200 rounded-lg shadow-md">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Case Number
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Title
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Court Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                State
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                View
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {cases.map((caseItem) => (
              <tr key={caseItem._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {caseItem.caseNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {caseItem.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {caseItem.courtName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {caseItem.stateName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link
                    href={`/case-management/case/${caseItem.caseNumber}`}
                    className="px-4 py-1.5 inline-flex text-md leading-5 font-semibold rounded-full bg-primary text-white"
                  >
                    View Case
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
