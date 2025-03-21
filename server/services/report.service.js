const Report= require("../models/report.model")
const {ObjectId,MongoClient,GridFSBucket}= require("mongodb")

const getReports=async(user)=>{
    try{
        const reports= await Report.find({user})?.sort({date:-1})
        return  reports
    }catch(error){
        throw new Error(error?.message)
    }
}

const getSpecificReport=async(user,reportId)=>{
    try{
        const report= await Report.findById(reportId)
        if(!report){
            throw new Error("There is no report with this ID")
        }
        if(report?.user?.toHexString()!=user?.toHexString()){
            throw new Error("You are not owner of this Report")
        }
        
        return report
    }catch(error){
        throw new Error(error?.message)
    }
}
const updateReport= async(userId,data)=>{
    try{
        const {_id,image,user,processedAt,...updatedData}= data
        if(!_id){
            throw new Error("No id provided to update")
        }
        const isData=await Report.findById(_id)
        if(!isData){
            throw new Error("There is no data with this id")
        }
        if(isData?.user?.toHexString()!=userId?.toHexString()){
            throw new Error("You are not owner of this Bill")
        }
        await Report.findByIdAndUpdate(_id,{$set:{...updatedData}},{merge:true})
        return "Report updated successfully/"
    }catch(error){
        throw new Error(error?.message)
    }
}

const deleteReport=async(id,userId)=>{
    try{
        if(!id){
            throw new Error("Please provide id")
        }
        const isData=await Report.findById(id)
        if(!isData){
            throw new Error("There is no data ")
        }
        if(isData?.user?.toHexString()!=userId?.toHexString()){
            throw new Error("You are not owner of this Bill")
        }
       const client=await MongoClient.connect(process.env.DB_URI)
       const db=await client.db()
       const collection=await db.collection("images.files")

       await collection.findOneAndUpdate(
        { filename: isData?.image },
        { $set: { 'metadata.isProcessed': false } },
        {merge:true}
      );
        await Report.findByIdAndDelete(id)
        client.close()
        return "Report deleted successfully"
    }catch(error){
        throw new Error(error?.message)
    }
}

const deleteReportAndImage=async(id,userId)=>{
    try{
        if(!id){
            throw new Error("Please provide id")
        }
        const isData=await Report.findById(id)
        if(!isData){
            throw new Error("There is no data ")
        }
        if(isData?.user?.toHexString()!=userId?.toHexString()){
            throw new Error("You are not owner of this Bill")
        }
       const client=await MongoClient.connect(process.env.DB_URI)
       const db=await client.db()
       const bucket=new GridFSBucket(db,{bucketName:"images"})
       const collection=await db.collection("images.files")

       const file=await collection.findOne({filename:isData?.image})
       if(!file){
            throw new Error("There is no media with this name")
       }
       await bucket.delete(new ObjectId(file?._id))
       await Report.findByIdAndDelete(id)
        client.close()
        return "Report deleted successfully"
    }catch(error){
        throw new Error(error?.message)
    }
}

module.exports={getReports, getSpecificReport, updateReport, deleteReport, deleteReportAndImage}