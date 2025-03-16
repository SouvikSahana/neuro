const Otp= require("../models/otp.model")
const otpGenerator= require("otp-generator")
const nodemailer= require("nodemailer")
require("dotenv").config()

const transport=nodemailer.createTransport({
    service:"gmail",
    auth:{
        user: process.env.EMAIL_USER ,
        pass: process.env.EMAIL_PASS
    }
})

const sendMailOtp=async(email,otp)=>{
    let mailOptions={
        from:`"Neuro" <${process.env.EMAIL_USER}>`,
        to: email,
        subject:  '🔒 OTP verification',
        // text:'Otp for Registration : '+ otp,
        html:`
        <div style="font-family: Arial, sans-serif; max-width: 500px; padding: 20px; background-color: #f9f9f9; border-radius: 10px; box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);">
            <h2 style="text-align: center; color: #333;">🔐 OTP Verification</h2>
            <p style="font-size: 16px; color: #555;">Hello,</p>
            <p style="font-size: 16px; color: #555;">Your OTP for account verification is:</p>
            <div style="text-align: center; font-size: 24px; font-weight: bold; color: #06074C; padding: 10px 20px; background-color: #e3e6f3; border-radius: 5px; display: inline-block;">
                ${otp}
            </div>
            <p style="font-size: 16px; color: #555;">This OTP is valid for only <b>5 minutes</b>. Please do not share it with anyone.</p>
            <p style="font-size: 14px; color: #888; margin-top: 20px;">If you didn’t request this, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="text-align: center; font-size: 14px; color: #999;">© 2025 Your Company. All rights reserved.</p>
        </div>
        `
    }
    try{
        transport.sendMail(mailOptions,function(error,info){
            if(error){
                console.log(error)
            }else{
                console.log('Email sent: '+ info.response)
            }
        })
    }catch(error){
        throw new Error(error?.message)
    }
   
}

const generateOtp=async(email)=>{
    try{
        const o_t_p= otpGenerator.generate(6,{lowerCaseAlphabets:false,specialChars:false})
        const listedOtp=await Otp.findOne({email})
        if(listedOtp){
            await Otp.findByIdAndUpdate(listedOtp?._id,{otp:o_t_p},{merge: true})
        }else{
            await Otp.create({email,otp:o_t_p,createdAt:Date.now()})
        }
        await sendMailOtp(email,o_t_p)
        return "OTP is send to this email."
    }catch(error){
        throw new Error(error?.message)
    }
}

const getOtpbyEmail=async (email)=>{
    try{
        const getOtp= await Otp.findOne({email})
        if(!getOtp){
            throw new Error("No OTP found with this email")
        }
        return getOtp?.otp;
    }catch(error){
        throw new Error(error?.message)
    }
}

module.exports={generateOtp, getOtpbyEmail}