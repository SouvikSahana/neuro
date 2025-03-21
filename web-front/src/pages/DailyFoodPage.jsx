import React, { useState, useEffect, useRef } from "react";
import { api, API_BASE_URL } from "../config/api";
import { useNavigate } from "react-router-dom";
import FileUploadIcon from '@mui/icons-material/FileUpload';

const DailyFoodPage = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [foodId, setFoodId] = useState("");
  const [food, setFood] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [newItem, setNewItem] = useState("");
  const [newImages, setNewImages] = useState([]);
  const formRef = useRef();

  const navigate = useNavigate();

  // Fetch Daily Food Data
  const fetchFoodData = async () => {
    try {
      const response = await api.get(`/dailyfood/id/${foodId}`);
      setFood(response.data?.data);
      setFormData(response.data?.data);
    } catch (error) {
      console.error("Error fetching daily food:", error);
    }
  };

  useEffect(() => {
    const url = new URL(window.location.href).pathname.split("/");
    setFoodId(url[url.length - 1]);
  }, []);

  useEffect(() => {
    if (foodId !== "") {
      fetchFoodData();
    }
  }, [foodId]);

  // Handle Input Changes
  const handleInputChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Handle Food Items Array Update
  const handleItemChange = (index, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = value;
    setFormData((prev) => ({
      ...prev,
      items: updatedItems,
    }));
  };

  // Add New Food Item
  const addNewItem = () => {
    if (newItem.trim() !== "") {
      setFormData((prev) => ({
        ...prev,
        items: [...prev.items, newItem.trim()],
      }));
      setNewItem("");
    }
  };

  // Remove Food Item
  const removeItem = (index) => {
    const updatedItems = [...formData.items];
    updatedItems.splice(index, 1);
    setFormData((prev) => ({
      ...prev,
      items: updatedItems,
    }));
  };

  // Remove Image from Array
  const removeImage = (index) => {
    const updatedImages = [...formData.images];
    updatedImages.splice(index, 1);
    setFormData((prev) => ({
      ...prev,
      images: updatedImages,
    }));
  };

  // Handle File Change for Image Upload
  const handleFileChange = (e) => {
    e.preventDefault();
    const files = Array.from(e.target.files); 
    const imagePreviews = files.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file), 
    }));

    setSelectedImages(imagePreviews);
    setNewImages(files);
  };

  // Upload New Images
  const uploadNewImages = async () => {
    try {
      const formData = new FormData(formRef.current);
      formData.append("id", foodId);

      const response = await api.post("/dailyfood/uploadimg", formData);
      if (response.data.success) {
        fetchFoodData(); // Refresh after successful upload
        setNewImages([]);
      } else {
        console.error("Error uploading images:", response.data.message);
      }
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };

  // Save Updated Daily Food
  const handleSave = async () => {
    try {
      const formData2 = new FormData();
  
      // ✅ Append New Images Properly
      newImages.forEach((file, index) => {
        formData2.append("img", file); // Send as 'img'
      });
  
      // ✅ Append Symptoms Array
      formData?.items?.forEach((item, index) => {
        formData2.append(`items[${index}]`, item);
      });
  
      // ✅ Append Time Field
      formData2.append("time", formData?.time || "");
  
      // ✅ Append Existing Images to Retain Them
      formData?.images?.forEach((img, index) => {
        formData2.append(`images[${index}]`, img);
      });
      // ✅ Send Data to API
      const response = await api.post(`/dailyfood/update/${foodId}`, formData2,{
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setFood(formData);
      setEditing(false);
      fetchFoodData()
    } catch (error) {
      console.error("Error updating daily food:", error);
    }
  };

  // Delete Food with Images
  const handleDeleteAndImage = async () => {
    try {
      const isOkay = confirm(
        "Are you sure you want to delete this daily food and its images?"
      );
      if (isOkay) {
        await api.post(`/dailyfood/delete`, {
          id: food?._id,
        });
        navigate("/dailyfood/all");
      }
    } catch (error) {
      console.error("Error deleting daily food and images:", error);
    }
  };

  if (!food) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="p-8 bg-gray-100 min-h-screen flex flex-col gap-4 md:flex-row">
      <div>
        {/* Display Food Images */}
        <div className="flex flex-wrap gap-4">
          {formData?.images?.length > 0 ? (
            formData.images.map((img, index) => (
              <div key={index} className="relative">
                <img
                  src={
                    API_BASE_URL +
                    "/media/img/" +
                    img +
                    "?token=" +
                    localStorage.getItem("jwt")
                  }
                  alt={`food-${index}`}
                  className="w-24 h-24 rounded-md object-cover"
                />
                {editing && (
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 rounded-md"
                  >
                    X
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="text-gray-500">No Images Available</div>
          )}
        </div>

        {/* Upload New Images Section */}
        {editing && (
          <form ref={formRef} className="mt-4 flex flex-col gap-2">
          <label htmlFor="img" className='p-3 text-white bg-[#06074C] rounded-[7px]  cursor-pointer max-w-[300px]'>Upload <FileUploadIcon /></label>
            <input
              type="file"
              name="img"
              id="img"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
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
          </form>
        )}
      </div>

      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 border border-gray-300">
        <h2 className="text-2xl font-bold mb-4">Daily Food Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Time Field */}
          <div>
            <label className="block text-gray-700 font-medium">Time</label>
            <input
              type="datetime-local"
              className="w-full border border-gray-300 p-2 rounded-md mt-1"
              value={
                formData.time
                  ? new Date(formData.time).toISOString().slice(0, 16)
                  : ""
              }
              onChange={(e) => handleInputChange("time", e.target.value)}
              disabled={!editing}
            />
          </div>
        </div>

        {/* Food Items List */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Food Items</h3>
          {formData?.items?.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-gray-50 p-4 rounded-md mb-2"
            >
              <input
                type="text"
                className="w-full border border-gray-300 p-2 rounded-md"
                value={item || ""}
                onChange={(e) => handleItemChange(index, e.target.value)}
                disabled={!editing}
              />
              {editing && (
                <button
                  onClick={() => removeItem(index)}
                  className="bg-red-500 text-white px-2 py-1 rounded-md"
                >
                  Remove
                </button>
              )}
            </div>
          ))}

          {editing && (
            <div className="flex gap-2 mt-3">
              <input
                type="text"
                placeholder="Add new item"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-md"
              />
              <button
                onClick={addNewItem}
                className="bg-green-600 text-white px-4 py-2 rounded-md"
              >
                Add
              </button>
            </div>
          )}
        </div>

        {/* Edit / Save Buttons */}
        <div className="flex justify-end mt-6">
          {editing ? (
            <>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2"
                onClick={() => {setEditing(false);setFormData(food)}}
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
            <div className="flex flex-row gap-3">
              <div
                onClick={handleDeleteAndImage}
                className="bg-red-400 w-fit p-2 rounded-lg cursor-pointer"
              >
                Delete Data
              </div>
              <button
                className="bg-blue-600 text-white px-6 py-2 rounded-md"
                onClick={() => setEditing(true)}
              >
                Edit Food
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyFoodPage;
