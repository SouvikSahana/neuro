const User= require("../models/user.model")
const {generateToken}= require("../config/jwtProvider")

const getUser=async(userId,userEmail)=>{
    try{
        if(userId && userEmail){
            const user= await User.findOne({email:userEmail})
            if(!user){
                throw new Error("No user found with this Mail")
            }
            if(user?._id!=userId){
                throw new Error("Mismatch!!! This mail is not associated with this user Id")
            }
            return  user;
        }else{
            throw new Error("User ID & email is not present")
        }
    }catch(error){
        throw new Error(error?.message)
    }
}

const getUserById=async(userId)=>{
    try{
        if(userId){
            const user= await User.findById(userId)
            if(!user){
                throw new Error("No user found with this User Id")
            }
            return  user;
        }else{
            throw new Error("User ID is not present")
        }
    }catch(error){
        throw new Error(error?.message)
    }
}

const getUserByEmail=async(userEmail)=>{
    try{
        if(userEmail){
            const user= await User.findOne({email:userEmail})
            if(!user){
                throw new Error("No user found with this Mail")
            }
            return  user;
        }else{
            throw new Error("User Email is not present")
        }
    }catch(error){
        throw new Error(error?.message)
    }
}

const createUser=async(email,password)=>{
    try{
        const isUser=await User.findOne({email})
        if(isUser){
            throw new Error("User already available with this mail id")
        }
        const user=await User.create({email,password})
        const token=await generateToken(user?._id,email)
        return token;
    }catch(error){
        throw new Error(error?.message)
    }
}

const updateUser=async(email,data)=>{
    try{
        const isUser=await User.findOne({email})
        if(!isUser){
            throw new Error("There is no user present with this mail id.")
        }
        await User.findByIdAndUpdate(isUser?._id,{...data},{merge: true})
        return "User data updated successfully."
    }catch(error){
        throw new Error(error?.message)
    }
}

const deleteUserById=async(id)=>{
    try{
        await User.findByIdAndDelete(id)
        return "User deleted successfully"
    }catch(error){
        throw new Error(error?.message)
    }
}

module.exports={getUser,getUserById,getUserByEmail, createUser,updateUser, deleteUserById}