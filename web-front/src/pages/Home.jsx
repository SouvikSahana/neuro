import React,{useState,useEffect} from 'react'
import {useNavigate} from "react-router-dom"
import { api } from '../config/api'

const Home = () => {
  const [medicines,setMedicines]= useState([])
  const [symptomps,setSymptomps]= useState([])
  const navigate= useNavigate()
  const paths=[
    {
      title:" Upload Image",
      path:"/uploadimage"
    },
    {
      title:"Report",
      path:"/report/all"
    },
    {
      title:"Prescription",
      path:"/prescription/all"
    },
    {
      title:"Bills",
      path:"/bill/all"
    },
    {
      title:"Symptomps",
      path:"/symptomp/all"
    },
    {
      title:"Daily Food Intake",
      path:"/dailyfood/all"
    },
    {
      title:"Images",
      path:"/images"
    }
  ]

  const fetchData=async()=>{
    try{
      const response=await api.get("/prescription/dm/all")
      setMedicines(await response?.data?.data)
      const response1=await api.get("/symptomp/ds/all")
      setSymptomps(await response1?.data?.data)
    }catch(error){
      console.log(error)
    }
  }

  useEffect(()=>{
    fetchData()
  },[])
  return (
    <div className='pb-4'>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 p-2 max-w-[800px] mx-auto mt-4 '>
      {paths?.map((p, index) => (
          <div
            key={index}
            onClick={() => navigate(p?.path)}
            className=" h-20 sm:h-25 md:h-32 flex items-center justify-center text-center bg-gradient-to-br select-none from-blue-400 to-blue-600 text-white font-semibold p-3 rounded-lg cursor-pointer shadow-md hover:scale-105 transition-transform duration-200"
          >
            {p?.title}
          </div>
        ))}
      </div>


       {symptomps?.length && <h3 className=' font-bold max-w-[1000px] mx-auto pl-4'>All Symptomps</h3>}
      <div className='p-2 pl-4  grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 max-w-[1000px] mx-auto '>
        {symptomps?.map((symp,index)=>{
          return(
            <span key={index} className='bg-red-200 rounded-lg p-2 text-xs font-medium select-none'>{symp}</span>
          )
        })}
      </div>

       {medicines?.length && <h3 className=' font-bold max-w-[1000px] mx-auto pl-4'>All Medicines</h3>}
      <div className='p-2 pl-4  grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 max-w-[1000px] mx-auto '>
        {medicines?.map((medi,index)=>{
          return(
            <span key={index} className='bg-green-200 rounded-lg p-2 text-xs font-medium select-none'>{medi}</span>
          )
        })}
      </div>
    </div>
  )
}

export default Home