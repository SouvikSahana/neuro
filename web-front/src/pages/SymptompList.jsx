import React, { useState, useEffect } from "react";
import { api, API_BASE_URL } from "../config/api";
import { useNavigate } from "react-router-dom";

const SymptompList = () => {
  const [symptoms, setSymptoms] = useState([]);
  const navigate = useNavigate();

  // Fetch All Symptoms
  const fetchSymptoms = async () => {
    try {
      const response = await api.get("/symptomp/all"); // Fetch all symptoms
      setSymptoms(response.data?.data);
    } catch (error) {
      console.error("Error fetching symptoms:", error);
    }
  };

  useEffect(() => {
    fetchSymptoms();
  }, []);

  // Open Symptom for Editing / Viewing
  const handleSymptomClick = (symptomId) => {
    navigate("/symptomp/id/" + symptomId);
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6 border border-gray-300">
        <h2 className="text-2xl font-bold mb-4">All Symptoms</h2>

        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse border border-gray-200">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="px-4 py-2 border">Images</th>
                <th className="px-4 py-2 border">Symptoms</th>
                <th className="px-4 py-2 border">Time</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {symptoms?.map((symptom) => (
                <tr
                  key={symptom?._id}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  {/* Display Symptom Images */}
                  <td className="px-4 py-2 border text-center">
                    <div className="flex justify-center gap-2">
                      {symptom?.images?.length > 0 ? (
                        symptom.images.slice(0, 3).map((img, index) => (
                          <img
                            key={index}
                            src={
                              API_BASE_URL +
                              "/media/img/" +
                              img +
                              "?token=" +
                              localStorage.getItem("jwt")
                            }
                            alt={`symptom-${index}`}
                            className="w-12 h-12 rounded-md object-cover"
                          />
                        ))
                      ) : (
                        <span className="text-gray-500">No Images</span>
                      )}
                    </div>
                  </td>

                  {/* Display Symptoms Array */}
                  <td className="px-4 py-2 border text-center">
                    {symptom?.symps?.length > 0 ? (
                      <div className="flex flex-wrap gap-1 justify-center">
                        {symptom.symps.map((s, index) => (
                          <span
                            key={index}
                            className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-500">No Symptoms</span>
                    )}
                  </td>

                  {/* Display Time */}
                  <td className="px-4 py-2 border text-center">
                    {new Date(symptom?.time).toLocaleString()}
                  </td>

                  {/* Actions Button */}
                  <td className="px-4 py-2 border text-center">
                    <button
                      onClick={() => handleSymptomClick(symptom?._id)}
                      className="bg-blue-600 text-white px-4 py-1 rounded-md"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}

              {/* No Symptoms Found */}
              {symptoms.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center text-gray-500 py-4">
                    No symptoms found.
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

export default SymptompList;
