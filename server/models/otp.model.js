const mongoose=require("mongoose")

const otpSchema= new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true,
        dropDups: true
    },
    otp:{
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now(),
        expires: 60*5
    }
})

const Otp= mongoose.model("otps",otpSchema)
module.exports=Otp