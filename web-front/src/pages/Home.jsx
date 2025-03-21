import React from 'react'
import {useNavigate} from "react-router-dom"

const Home = () => {
  const navigate= useNavigate()
  return (
    <div>
      <div className='flex flex-wrap gap-2 p-4'>
          <div onClick={()=>navigate("/uploadimage")} className='bg-blue-300 p-3 rounded-l cursor-pointer'>
            Upload Image
          </div>
          <div onClick={()=>navigate("/profile")} className='bg-blue-300 p-3 rounded-lg cursor-pointer'>
          profile
          </div>

          <div onClick={()=>navigate("/report/all")} className='bg-blue-300 p-3 rounded-lg cursor-pointer'>
          Report
          </div>

          <div onClick={()=>navigate("/prescription/all")} className='bg-blue-300 p-3 rounded-lg cursor-pointer'>
          Prescription
          </div>

          <div onClick={()=>navigate("/bill/all")} className='bg-blue-300 p-3 rounded-lg cursor-pointer'>
          Bills
          </div>

          <div onClick={()=>navigate("/uploadsymptomp")} className='bg-blue-300 p-3 rounded-lg cursor-pointer'>
          Upload Symptomp
          </div>

          <div onClick={()=>navigate("/uploaddailyfood")} className='bg-blue-300 p-3 rounded-lg cursor-pointer'>
          Upload Dailyfood
          </div>
      </div>
    </div>
  )
}

export default Home