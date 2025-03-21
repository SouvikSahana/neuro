import React, { useState, useEffect } from "react";
import { api, API_BASE_URL } from "../config/api";
import { useNavigate } from "react-router-dom";

const ReportList = () => {
  const [reports, setReports] = useState([]);
  const navigate = useNavigate();

  // Fetch All Reports
  const fetchReports = async () => {
    try {
      const response = await api.get("/report/all"); // Fetch all reports
      setReports(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Group Reports by Date
  const groupByDate = (reports) => {
    const groupedData = {};
    reports.forEach((report) => {
      const date = new Date(report?.date).toLocaleDateString(); // Group by date
      if (!groupedData[date]) {
        groupedData[date] = [];
      }
      groupedData[date].push(report);
    });

    // Sort reports by time in descending order
    Object.keys(groupedData).forEach((date) => {
      groupedData[date].sort((a, b) => new Date(b.date) - new Date(a.date));
    });

    return groupedData;
  };

  const groupedReports = groupByDate(reports);

  // Open Report for Viewing
  const handleReportClick = (reportId) => {
    navigate("/report/id/" + reportId);
  };

  return (
    <div className="p-2 bg-gray-100 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">
          All Medical Reports
        </h2>

        {Object.keys(groupedReports).length === 0 ? (
          <div className="text-center text-gray-500">No reports found.</div>
        ) : (
          Object.keys(groupedReports).map((date, index) => (
            <div key={index} className="mb-6">
              {/* Parent Date Section */}
              <div className="text-sm text-gray-600 font-semibold mb-4 bg-gray-100 shadow-md rounded-lg px-4 py-2">
                {date}
              </div>

              {/* Comment-style Report Entries (Child Entries) */}
              <div className="flex flex-col gap-4 ml-4 border-l-2 border-gray-500 pl-4">
                {groupedReports[date].map((report, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleReportClick(report?._id)}
                    className="bg-white shadow-md p-4 rounded-lg relative cursor-pointer hover:bg-gray-50 transition duration-200"
                  >
                    {/* Time (Sorted by Time Desc) */}
                    <div className="text-sm text-gray-500 mb-1">
                      {new Date(report?.date).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>

                    {/* Report Image (If Available) */}
                    {report?.image && (
                      <div className="flex justify-start gap-2 mb-3">
                        <img
                          src={`${API_BASE_URL}/media/img/${report?.image}?token=${localStorage.getItem(
                            "jwt"
                          )}`}
                          alt="report"
                          className="w-12 h-12 rounded-md object-cover"
                        />
                      </div>
                    )}

                    {/* Report Details as Pills */}
                    <div className="flex flex-wrap gap-2 mb-1">
                     {report?.refBy?.length>2 && <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs">
                        Ref : {report?.refBy}
                      </span>}
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md text-xs">
                         Lab : {report?.labName || "N/A"}
                      </span>
                      {report?.values?.map((rep)=>{
                        return(
                            <span className="bg-purple-100 text-red-700 px-2 py-1 rounded-md text-xs">
                            {rep?.testName +": "+rep?.testValue}
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

export default ReportList;
