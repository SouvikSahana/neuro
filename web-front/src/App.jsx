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
      <Routes>
        <Route path="/" element={<Home/>} ></Route>
        <Route path="/login" element={<Login/>} ></Route>
        <Route path="/register" element={<Register/>} ></Route>
        <Route path="/forgot" element={<Forgot/>}></Route>
        <Route path="/uploadimage" element={<UploadImage/>}></Route>
        <Route path="/images" element={<Images/>} ></Route>
      </Routes>
    // </Router>
  )
}

export default App
