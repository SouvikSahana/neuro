import React, { useState, useEffect } from "react";
import { api, API_BASE_URL } from "../config/api";
import { useNavigate } from "react-router-dom";

const SymptompList = () => {
  const [symptoms, setSymptoms] = useState([]);
  const navigate = useNavigate();

  // Fetch All Symptoms
  const fetchSymptoms = async () => {
    try {
      const response = await api.get("/symptomp/all"); // Fetch all symptom entries
      setSymptoms(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching symptoms:", error);
    }
  };

  useEffect(() => {
    fetchSymptoms();
  }, []);

  // Group Symptom Entries by Date
  const groupByDate = (symptoms) => {
    const groupedData = {};
    symptoms.forEach((symptom) => {
      const date = new Date(symptom?.time).toLocaleDateString(); // Group by date
      if (!groupedData[date]) {
        groupedData[date] = [];
      }
      groupedData[date].push(symptom);
    });

    // Sort entries by time in descending order
    Object.keys(groupedData).forEach((date) => {
      groupedData[date].sort((a, b) => new Date(b.time) - new Date(a.time));
    });

    return groupedData;
  };

  const groupedSymptoms = groupByDate(symptoms);

  // Open Symptom Entry for Editing / Viewing
  const handleSymptomClick = (symptomId) => {
    navigate("/symptomp/id/" + symptomId);
  };

  return (
    <div className="p-2 bg-gray-100 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">All Symptoms</h2>

        {Object.keys(groupedSymptoms).length === 0 ? (
          <div className="text-center text-gray-500">No symptom entries found.</div>
        ) : (
          Object.keys(groupedSymptoms).map((date, index) => (
            <div key={index} className="mb-6">
              {/* Parent Date Section */}
              <div className="text-sm text-gray-600 font-semibold mb-4 bg-gray-100 shadow-md rounded-lg px-4 py-2">
                {date}
              </div>

              {/* Comment-style Symptom Entries (Child Entries) */}
              <div className="flex flex-col gap-4 ml-4 border-l-2 border-gray-500 pl-4">
                {groupedSymptoms[date].map((symptom, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSymptomClick(symptom?._id)}
                    className="bg-white shadow-md p-4 rounded-lg relative cursor-pointer hover:bg-gray-50 transition duration-200"
                  >
                    {/* Time (Sorted by Time Desc) */}
                    <div className="text-sm text-gray-500 mb-1">
                      {new Date(symptom?.time).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>

                    {/* Symptom Images (Only Show if Available) */}
                    {symptom?.images?.length > 0 && (
                      <div className="flex gap-2 mb-3">
                        {symptom.images.slice(0, 3).map((img, i) => (
                          <img
                            key={i}
                            src={
                              API_BASE_URL +
                              "/media/img/" +
                              img +
                              "?token=" +
                              localStorage.getItem("jwt")
                            }
                            alt={`symptom-${i}`}
                            className="w-12 h-12 rounded-md object-cover"
                          />
                        ))}
                      </div>
                    )}

                    {/* Symptom Items as Pills */}
                    {symptom?.symps?.length > 0 && (
                      <div className="flex flex-wrap gap-2 ">
                        {symptom.symps.map((s, i) => (
                          <span
                            key={i}
                            className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}

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

export default SymptompList;
