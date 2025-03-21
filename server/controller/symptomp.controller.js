const symptompService= require("../services/symptomp.service")
//{createSymptomp, deleteSymptomp,getSymptomps,getSpecificSymptomp, updateSymptomp}

const createSymptomp=async(req,res)=>{
    try{
        const response=await symptompService.createSymptomp(req?.files,req?.user?._id,req.body?.symps,req?.user?.email,req?.body?.time)
        return res.status(200).send({message:response})
    }catch(error){
        return res.status(500).send({message:error?.message})
    }
}

const getSymptomps=async(req,res)=>{
    try{
        const response=await symptompService.getSymptomps(req?.user?._id)
        return res.status(200).send({message:"Symptomps fetched successfully",data:response})
    }catch(error){
        return res.status(500).send({message: error?.message})
    }
}

const getSpecificSymptomp=async(req,res)=>{
    // console.log(req?.params)
    try{
        const response=await symptompService.getSpecificSymptomp(req?.user?._id,req?.params?.id)
        return res.status(200).send({message:"data fetched successfully",data:response})
    }catch(error){
        return res.status(500).send({message:error?.message})
    }
}

const deleteSymptomp=async(req,res)=>{
    try{
        const response=await symptompService.deleteSymptomp(req.body?.id)
        return res.status(200).send({message:response})
    }catch(error){
        return res.status(500).send({message:error?.message})
    }
}

const updateSymptomp=async(req,res)=>{
    try{
        const response=await symptompService.updateSymptomp(req?.params?.id,req?.files,req?.user?._id,req.body?.symps,req?.user?.email,req.body?.images)
        return res.status(200).send({message: response})
    }catch(error){
        return res.status(500).send({message:error?.message})
    }
}
module.exports={createSymptomp,getSymptomps,getSpecificSymptomp, deleteSymptomp, updateSymptomp}