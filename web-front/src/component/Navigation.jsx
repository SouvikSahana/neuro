import React, {useState, useEffect} from 'react'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {useStateValue} from "../StateProvider"
import {useNavigate} from "react-router-dom"
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import LogoutIcon from '@mui/icons-material/Logout';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import VerifiedIcon from '@mui/icons-material/Verified';
import { api } from '../config/api';
import AlertPop from '../AlertPop';
import logo from "../assets/logo.png"

// 6148CD
const Navigation = ({changeOpen}) => {
    // const [openD,setOpenD] = useState(false)
    const [state,dispatch]= useStateValue()
    const navigate=useNavigate()

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

    const [anchorEl, setAnchorEl] = React.useState(null);
  const openD = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseD = () => {
    setAnchorEl(null);
  };
  
  return (
    <div>
      {alertVisible && <AlertPop message={msg} type={type}/>}
      
        <div className='shadow-xl bg-white min-h-[52px] flex items-center justify-between sm:px-[20px] px-[5px] pl-[17px] sm:pl-[30px] sticky z-10'>
            <div onClick={()=>navigate("/")}>
            {/* <SegmentIcon onClick={changeOpen} sx={{color:'#6148CD', cursor:'pointer'}}/> */}
            <img src={logo} className='h-8 rounded-lg cursor-pointer' />
            </div>
        <div className='flex flex-row justify-end h-[100%] items-center'>
            
            <div className='flex flex-row items-center'>
                
                <div>
                <Button
                      id="basic-button"
                      aria-controls={openD ? 'basic-menu' : undefined}
                      aria-haspopup="true"
                      aria-expanded={openD ? 'true' : undefined}
                      onClick={handleClick}
                      // onMouseOver={handleClick}
                    >
                        <AccountCircleIcon sx={{
                    color:"#6148CD",
                    cursor:'pointer'
                }}/>
                       <ArrowForwardIosIcon sx={{height:'15px', rotate:'90deg', color:"#6148CD",
                    cursor:'pointer'}}/>
                    </Button>
                    <Menu
                      id="basic-menu"
                      anchorEl={anchorEl}
                      open={openD}
                      onClose={handleCloseD}
                      MenuListProps={{
                        'aria-labelledby': 'basic-button',
                      }}
                      sx={{minWidth:'500px'}}
                    >
                      <MenuItem onClick={()=>{handleCloseD(); navigate("/profile") }}  >< AccountCircleIcon/>&nbsp; Profile</MenuItem>
                     <MenuItem onClick={()=>{handleCloseD(); localStorage.clear();showAlertFunction("Logged Out Successfully!","success"); dispatch({type:"SET_USER",user:null});navigate("/",{replace:true}) }}><LogoutIcon/>&nbsp; Logout</MenuItem>
                    </Menu>
                </div>
            </div>
        </div>
        </div>
    </div>
  )
}

export default Navigation