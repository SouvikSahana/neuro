import React,{useState, useEffect, useRef} from "react"
import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { mediaApi, api, API_BASE_URL } from "../config/api";
import AlertPop from "../AlertPop"
import {useNavigate} from "react-router-dom"

export default function UploadImage() {
  const form=useRef()

  const [msg,setMsg]=useState("")
    const [type,setType]=useState("success")
    const [alertVisible, setAlertVisible] = useState(false);

    const navigate= useNavigate();
    
    const showAlertFunction = (msg,type) => {
      setAlertVisible(true);
      setType(type)
      setMsg(msg)
      setTimeout(() => {
        setAlertVisible(false);
      }, 2000);
    };

    const [selectedImages, setSelectedImages] = useState([]);

  const handleFileChange = (e) => {
    e.preventDefault();
    const files = Array.from(e.target.files); 
    const imagePreviews = files.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file), 
    }));

    setSelectedImages(imagePreviews);
  };

  const handleImageUpload = async() => {
    try{
      const formData=new FormData(form.current)
      if(formData.get("img")?.name && formData.get("type")){
               const data=await mediaApi.post('/media/upload',formData)
        showAlertFunction(data?.data?.message,"success")
        navigate("/images")
      }else{
        alert("Don't submit blank fields")
      }
   
    }catch(error){
        showAlertFunction(error?.response?.data?.message,'warning')
    }
  };
  

  return (
      <div className='p-4  rounded-sm m-3'>
        {alertVisible && <AlertPop message={msg} type={type}/>}
    
        <div className="h-[80vh]">
          <div className=" flex justify-center pb-2 font-bold">Upload Images</div>
        <div className='flex flex-col gap-2 mb-3'>
        <form ref={form} className="flex flex-col gap-3 items-center">

        <TextField label="Order Sub-Type" name='type' id='type' defaultValue={""} select required sx={{margin:1,width:200}}>
                <MenuItem value="report">Report</MenuItem>
                <MenuItem value="bill">Bill</MenuItem>
                <MenuItem value="prescription">Prescription</MenuItem>
                <MenuItem value="tree">Tree</MenuItem>
                <MenuItem value="medicine">Medicine</MenuItem>
                <MenuItem value="disease">Disease</MenuItem>
            </TextField>
         <div className="flex flex-col items-center ">
            <label htmlFor="img" className='p-3 text-white bg-[#06074C] rounded-[7px]  cursor-pointer max-w-[300px]'>Upload <FileUploadIcon /></label>
            <input type="file" name="img" id="img" multiple  className="hidden"  accept="image/*" onChange={handleFileChange}/>
        </div>
          </form>

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

       

        <div className='flex justify-center gap-2 mt-3'>
        <button className='text-white bg-[#06074C] p-2 rounded-lg min-w-[150px]' onClick={(e)=>{e.preventDefault(); navigate("/")}} >
            Cancel
          </button>
           { <button className='text-white bg-[#06074C] cursor-pointer p-2 rounded-lg min-w-[150px]' onClick={handleImageUpload}>
            Submit
          </button>}
      </div>
      </div>

  )
}
