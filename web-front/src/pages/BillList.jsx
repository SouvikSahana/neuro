import React, { useState, useEffect } from "react";
import { api, API_BASE_URL } from "../config/api";
import { useNavigate } from "react-router-dom";

const BillList = () => {
  const [bills, setBills] = useState([]);
  const navigate = useNavigate();

  // Fetch All Bills
  const fetchBills = async () => {
    try {
      const response = await api.get("/bill/all"); // Fetch all bills
      setBills(response.data?.data);
    } catch (error) {
      console.error("Error fetching bills:", error);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  // Open Bill for Viewing
  const handleBillClick = (billId) => {
    navigate("/bill/id/" + billId);
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6 border border-gray-300">
        <h2 className="text-2xl font-bold mb-4">All Medical Bills</h2>

        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse border border-gray-200">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="px-4 py-2 border">Image</th>
                <th className="px-4 py-2 border">Shop Name</th>
                <th className="px-4 py-2 border">Date</th>
                <th className="px-4 py-2 border">Amount</th>
                <th className="px-4 py-2 border">Final Amount</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bills?.map((bill) => (
                <tr
                  key={bill?._id}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-4 py-2 border text-center">
                    <img
                      src={`${API_BASE_URL}/media/img/${bill?.image}?token=${localStorage.getItem("jwt")}`}
                      alt="bill"
                      className="w-12 h-12 rounded-md object-cover"
                    />
                  </td>
                  <td className="px-4 py-2 border text-center">
                    {bill?.shop || "N/A"}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    {bill?.date
                      ? new Date(bill?.date).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    ₹{bill?.amount?.toFixed(2) || "0.00"}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    ₹{bill?.finalAmount?.toFixed(2) || "0.00"}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    <button
                      onClick={() => handleBillClick(bill?._id)}
                      className="bg-blue-600 text-white px-4 py-1 rounded-md"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}

              {bills.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center text-gray-500 py-4"
                  >
                    No bills found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BillList;
