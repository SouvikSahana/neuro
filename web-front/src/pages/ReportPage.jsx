import React, { useState, useEffect } from "react";
import {api,API_BASE_URL} from "../config/api"
import { useNavigate } from "react-router-dom";

const ReportPage = () => {
  const [reportId,setReportId]= useState("")
  const [report, setReport] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  const navigate= useNavigate()
  // Fetch Report Data
  const fetchReportData = async () => {
    try {
      const response = await api.get(`/report/id/${reportId}`);
      // console.log(response)
      setReport(response.data?.data);
      setFormData(response.data?.data);
    } catch (error) {
      console.error("Error fetching report:", error);
    }
  };

  useEffect(()=>{
    const url= new URL(window.location.href).pathname.split("/")
    setReportId(url[url.length-1])
  },[])

  useEffect(() => {
    if(!reportId==""){
      fetchReportData();
    }
  }, [reportId]);

  // Handle Input Changes
  const handleInputChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Handle Values Update
  const handleValueChange = (index, key, value) => {
    const updatedValues = [...formData.values];
    updatedValues[index][key] = value;
    setFormData((prev) => ({
      ...prev,
      values: updatedValues,
    }));
  };

  // Add New Test Field
  const addNewTestField = () => {
    setFormData((prev) => ({
      ...prev,
      values: [
        ...prev.values,
        { testName: "", testValue: "", testUnit: "", testMethod: "" },
      ],
    }));
  };

  // Save Updated Report
  const handleSave = async () => {
    try {
      // console.log(formData)
      await api.post(`/report/update`, formData);
      setReport(formData);
      setEditing(false);
    } catch (error) {
      console.error("Error updating report:", error);
    }
  };


  const handleDelete=async()=>{
    try{
        const isOkay= confirm("Are you sure wanna delete this Report")
        if(isOkay){
            await api.get("/report/delete/"+report?._id)
        navigate("/report/all")
        }
    }catch(error){
        console.log(error)
    }
  }
  const handleDeleteAndImage=async()=>{
    try{
        const isOkay= confirm("Are you sure wanna delete this Report")
        if(isOkay){
            await api.get("/report/deleteimg/"+report?._id)
        navigate("/report/all")
        }
        
    }catch(error){
        console.log(error)
    }
  }

  if (!report) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="p-8 bg-gray-100 min-h-screen flex flex-col gap-4 md:flex-row">
      <div>
        <img src={API_BASE_URL + '/media/img/' + report?.image + '?token=' + localStorage.getItem('jwt')}
              alt={report?.image} className="max-w-[300px] mx-auto" />
        <div className="flex flex-row justify-evenly mt-4">
            <div onClick={handleDelete} className="bg-red-300 w-fit p-2 rounded-lg cursor-pointer">Delete Only Data</div>
            <div onClick={handleDeleteAndImage} className="bg-red-400 w-fit p-2 rounded-lg cursor-pointer">Delete All (+img)</div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 border border-gray-300">
        <h2 className="text-2xl font-bold mb-4">Medical Report</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Static Fields */}
          {[
            // "image",
            "refBy",
            "processedAt",
            "date",
            "labName",
            "labAddress",
            "labMobile",
            "labEmail",
            "remark",
          ].map((key) => (
            <div key={key}>
              <label className="block text-gray-700 font-medium capitalize">
                {key.replace(/([A-Z])/g, " $1").trim()}
              </label>
              <input
                type={key.includes("date") ? "date" : "text"}
                className="w-full border border-gray-300 p-2 rounded-md mt-1"
                value={
                  key.includes("date") && formData[key]
                    ? new Date(formData[key]).toISOString().split("T")[0]
                    : formData[key] || ""
                }
                onChange={(e) => handleInputChange(key, e.target.value)}
                disabled={!editing}
              />
            </div>
          ))}
        </div>

        {/* Test Values */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Test Values</h3>
          {formData?.values?.map((test, index) => (
            <div
              key={index}
              className="flex flex-wrap gap-4 bg-gray-50 p-4 rounded-md mb-4"
            >
              {["testName", "testValue", "testUnit", "testMethod"].map((key) => (
                <div key={key} className="w-full md:w-1/4">
                  <label className="block text-gray-700 font-medium capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </label>
                  <input
                    type={key === "testValue" ? "number" : "text"}
                    className="w-full border border-gray-300 p-2 rounded-md mt-1"
                    value={test[key] || ""}
                    onChange={(e) =>
                      handleValueChange(index, key, e.target.value)
                    }
                    disabled={!editing}
                  />
                </div>
              ))}
            </div>
          ))}

          {editing && (
            <button
              onClick={addNewTestField}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Add Test
            </button>
          )}
        </div>

        {/* Edit / Save Buttons */}
        <div className="flex justify-end mt-6">
          {editing ? (
            <>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2"
                onClick={() => {setEditing(false);setFormData(report)}}
              >
                Cancel
              </button>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded-md"
                onClick={handleSave}
              >
                Save Changes
              </button>
            </>
          ) : (
            <button
              className="bg-blue-600 text-white px-6 py-2 rounded-md"
              onClick={() => setEditing(true)}
            >
              Edit Report
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
