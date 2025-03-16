import Reac,{useState} from 'react'
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import {useNavigate} from "react-router-dom"
import AlertPop from '../AlertPop'
import { API_BASE_URL } from '../config/api';
import axios from 'axios';
import {useStateValue} from "../StateProvider"

const Register = () => {
    const [visibility,setVisibility]=useState(false)
    const [passwordType,setPasswordType]=useState('password')
    const [page,setPage]=useState(0)
    const [name,setName]=useState("")
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const [otp,setOtp]=useState("")
    const [msg,setMsg]=useState("")
    const [type,setType]=useState("success")
    const [alertVisible, setAlertVisible] = useState(false);
    const [state,dispatch]= useStateValue()
  
    // Function to show the alert
    const showAlertFunction = (msg,type) => {
      setAlertVisible(true);
      setType(type)
      setMsg(msg)
      setTimeout(() => {
        setAlertVisible(false);
      }, 2000);
    };
    const navigate=useNavigate()

    const changeVisibility=(e)=>{
        e.preventDefault();
        setVisibility((prev)=>!prev)
        if(visibility){
            setPasswordType('password')
        }else{
            setPasswordType('text')
        }
    }
    
    const generateOtp=(e)=>{
      e.preventDefault()
      console.log("clicked")
      if(name && email && password){
        try{
          axios.post(`${API_BASE_URL}/auth/otp` ,{
            email: email,
          }).then((data)=>{
            showAlertFunction(data.data.message,"success")
            setPage(1)
          }).catch((error)=>{
            showAlertFunction(error.response.data.message,"warning")
          })
        }catch(error){
          showAlertFunction("Something went wrong. Try later","warning")
        }
      }else{
        showAlertFunction('Please fil the form','warning')
      }
    }
    const createAccount=async(e)=>{
      e.preventDefault();
      if(otp){
        try{
          axios.post(`${API_BASE_URL}/auth/register`,{
            name: name,
            email: email,
            password: password,
            otp:otp
          }).then((data)=>{
            showAlertFunction(data.data.message,"success")
            // dispatch('SET_USER',data.data.user)
            localStorage.setItem('jwt',data?.data?.token)
            setTimeout(()=>{
                  navigate("/")
                },200)
          }).catch((error)=>{
            showAlertFunction(error.response.data.message,"warning")
          })
        }catch(error){
          showAlertFunction(error.message,"warning")
        }
      }else{
        showAlertFunction("Please fill OTP",'warning')
      }
    }
  return (
    <div>
      {alertVisible && <AlertPop message={msg} type={type}/>}
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-20 w-auto"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOo6QUm_jVtraBc_hltQIeZMq4m_Wv8uTFcg&s"
            alt="Your Company"
          />
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm shadow-2xl p-5 rounded-xl min-w-[30vw]">
        <h2 className="  text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Register your account
          </h2>
          <form className="space-y-6 mt-5" onSubmit={createAccount} method="POST">
         {page==0 && <div>
            <div className='flex flex-row w-full gap-2'>
            <div className='w-full'>
              <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                Name
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e)=>setName(e.target.value)}
                  className="block pl-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e)=>setEmail(e.target.value)}
                  className="block pl-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Password
                </label>
              </div>
              <div className="mt-2 px-[2px]  flex flex-row items-center rounded-md border-0 shadow-sm focus:ring-2 ring-1 ring-inset ring-gray-300 focus:ring-inset focus:ring-indigo-600">
                <input
                  id="password"
                  name="password"
                  type={passwordType}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e)=>setPassword(e.target.value)}
                  className="block pl-2 w-full outline-none  py-1.5 my-[1px] ml-[3px] text-gray-900 border-none   placeholder:text-gray-400   sm:text-sm sm:leading-6"
                />
                <div className='px-2 '>
               {visibility? <VisibilityIcon sx={{fontSize:'20px',color:'blue'}}  className='cursor-pointer' onClick={changeVisibility}/>:<VisibilityOffIcon sx={{fontSize:'20px'}} className='cursor-pointer' onClick={changeVisibility}/>}
               </div>
              </div>
            </div>
            </div>}

            {page==1 && <div>
              <label htmlFor="otp" className="block text-sm font-medium leading-6 text-gray-900">
                Otp
              </label>
              <div className="mt-2">
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  value={otp}
                  onChange={(e)=>setOtp(e.target.value)}
                  className="block pl-2  w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>}
            <div>
              {page==0? <button onClick={generateOtp}
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline  focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Request for OTP
              </button>: <div className='flex flex-row gap-2'>
              <button onClick={()=>setPage(0)}
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline  focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Back
              </button><button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline  focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Create Account
              </button>
              </div>
              }
            </div>
          </form>

          <p className="mt-5 text-center text-sm text-gray-500">
            Already a member?{' '}
            <a onClick={()=> navigate("/login")} className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500 cursor-pointer">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register