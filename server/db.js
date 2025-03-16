const mongoose= require("mongoose")
require("dotenv").config()

const uri= process.env.DB_URI

const connectDb=async()=>{
    try{
        await mongoose.connect(uri)
    }catch(error){
        console.log(error?.message)
    }
}

connectDb()

module.exports={connectDb,uri}