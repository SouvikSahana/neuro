import React, { useState, useEffect } from "react";
import { api ,API_BASE_URL} from "../config/api";
import {useNavigate} from "react-router-dom"

const PrescriptionList = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const navigate= useNavigate()

  // Fetch All Reports
  const fetchPrescriptions = async () => {
    try {
      const response = await api.get("/prescription/all"); // Fetch all reports
      setPrescriptions(response.data?.data);
      console.log(response.data?.data[0])
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };
  useEffect(() => {
    fetchPrescriptions();
  }, []);

  // Open Report for Editing
  const handleReportClick = (prescriptionId) => {
        navigate("/prescription/id/"+prescriptionId)
  };

 

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      
        <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6 border border-gray-300">
          <h2 className="text-2xl font-bold mb-4">All Medical Prescriptions</h2>

          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse border border-gray-200">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="px-4 py-2 border">Image</th>
                  <th className="px-4 py-2 border">Doctor</th>
                  <th className="px-4 py-2 border">Date</th>
                  <th className="px-4 py-2 border">Diseases</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {prescriptions?.map((pres) => (
                  <tr
                    key={pres?._id}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-4 py-2 border text-center">
                      <img
                        src={API_BASE_URL + '/media/img/' + pres?.image + '?token=' + localStorage.getItem('jwt')}
                        alt="report"
                        className="w-12 h-12 rounded-md object-cover"
                      />
                    </td>
                    <td className="px-4 py-2 border text-center">
                      {pres?.doctor || "N/A"}
                    </td>
                    <td className="px-4 py-2 border text-center">
                      {new Date(pres?.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 border text-center">
                      {pres?.diseases.join(", ")|| "N/A"}
                    </td>
                    <td className="px-4 py-2 border text-center">
                      <button
                        onClick={() => handleReportClick(pres?._id)}
                        className="bg-blue-600 text-white px-4 py-1 rounded-md"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}

                {prescriptions.length === 0 && (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center text-gray-500 py-4"
                    >
                      No reports found.
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

export default PrescriptionList
