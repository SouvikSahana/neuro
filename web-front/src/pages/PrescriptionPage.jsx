import React, { useState, useEffect } from "react";
import { api, API_BASE_URL } from "../config/api";
import { useNavigate } from "react-router-dom";

const PrescriptionPage = () => {
  const [prescriptionId, setPrescriptionId] = useState("");
  const [prescription, setPrescription] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  const navigate= useNavigate()
  // Fetch Prescription Data
  const fetchPrescriptionData = async () => {
    try {
      const response = await api.get(`/prescription/id/${prescriptionId}`);
      setPrescription(response.data?.data);
      setFormData(response.data?.data);
    } catch (error) {
      console.error("Error fetching prescription:", error);
    }
  };

  useEffect(() => {
    const url = new URL(window.location.href).pathname.split("/");
    console.log(url)
    setPrescriptionId(url[url.length - 1]);
  }, []);

  useEffect(() => {
    if (prescriptionId !== "") {
      fetchPrescriptionData();
    }
  }, [prescriptionId]);

  // Handle Input Changes
  const handleInputChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Handle Array Field Changes
  const handleArrayChange = (field, index, value) => {
    const updatedArray = [...formData[field]];
    updatedArray[index] = value;
    setFormData((prev) => ({
      ...prev,
      [field]: updatedArray,
    }));
  };

  // Add New Array Field
  const addNewArrayField = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  // Remove Array Field
  const removeArrayField = (field, index) => {
    const updatedArray = [...formData[field]];
    updatedArray.splice(index, 1);
    setFormData((prev) => ({
      ...prev,
      [field]: updatedArray,
    }));
  };

  // Save Updated Prescription
  const handleSave = async () => {
    try {
      await api.put(`/prescription/id/${prescriptionId}`, formData);
      setPrescription(formData);
      setEditing(false);
    } catch (error) {
      console.error("Error updating prescription:", error);
    }
  };
  const handleDelete=async()=>{
    try{
        const isOkay= confirm("Are you sure wanna delete this Prescription")
        if(isOkay){
            await api.get("/prescription/delete/"+prescription?._id)
        navigate("/prescription/all")
        }
    }catch(error){
        console.log(error)
    }
  }
  const handleDeleteAndImage=async()=>{
    try{
        const isOkay= confirm("Are you sure wanna delete this Prescription")
        if(isOkay){
            await api.get("/prescription/deleteimg/"+prescription?._id)
        navigate("/prescription/all")
        }
        
    }catch(error){
        console.log(error)
    }
  }

  if (!prescription) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="p-8 bg-gray-100 min-h-screen flex flex-col gap-4 md:flex-row">
      {/* Image Preview */}
      <div>
        <img
          src={`${API_BASE_URL}/media/img/${prescription?.image}?token=${localStorage.getItem("jwt")}`}
          alt={prescription?.image}
          className="max-w-[300px] mx-auto"
        />
        <div className="flex flex-row justify-evenly mt-4">
            <div onClick={handleDelete} className="bg-red-300 w-fit p-2 rounded-lg cursor-pointer">Delete Only Data</div>
            <div onClick={handleDeleteAndImage} className="bg-red-400 w-fit p-2 rounded-lg cursor-pointer">Delete All (+img)</div>
        </div>
      </div>

      {/* Prescription Details */}
      <div className="max-w-4xl mx-auto bg-white flex-1 shadow-lg rounded-lg p-6 border border-gray-300 ">
        <h2 className="text-2xl font-bold mb-4">Prescription Details</h2>

        {/* Static Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            "doctor",
            "doctorMobile",
            "regnNo",
            "date",
            "processedAt",
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

        {/* Array Fields: Degrees, Diseases, Medicines */}
        {["degrees", "diseases", "medicines"].map((field) => (
          <div className="mt-6" key={field}>
            <h3 className="text-xl font-semibold mb-2 capitalize">{field}</h3>
            {formData[field]?.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-4 mb-2 bg-gray-50 p-2 rounded-md"
              >
                <input
                  type="text"
                  className="w-full border border-gray-300 p-2 rounded-md"
                  value={item || ""}
                  onChange={(e) =>
                    handleArrayChange(field, index, e.target.value)
                  }
                  disabled={!editing}
                />
                {editing && (
                  <button
                    onClick={() => removeArrayField(field, index)}
                    className="bg-red-500 text-white px-2 py-1 rounded-md"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            {editing && (
              <button
                onClick={() => addNewArrayField(field)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2"
              >
                Add {field.slice(0, -1)}
              </button>
            )}
          </div>
        ))}

        {/* Edit / Save Buttons */}
        <div className="flex justify-end mt-6">
          {editing ? (
            <>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2"
                onClick={() => setEditing(false)}
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
              Edit Prescription
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrescriptionPage;
