const otpService= require("../services/otp.service")
const userService= require("../services/user.service")
const {generateToken} =require("../config/jwtProvider");
const User = require("../models/user.model");
const bcrypt=require("bcrypt")

const generateOtp=async(req,res)=>{
    try{
        const email= req.body?.email
        if(!email){
            throw new Error("Please provide email")
        }
        const response=await otpService.generateOtp(email);
        res.status(200).send({message:response})
    }catch(error){
        res.status(500).send({message: error?.message})
    }
}

const login=async(req,res)=>{
    try{
        const {email,password}= req.body
        if(!email && !password){
            throw new Error("Empty field. Please provide email & password")
        }
        const user=await userService.getUserByEmail(email)
        const token= generateToken(user?._id,email)
        res.status(200).send({message:"User logged in successfully",token})
    }catch(error){
        res.status(500).send({message: error?.message})
    }
}

const register=async(req,res)=>{
    try{
        let {email,otp,password}= req.body
        if(!otp){
            throw new Error("Please fill OTP")
        }
        if(!email){
            throw new Error("Please fill Email")
        }
        if(!password){
            throw new Error("Please fill Password")
        }
        const getOtp=await otpService.getOtpbyEmail(email)
        if(getOtp!==otp){
            throw new Error("Otp is not valid")
        }
        password= await bcrypt.hash(password,6)
        const token=await userService.createUser(email,password)
        res.status(200).send({message:"User registered successfully",token})
    }catch(error){
        res.status(500).send({message: error?.message})
    }
}

const changePassword=async(req,res)=>{
    try{
        let {email,otp,password}= req.body
        if(!otp){
            throw new Error("Please fill OTP")
        }
        if(!email){
            throw new Error("Please fill Email")
        }
        if(!password){
            throw new Error("Please fill Password")
        }
        const getOtp=await otpService.getOtpbyEmail(email)
        if(getOtp!==otp){
            throw new Error("Otp is not valid")
        }
        password= await bcrypt.hash(password,6)
        const response=await userService.updateUser(email,{password:password})
        res.status(200).send({message:"Password changed successfully"})
    }catch(error){
        res.status(500).send({message: error?.message})
    }
}

const updateUser=async(req,res)=>{
    try{
        const response=await userService.updateUser(req?.user?.email,{... req.body})
        res.status(200).send({message:response})
    }catch(error){
        res.status(500).send({message: error?.message})
    }
}

const deleteUser=async(req,res)=>{
    try{
        const response= await userService.deleteUserById(req?.user?._id)
        res.status(200).send({message:"User deleted successfully"})
    }catch(error){
        res.status(500).send({message: error?.message})
    }
}

const getProfile=async(req,res)=>{
    try{
        const user= await req?.user
        if(!user){
            throw new Error("Error in getting user profile")
        }
        res.status(200).send({data:user})
    }catch(error){
        res.status(500).send({message: error?.message})
    }
}

module.exports={generateOtp,register,login, changePassword, updateUser, deleteUser, getProfile}