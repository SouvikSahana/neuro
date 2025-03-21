import { useEffect, useState } from 'react';
import { api, mediaApi, API_BASE_URL } from '../config/api';
import AlertPop from '../AlertPop';

const Images = () => {
  const [images, setImages] = useState([]);
  const [msg, setMsg] = useState('');
  const [type, setType] = useState('success');
  const [alertVisible, setAlertVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});

  const showAlertFunction = (msg, type) => {
    setAlertVisible(true);
    setType(type);
    setMsg(msg);
    setTimeout(() => {
      setAlertVisible(false);
    }, 2000);
  };

  const getImages = async () => {
    try {
      const response = await api.get('/media/files');
      setImages(await response.data?.data);
    } catch (error) {
      showAlertFunction(error?.response?.data?.message, 'warning');
    }
  };

  const deleteImage = async (filename) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        await api.delete(`/media/delete/${filename}`);
        showAlertFunction('Image deleted successfully', 'success');
        getImages();
      } catch (error) {
        showAlertFunction(error?.response?.data?.message, 'warning');
      }
    }
  };

  const handleEditClick = (image) => {
    setEditData({ ...image });
    setEditing(true);
  };

  const handleEditChange = (key, value) => {
    setEditData((prev) => ({ ...prev, metadata: { ...prev.metadata, [key]: value } }));
  };

  const saveEdit = async () => {
    try {
      await api.post(`/media/update/${editData.filename}`, editData);
      showAlertFunction('Image metadata updated successfully', 'success');
      setEditing(false);
      getImages();
    } catch (error) {
      showAlertFunction(error?.response?.data?.message, 'warning');
    }
  };

  useEffect(() => {
    getImages();
  }, []);

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 min-h-screen p-2">
      {alertVisible && <AlertPop message={msg} type={type} />} 

      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Image Gallery</h1>

      <div className="flex flex-wrap justify-center gap-4 ">
        {!images?.length>0 && <p className='text-gray-500 text-lg '>No images found. Please upload first</p>}
        {images?.map((ima, index) => (
          <div key={index} className={(ima?.metadata?.isProcessed || !["report","bill","prescription"].includes(ima?.metadata?.type))?"flex flex-col gap-2 bg-green-100 p-4 rounded-lg shadow-lg relative flex-wrap":"flex flex-col gap-2 bg-red-100 p-4 rounded-lg shadow-lg relative flex-wrap"}>
            <div className='flex-1 flex justify-evenly flex-col'>
            <img
              src={API_BASE_URL + '/media/img/' + ima?.filename + '?token=' + localStorage.getItem('jwt')}
              alt={ima?.filename}
              className="w-[150px] h-auto object-cover rounded-md cursor-pointer hover:scale-105 transition-transform"
              onClick={() => setSelectedImage(ima)}
            />
            <div className="text-sm text-gray-700">
              {/* <div>
                <span className='font-bold'>isProcessed: </span> {String(ima?.metadata?.isProcessed)}
              </div> */}
              <div>
                <span className='font-bold'>Type: </span> {ima?.metadata?.type}
              </div>
              <div>
                <span className='font-bold'>Filename:</span> {ima?.filename}
              </div>
            </div>
            </div>
            {(!ima?.metadata?.isProcessed && ["report","bill","prescription"].includes(ima?.metadata?.type)) && <div className="flex justify-between mt-2">
              {/* <button
                className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 transition"
                onClick={() => deleteImage(ima.filename)}
              >
                Delete
              </button> */}
              <button
                className="bg-yellow-500 text-white px-2 py-1 rounded-md hover:bg-yellow-600 transition"
                onClick={() => handleEditClick(ima)}
              >
                Edit
              </button>
            </div>}
          </div>
        ))}
      </div>

      {selectedImage && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex justify-center items-center z-50 overflow-auto">
          <div className="bg-white p-6 rounded-lg relative max-w-3xl w-full max-h-[90vh] overflow-auto">
            <img
              src={API_BASE_URL + '/media/img/' + selectedImage?.filename + '?token=' + localStorage.getItem('jwt')}
              alt={selectedImage?.filename}
              className="w-full h-auto max-h-[70vh] rounded-md"
            />
            <button
              className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              onClick={() => setSelectedImage(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {editing && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg relative max-w-xl w-full">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Edit Image Metadata</h2>
            <div className="mb-4">
              <label className="block font-semibold text-gray-700">isProcessed:</label>
              <select
                className="w-full border p-2 rounded-md"
                value={editData?.metadata?.isProcessed}
                onChange={(e) => handleEditChange('isProcessed', e.target.value)}
              >
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block font-semibold text-gray-700">Type:</label>
              <select
                className="w-full border p-2 rounded-md"
                value={editData?.metadata?.type}
                onChange={(e) => handleEditChange('type', e.target.value)}
              >
                <option value="report">Report</option>
                <option value="bill">Bill</option>
                <option value="prescription">Prescription</option>
                <option value="tree">Tree</option>
                <option value="medicine">Medicine</option>
                <option value="disease">Disease</option>
                <option value="other">Others</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                onClick={saveEdit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Images;