import React, { useState, useEffect,useRef } from 'react';
import {api,mediaApi,API_BASE_URL} from "../config/api"
import AlertPop from "../AlertPop"

const ProfileScreen = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [image, setImage] = useState(null);
    const [msg,setMsg]=useState("")
    const [type,setType]=useState("success")
    const [alertVisible, setAlertVisible] = useState(false);
    
    const showAlertFunction = (msg,type) => {
      setAlertVisible(true);
      setType(type)
      setMsg(msg)
      setTimeout(() => {
        setAlertVisible(false);
      }, 2000);
    };

    const form=useRef()
    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const response = await api.get('/auth/profile');
            const userData={name:"",email:"",birth:null,image:"",gender:"",address:"", ... await response.data?.data}
            setUser(userData);
            setFormData(userData);
            if(userData?.image){
                setImage(API_BASE_URL+"/media/img/"+userData?.image+"?token="+localStorage.getItem("jwt"));
            }
            
        } catch (error) {
            console.error('Error fetching user profile:', error);
        } finally {
            setLoading(false);
        }
    };
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    const calculateAge = (birthDate) => {
        const birth = new Date(birthDate);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    const handleInputChange = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleImageUpload = async(event) => {
        try{
            const file = event.target.files[0];
        if (file) {
            const formDataImg=new FormData(form.current)
      if(formDataImg.get("img")?.name ){
               const data=await mediaApi.post('/media/upload',formDataImg)
        showAlertFunction(data?.data?.message,"success")
        await api.post('/auth/updateuser', {image:data?.data?.id[0]});
        const imageUrl = URL.createObjectURL(file);
            setImage(imageUrl);
      }else{
        alert("Don't submit blank fields")
      }
        }
        }catch(error){
            showAlertFunction(error?.response?.data?.message,'warning')
        }
        
    };

    const handleSave = async () => {
        try {
            await api.post('/auth/updateuser', formData);
            setUser(formData);
            setEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    if (loading) return <div className="text-center mt-10 text-xl font-bold">Loading...</div>;

    return (
        <div className="p-6 bg-gradient-to-r from-blue-100 to-purple-100 min-h-screen flex flex-col items-center">
             {alertVisible && <AlertPop message={msg} type={type}/>}
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl border border-gray-300">
                <div className="flex flex-col items-center mb-6">
                    <form ref={form}>
                    <label className="cursor-pointer relative">
                        <img src={image?image: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"} alt="Profile" className="w-32 h-32 rounded-full border-4 border-gray-400 shadow-lg" />
                        <input type="file" name='img' id='img' className="hidden" onChange={handleImageUpload} />
                        <div className="absolute bottom-2 right-2 bg-gray-700 text-white text-xs px-2 py-1 rounded-md">Change</div>
                    </label>
                    </form>
                    <h2 className="text-2xl font-semibold mt-4 text-gray-800">{user?.name}</h2>
                    <p className="text-gray-500 text-lg">{user?.email}</p>
                    {user?.birth && <p className="text-gray-500 ">{calculateAge(user?.birth)} years old</p>}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.keys(formData).map((key) => (
                        key !== '_id' && key !== 'image' && key !== 'createdAt' && (
                            <div key={key} className={`bg-gray-50 p-4 rounded-lg shadow ${key === 'address' ? 'col-span-1 md:col-span-2 w-full' : ''}`}>
                                <label className="block text-gray-700 font-semibold capitalize">{key}</label>
                                {key === 'email' ? (
                                    <input 
                                        className="w-full border border-gray-300 p-2 rounded-md mt-1 bg-gray-200 cursor-not-allowed" 
                                        value={formData[key]} 
                                        disabled
                                    />
                                ) : key === 'birth' ? (
                                    <input 
                                        type="date" 
                                        className="w-full border border-gray-300 p-2 rounded-md mt-1" 
                                        value={formatDate(formData[key])} 
                                        onChange={(e) => handleInputChange(key, e.target.value)}
                                        disabled={!editing}
                                    />
                                ) : key === 'gender' ? (
                                    <select 
                                        className="w-full border border-gray-300 p-2 rounded-md mt-1" 
                                        value={formData[key]} 
                                        onChange={(e) => handleInputChange(key, e.target.value)}
                                        disabled={!editing}
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                ) : key === 'address' ? (
                                    <div className="flex flex-col gap-2 w-full">
                                        {(!user?.address?.length>0 && !editing)&& <span className='mt-3 text-blue-600'>No address availble</span>}
                                        {formData[key].map((addr, index) => (
                                            <div key={index} className="flex gap-2">
                                                <input 
                                                    type="text" 
                                                    className="w-full border border-gray-300 p-2 rounded-md mt-1" 
                                                    value={addr.value} 
                                                    onChange={(e) => {
                                                        const newAddresses = [...formData[key]];
                                                        newAddresses[index].value = e.target.value;
                                                        handleInputChange(key, newAddresses);
                                                    }}
                                                    disabled={!editing}
                                                />
                                                <select 
                                                    className="border border-gray-300 p-2 rounded-md mt-1" 
                                                    value={addr.addressType} 
                                                    onChange={(e) => {
                                                        const newAddresses = [...formData[key]];
                                                        newAddresses[index].addressType = e.target.value;
                                                        handleInputChange(key, newAddresses);
                                                    }}
                                                    disabled={!editing}
                                                >
                                                    <option value="Home">Home</option>
                                                    <option value="Work">Work</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>
                                        ))}
                                        {editing && (
                                            <button 
                                                className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2"
                                                onClick={() => handleInputChange(key, [...formData[key], { value: '', addressType: 'Home' }])}
                                            >
                                                Add Address
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    <input 
                                        className="w-full border border-gray-300 p-2 rounded-md mt-1" 
                                        value={formData[key]} 
                                        onChange={(e) => handleInputChange(key, e.target.value)}
                                        disabled={!editing}
                                    />
                                )}
                            </div>
                        )
                    ))}
                </div>

                <div className="flex justify-between mt-8">

                {editing ? <button 
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg w-full mr-2 hover:bg-blue-700 transition"
                        onClick={() => {setFormData(user);setEditing(!editing)}}
                    >Cancel
                    </button> : <button 
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg w-full mr-2 hover:bg-blue-700 transition"
                        onClick={() => setEditing(!editing)}
                    >Edit Profile
                    </button>}
                    
                    {editing && (
                        <button 
                            className="bg-green-600 text-white px-6 py-3 rounded-lg w-full ml-2 hover:bg-green-700 transition"
                            onClick={handleSave}
                        >
                            Save Changes
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileScreen;
