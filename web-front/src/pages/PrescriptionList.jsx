import React, { useState, useEffect } from "react";
import { api, API_BASE_URL } from "../config/api";
import { useNavigate } from "react-router-dom";

const PrescriptionList = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const navigate = useNavigate();

  // Fetch All Prescriptions
  const fetchPrescriptions = async () => {
    try {
      const response = await api.get("/prescription/all"); // Fetch all prescriptions
      setPrescriptions(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  // Group Prescriptions by Date
  const groupByDate = (prescriptions) => {
    const groupedData = {};
    prescriptions.forEach((pres) => {
      const date = new Date(pres?.date).toLocaleDateString(); // Group by date
      if (!groupedData[date]) {
        groupedData[date] = [];
      }
      groupedData[date].push(pres);
    });

    // Sort prescriptions by time in descending order
    Object.keys(groupedData).forEach((date) => {
      groupedData[date].sort((a, b) => new Date(b.date) - new Date(a.date));
    });

    return groupedData;
  };

  const groupedPrescriptions = groupByDate(prescriptions);

  // Open Prescription for Viewing
  const handlePrescriptionClick = (prescriptionId) => {
    navigate("/prescription/id/" + prescriptionId);
  };

  return (
    <div className="p-2 bg-gray-100 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">
          All Medical Prescriptions
        </h2>

        {Object.keys(groupedPrescriptions).length === 0 ? (
          <div className="text-center text-gray-500">No prescriptions found.</div>
        ) : (
          Object.keys(groupedPrescriptions).map((date, index) => (
            <div key={index} className="mb-6">
              {/* Parent Date Section */}
              <div className="text-sm text-gray-600 font-semibold mb-4 bg-gray-100 shadow-md rounded-lg px-4 py-2">
                {date}
              </div>

              {/* Comment-style Prescription Entries (Child Entries) */}
              <div className="flex flex-col gap-4 ml-4 border-l-2 border-gray-500 pl-4">
                {groupedPrescriptions[date].map((pres, idx) => (
                  <div
                    key={idx}
                    onClick={() => handlePrescriptionClick(pres?._id)}
                    className="bg-white shadow-md p-4 rounded-lg relative cursor-pointer hover:bg-gray-50 transition duration-200"
                  >
                    {/* Time (Sorted by Time Desc) */}
                    <div className="text-sm text-gray-500 mb-1">
                      {new Date(pres?.date).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>

                    {/* Prescription Image (If Available) */}
                    {pres?.image && (
                      <div className="flex justify-start gap-2 mb-3">
                        <img
                          src={`${API_BASE_URL}/media/img/${pres?.image}?token=${localStorage.getItem(
                            "jwt"
                          )}`}
                          alt="prescription"
                          className="w-12 h-12 rounded-md object-cover"
                        />
                      </div>
                    )}

                    {/* Prescription Details as Pills */}
                    <div className="flex flex-wrap gap-2 mb-1 ">
                      {pres?.doctor && <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs">
                        {pres?.doctor || "N/A"}
                      </span>}
                      {pres?.diseases?.map((dis,index)=>{
                        return(
                            <span key={index} className="bg-red-100 text-red-700 px-2 py-1 rounded-md text-xs">
                            {dis}
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

export default PrescriptionList;
