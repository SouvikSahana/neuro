import React, { useState, useEffect } from "react";
import { api, API_BASE_URL } from "../config/api";
import { useNavigate } from "react-router-dom";

const BillPage = () => {
  const [billId, setBillId] = useState("");
  const [bill, setBill] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  const navigate= useNavigate()

  // Fetch Bill Data
  const fetchBillData = async () => {
    try {
      const response = await api.get(`/bill/id/${billId}`);
    //   console.log(response.data?.data)
      setBill(response.data?.data);
      setFormData(response.data?.data);
    } catch (error) {
      console.error("Error fetching bill:", error);
    }
  };

  useEffect(() => {
    const url = new URL(window.location.href).pathname.split("/");
    setBillId(url[url.length - 1]);
  }, []);

  useEffect(() => {
    if (billId !== "") {
      fetchBillData();
    }
  }, [billId]);

  // Handle Input Changes
  const handleInputChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Handle Medicine Field Changes
  const handleMedicineChange = (index, key, value) => {
    const updatedMedicines = [...formData.medicines];
    updatedMedicines[index][key] = value;
    setFormData((prev) => ({
      ...prev,
      medicines: updatedMedicines,
    }));
  };

  // Add New Medicine Field
  const addNewMedicineField = () => {
    setFormData((prev) => ({
      ...prev,
      medicines: [...prev.medicines, { name: "", amount: 0 }],
    }));
  };

  // Save Updated Bill
  const handleSave = async () => {
    try {
      await api.post(`/bill/update`, formData); // Update API
    // console.log(formData)
      setBill(formData);
      setEditing(false);
    } catch (error) {
      console.error("Error updating bill:", error);
    }
  };
  const handleDelete=async()=>{
    try{
        const isOkay= confirm("Are you sure wanna delete this Bill")
        if(isOkay){
            await api.get("/bill/delete/"+bill?._id)
        navigate("/bill/all")
        }
    }catch(error){
        console.log(error)
    }
  }
  const handleDeleteAndImage=async()=>{
    try{
        const isOkay= confirm("Are you sure wanna delete this Bill")
        if(isOkay){
            await api.get("/bill/deleteimg/"+bill?._id)
        navigate("/bill/all")
        }
        
    }catch(error){
        console.log(error)
    }
  }

  if (!bill) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="p-8 bg-gray-100 min-h-screen flex flex-col gap-4 md:flex-row">
      <div>
        <img
          src={`${API_BASE_URL}/media/img/${bill?.image}?token=${localStorage.getItem("jwt")}`}
          alt={bill?.image}
          className="max-w-[300px] mx-auto"
        />
        <div className="flex flex-row justify-evenly mt-4">
            <div onClick={handleDelete} className="bg-red-300 w-fit p-2 rounded-lg cursor-pointer">Delete Only Data</div>
            <div onClick={handleDeleteAndImage} className="bg-red-400 w-fit p-2 rounded-lg cursor-pointer">Delete All (+img)</div>
        </div>
      </div>
      <div className="max-w-4xl flex-1 mx-auto bg-white shadow-lg rounded-lg p-6 border border-gray-300">
        <h2 className="text-2xl font-bold mb-4">Medical Bill</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Static Fields */}
          {[
            "shop",
            "shopAddress",
            "shopMobile",
            "shopEmail",
            "date",
            "processedAt",
            "amount",
            "finalAmount",
            "remark",
          ].map((key) => (
            <div key={key}>
              <label className="block text-gray-700 font-medium capitalize">
                {key.replace(/([A-Z])/g, " $1").trim()}
              </label>
              <input
                type={
                  key.includes("date")
                    ? "date"
                    : key === "amount" || key === "finalAmount"
                    ? "number"
                    : "text"
                }
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

        {/* Medicines List */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Medicines</h3>
          {formData?.medicines?.map((medicine, index) => (
            <div
              key={index}
              className="flex flex-row flex-wrap   bg-gray-50 p-4 rounded-md mb-4"
            >
              {["name", "amount"].map((key) => (
                <div key={key} className="w-full md:w-1/2 p-2">
                  <label className="block text-gray-700 font-medium capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </label>
                  <input
                    type={key === "amount" ? "number" : "text"}
                    className="w-full border border-gray-300 p-2 rounded-md mt-1"
                    value={medicine[key] || ""}
                    onChange={(e) =>
                      handleMedicineChange(index, key, e.target.value)
                    }
                    disabled={!editing}
                  />
                </div>
              ))}
            </div>
          ))}

          {editing && (
            <button
              onClick={addNewMedicineField}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Add Medicine
            </button>
          )}
        </div>

        {/* Edit / Save Buttons */}
        <div className="flex justify-end mt-6">
          {editing ? (
            <>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2"
                onClick={() => {setEditing(false);setFormData(bill)}}
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
              Edit Bill
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BillPage;
