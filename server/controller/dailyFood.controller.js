const dailyFoodService= require("../services/dailyFood.service")

const createDailyFood=async(req,res)=>{
    try{
        const time= Array.isArray(req?.body?.time)? req?.body?.time[0]: req?.body?.time
        const response=await dailyFoodService.createDailyFood(req?.files,req?.user?._id,req.body?.items,req?.user?.email,time)
        return res.status(200).send({message:response})
    }catch(error){
        return res.status(500).send({message:error?.message})
    }
}

const getDailyFoods=async(req,res)=>{
    try{
        const response=await dailyFoodService.getDailyFood(req?.user?._id)
        return res.status(200).send({message:"Symptomps fetched successfully",data:response})
    }catch(error){
        return res.status(500).send({message: error?.message})
    }
}

const getSpecificDailyFood=async(req,res)=>{
    // console.log(req?.params)
    try{
        const response=await dailyFoodService.getSpecificDailyFood(req?.user?._id,req?.params?.id)
        return res.status(200).send({message:"data fetched successfully",data:response})
    }catch(error){
        return res.status(500).send({message:error?.message})
    }
}

const deleteDailyFood=async(req,res)=>{
    try{
        const response=await dailyFoodService.deleteDailyFood(req.body?.id)
        return res.status(200).send({message:response})
    }catch(error){
        return res.status(500).send({message:error?.message})
    }
}

const updateDailyFood=async(req,res)=>{
    try{
        const time= Array.isArray(req?.body?.time)? req?.body?.time[0]: req?.body?.time
        const response=await dailyFoodService.updateDialyFood(req?.params?.id,req?.files,req?.user?._id,req.body?.items,req?.user?.email,req.body?.images,time)
        return res.status(200).send({message: response})
    }catch(error){
        return res.status(500).send({message:error?.message})
    }
}
module.exports={createDailyFood,getDailyFoods,getSpecificDailyFood, deleteDailyFood, updateDailyFood}