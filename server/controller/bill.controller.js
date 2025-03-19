const billService= require("../services/bill.service")

const getBills=async(req,res)=>{
    try{
        const response=await billService.getBills(req?.user?._id)
        return res.status(200).send({message:"Bill fetched successfully",data:await response})
    }catch(error){
        return res.status(500).send({message:error?.message})
    }
}

const getSpecificBill=async(req,res)=>{
    try{
        const billId= req.params?.billId
        const user= req?.user?._id
        const response=await billService.getSpecificBill(user,billId)
        return res.status(200).send({message:"Bill fetched successfully",data:await response})
    }catch(error){
        return res.status(500).send({message: error?.message})
    }
}
const updateBill=async(req,res)=>{
    try{
        const response=await billService.updateBill(req?.user?._id,req.body)
        return res.status(200).send({message: response})
    }catch(error){
        return res.status(500).send({message: error?.message})
    }
}
const deleteBill=async(req,res)=>{
    try{
        const id= req.params?.id
        const response=await billService.deleteBill(id,req?.user._id)
        return res.status(200).send({message: response})
    }catch(error){
        return res.status(500).send({message:error?.message})
    }
}

const deleteBillAndImage=async (req,res)=>{
    try{
        const id= req.params?.id
        const response=await billService.deleteBillAndImage(id,req?.user?._id)
        return res.status(200).send({message: response})
    }catch(error){
        return res.status(500).send({message:error?.message})
    }
}
module.exports= {getBills, getSpecificBill, updateBill,deleteBill,deleteBillAndImage}