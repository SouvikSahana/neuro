import { useState,useEffect } from 'react'
import { Route, Routes, useNavigate} from "react-router-dom"
import { useStateValue } from './StateProvider'
import { api } from './config/api'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Forgot from './pages/Forgot'
import UploadImage from './pages/UploadImage'
import Images from './pages/Images'
import Profile from "./pages/Profile"
import ReportPage from './pages/ReportPage'
import ReportList from './pages/ReportList'
import PrescriptionPage from "./pages/PrescriptionPage"
import PrescriptionList from './pages/PrescriptionList'
import BillPage from './pages/BillPage'
import BillList from "./pages/BillList"
import UploadSymtomp from './pages/UploadSymtomp'
import SymptompList from './pages/SymptompList'
import SymptompPage from './pages/SymptompPage'
import UploadDailyFood from './pages/UploadDailyFood'
import DailyFoodList from './pages/DailyFoodList'
import DailyFoodPage from './pages/DailyFoodPage'
import Test from "./pages/Test"
import Navigation from './component/Navigation'

function App() {
  const [state,dispatch]= useStateValue()
  const navigate=useNavigate()

   useEffect(()=>{
      const token=localStorage.getItem('jwt')
      if(token){
        api.get("/auth/profile").then((data)=>{
          dispatch({type:"SET_USER",payload:data?.data?.user})
          const path=new window.URL(window.location.href)
          // console.log(path.pathname)
          if(path.pathname==="/login" || path.pathname==="/register" ||path.pathname==="/forgot" ){
            navigate("/")
          }
        }).catch((error)=>{
          console.log(error?.response?.data?.message)
          navigate("/login")
        })
      }else{
          dispatch({type:"SET_USER",payload:null})
          navigate("/login")
      }
   },[localStorage.getItem('jwt')])

  return (
    // <Router>
    <div>
      <Navigation/>
      <Routes>
        <Route path="/" element={<Home/>} ></Route>
        <Route path="/login" element={<Login/>} ></Route>
        <Route path="/register" element={<Register/>} ></Route>
        <Route path="/forgot" element={<Forgot/>}></Route>
        <Route path="/uploadimage" element={<UploadImage/>}></Route>
        <Route path="/images" element={<Images/>} ></Route>
        <Route path="/profile" element={<Profile/>} ></Route>
        <Route path="/report/all" element={<ReportList/>}></Route>
        <Route path="/report/id/:reportId" element={<ReportPage/>}></Route>

        <Route path="/prescription/all" element={<PrescriptionList/>}></Route>
        <Route path="/prescription/id/:prescriptionId" element={<PrescriptionPage/>}></Route>

        <Route path="/bill/all" element={<BillList/>}></Route>
        <Route path="/bill/id/:billId" element={<BillPage/>}></Route>

        <Route path="/uploadsymptomp" element={<UploadSymtomp/>} ></Route>
        <Route path="/symptomp/all" element={<SymptompList/>} ></Route>
        <Route path="/symptomp/id/:id" element={<SymptompPage/>}></Route>

        <Route path="/uploaddailyfood" element={<UploadDailyFood/>} ></Route>
        <Route path="/dailyfood/all" element={<DailyFoodList/>} ></Route>
        <Route path="/dailyfood/id/:id" element={<DailyFoodPage/>}></Route>

        <Route path="/test" element={<Test/>}></Route>
      </Routes>
      </div>
    // </Router>
  )
}

export default App
