import React, { useState, useEffect, useRef } from "react";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { mediaApi, api, API_BASE_URL } from "../config/api";
import AlertPop from "../AlertPop";
import { useNavigate } from "react-router-dom";

export default function UploadSymptomp() {
  const form = useRef();
  const navigate = useNavigate();

  // State Management
  const [msg, setMsg] = useState("");
  const [type, setType] = useState("success");
  const [alertVisible, setAlertVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [symptom, setSymptom] = useState("");
  const [symptomsList, setSymptomsList] = useState([]);
  const [dateTime, setDateTime] = useState("");

  // Show Alert Message
  const showAlertFunction = (msg, type) => {
    setAlertVisible(true);
    setType(type);
    setMsg(msg);
    setTimeout(() => {
      setAlertVisible(false);
    }, 2000);
  };

  // Handle Image Selection
  const handleFileChange = (e) => {
    e.preventDefault();
    const files = Array.from(e.target.files);
    const imagePreviews = files.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));

    setSelectedImages(imagePreviews);
  };

  // Add Symptom to List
  const addSymptom = () => {
    if (symptom.trim() !== "") {
      setSymptomsList([...symptomsList, symptom]);
      setSymptom("");
    }
  };

  // Remove Symptom from List
  const removeSymptom = (index) => {
    const updatedList = symptomsList.filter((_, i) => i !== index);
    setSymptomsList(updatedList);
  };

  // Handle Image Upload
  const handleImageUpload = async () => {
    try {
      const formData = new FormData(form.current);
      formData.append("symps", JSON.stringify(symptomsList)); // Add symptoms array to formData

      // Add Date and Time
      if (dateTime) {
        formData.append("time", dateTime);
      } else {
        showAlertFunction("Please select a valid date and time", "warning");
        return;
      }

      // if (formData.get("img")?.name) {
        const data = await mediaApi.post("/symptomp/upload", formData);
        showAlertFunction(data?.data?.message, "success");
        navigate("/symptomp/all");
      // } else {
      //   alert("Don't submit blank fields");
      // }
    } catch (error) {
      showAlertFunction(error?.response?.data?.message, "warning");
    }
  };

  return (
    <div className="p-4 rounded-sm m-3">
      {alertVisible && <AlertPop message={msg} type={type} />}

      <div className="h-[80vh]">
        <div className="flex justify-center pb-2 font-bold">
          Upload Symptomps
        </div>

        <div className="flex flex-col gap-2 mb-3">
          <form ref={form} className="flex flex-col gap-3 items-center">
            {/* Symptom Input */}
            <div className="w-full max-w-md">
              <label
                htmlFor="symps"
                className="block text-gray-700 font-medium"
              >
                Symptoms:
              </label>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="text"
                  id="symps"
                  value={symptom}
                  onChange={(e) => setSymptom(e.target.value)}
                  placeholder="Enter a symptom"
                  className="border border-gray-300 p-2 rounded-md w-full"
                />
                <button
                  type="button"
                  onClick={addSymptom}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                  Add
                </button>
              </div>
              {/* Display Added Symptoms */}
              <div className="mt-3">
                {symptomsList.length > 0 ? (
                  <ul className="list-disc list-inside">
                    {symptomsList.map((symp, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center bg-gray-100 p-2 mb-2 rounded-md"
                      >
                        <span>{symp}</span>
                        <button
                          type="button"
                          onClick={() => removeSymptom(index)}
                          className="text-red-500 text-sm"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No symptoms added yet.</p>
                )}
              </div>
            </div>

            {/* Date and Time Input */}
            <div className="w-full max-w-md">
              <label
                htmlFor="time"
                className="block text-gray-700 font-medium mt-3"
              >
                Date & Time:
              </label>
              <input
                type="datetime-local"
                id="time"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                className="border border-gray-300 p-2 rounded-md w-full mt-2"
              />
            </div>

            {/* File Upload */}
            <div className="flex flex-col items-center mt-4">
              <label
                htmlFor="img"
                className="p-3 text-white bg-[#06074C] rounded-[7px] cursor-pointer max-w-[300px]"
              >
                Upload <FileUploadIcon />
              </label>
              <input
                type="file"
                name="img"
                id="img"
                multiple
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
          </form>

          {/* Image Previews */}
          <div className="flex flex-wrap justify-center gap-3 mt-3">
            {selectedImages.map((image, index) => (
              <div key={index} className="relative w-[100px] h-[100px]">
                <img
                  src={image.url}
                  alt={image.name}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Submit & Cancel Buttons */}
      <div className="flex justify-center gap-2 mt-3">
        <button
          className="text-white bg-[#06074C] p-2 rounded-lg min-w-[150px]"
          onClick={(e) => {
            e.preventDefault();
            navigate("/");
          }}
        >
          Cancel
        </button>
        <button
          className="text-white bg-[#06074C] cursor-pointer p-2 rounded-lg min-w-[150px]"
          onClick={handleImageUpload}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
