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
      setBills(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching bills:", error);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  // Group Bills by Date
  const groupByDate = (bills) => {
    const groupedData = {};
    bills.forEach((bill) => {
      const date = new Date(bill?.date).toLocaleDateString(); // Group by date
      if (!groupedData[date]) {
        groupedData[date] = [];
      }
      groupedData[date].push(bill);
    });

    // Sort entries by time in descending order
    Object.keys(groupedData).forEach((date) => {
      groupedData[date].sort((a, b) => new Date(b.date) - new Date(a.date));
    });

    return groupedData;
  };

  const groupedBills = groupByDate(bills);

  // Open Bill Entry for Viewing
  const handleBillClick = (billId) => {
    navigate("/bill/id/" + billId);
  };

  return (
    <div className="p-2 bg-gray-100 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">All Medical Bills</h2>

        {Object.keys(groupedBills).length === 0 ? (
          <div className="text-center text-gray-500">No bills found.</div>
        ) : (
          Object.keys(groupedBills).map((date, index) => (
            <div key={index} className="mb-6">
              {/* Parent Date Section */}
              <div className="text-sm text-gray-600 font-semibold mb-4 bg-gray-100 shadow-md rounded-lg px-4 py-2">
                {date}
              </div>

              {/* Comment-style Bill Entries (Child Entries) */}
              <div className="flex flex-col gap-4 ml-4 border-l-2 border-gray-500 pl-4">
                {groupedBills[date].map((bill, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleBillClick(bill?._id)}
                    className="bg-white shadow-md p-4 rounded-lg relative cursor-pointer hover:bg-gray-50 transition duration-200"
                  >
                    {/* Time (Sorted by Time Desc) */}
                    <div className="text-sm text-gray-500 mb-1">
                      {new Date(bill?.date).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>

                    {/* Bill Image (Only Show if Available) */}
                    {bill?.image && (
                      <div className="flex justify-start gap-2 mb-3">
                        <img
                          src={
                            `${API_BASE_URL}/media/img/${bill?.image}?token=${localStorage.getItem("jwt")}`
                          }
                          alt="bill"
                          className="w-12 h-12 rounded-md object-cover"
                        />
                      </div>
                    )}

                    {/* Bill Details as Pills */}
                    <div className="flex flex-wrap gap-2 mb-1">
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs">
                        Shop: {bill?.shop || "N/A"}
                      </span>
                      
                      <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-md text-xs">
                        Amount: ₹{bill?.finalAmount?.toFixed(2) || "0.00"}
                      </span>
                      {bill?.medicines?.map((medi,index)=>{
                        return(
                            <span key={index} className="bg-green-100 text-green-700 px-2 py-1 rounded-md text-xs">
                        {medi?.name}
                            </span>
                        )
                      })}
                    </div>

                    {/* Curved Border to Connect Comments */}
                    <div className="absolute left-[-18px] top-8 w-4 h-4 border-l-2 border-b-2 border-gray-500 rounded-bl-md"></div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BillList;
