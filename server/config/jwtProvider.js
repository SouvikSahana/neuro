const jwt= require("jsonwebtoken")
require("dotenv").config()

const key=process.env.TOKEN_KEY

const generateToken=(userId,userEmail)=>{
    try{
        const token= jwt.sign({userId,userEmail},key)
        return token;
    }catch(error){
        throw new Error(error?.message)
    }
}

const getUserFromToken=(token)=>{
    try{
        const data=jwt.verify(token,key)
        return {...data};
    }catch(error){
        throw new Error(error?.message)
    }
}

module.exports={generateToken,getUserFromToken}