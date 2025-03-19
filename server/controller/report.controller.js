const reportService= require("../services/report.service")

const getReports=async(req,res)=>{
    try{
        const response=await reportService.getReports(req?.user?._id)
        return res.status(200).send({message:"Reports fetched successfully",data:await response})
    }catch(error){
        return res.status(500).send({message:error?.message})
    }
}

const getSpecificReport=async(req,res)=>{
    try{
        const reportId= req.params?.reportId
        const user= req?.user?._id
        const response=await reportService.getSpecificReport(user,reportId)
        return res.status(200).send({message:"Report fetched successfully",data:await response})
    }catch(error){
        return res.status(500).send({message: error?.message})
    }
}

const updateReport=async(req,res)=>{
    try{
        const response=await reportService.updateReport(req?.user?._id,req.body)
        return res.status(200).send({message: response})
    }catch(error){
        return res.status(500).send({message: error?.message})
    }
}
const deleteReport=async(req,res)=>{
    try{
        const id= req.params?.id
        const response=await reportService.deleteReport(id,req?.user._id)
        return res.status(200).send({message: response})
    }catch(error){
        return res.status(500).send({message:error?.message})
    }
}

const deleteReportAndImage=async (req,res)=>{
    try{
        const id= req.params?.id
        const response=await reportService.deleteReportAndImage(id,req?.user?._id)
        return res.status(200).send({message: response})
    }catch(error){
        return res.status(500).send({message:error?.message})
    }
}

module.exports= {getReports,getSpecificReport,updateReport, deleteReport, deleteReportAndImage}