const prescriptionService= require("../services/prescription.service")

const getPrescriptions=async(req,res)=>{
    try{
        const response=await prescriptionService.getPrescription(req?.user?._id)
        return res.status(200).send({message:"Prescriptions fetched successfully",data:await response})
    }catch(error){
        return res.status(500).send({message:error?.message})
    }
}

const getSpecificPrescription=async(req,res)=>{
    try{
        const prescriptionId= req.params?.prescriptionId
        const user= req?.user?._id
        const response=await prescriptionService.getSpecificPrescription(user,prescriptionId)
        return res.status(200).send({message:"Prescription fetched successfully",data:await response})
    }catch(error){
        return res.status(500).send({message: error?.message})
    }
}

const updatePrescription=async(req,res)=>{
    try{
        const response=await prescriptionService.updatePrescription(req?.user?._id,req.body)
        return res.status(200).send({message: response})
    }catch(error){
        return res.status(500).send({message: error?.message})
    }
}
const deletePrescription=async(req,res)=>{
    try{
        const id= req.params?.id
        const response=await prescriptionService.deletePrescription(id,req?.user._id)
        return res.status(200).send({message: response})
    }catch(error){
        return res.status(500).send({message:error?.message})
    }
}

const deletePrescriptionAndImage=async (req,res)=>{
    try{
        const id= req.params?.id
        const response=await prescriptionService.deletePrescriptionAndImage(id,req?.user?._id)
        return res.status(200).send({message: response})
    }catch(error){
        return res.status(500).send({message:error?.message})
    }
}
module.exports= {getPrescriptions, getSpecificPrescription, deletePrescription,deletePrescriptionAndImage, updatePrescription }