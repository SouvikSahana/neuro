const Prescription= require("../models/prescription.model")
const {ObjectId,MongoClient,GridFSBucket}= require("mongodb")

const getPrescription=async(user)=>{
    try{
        const prescriptions= await Prescription.find({user})
       
        return  prescriptions
    }catch(error){
        throw new Error(error?.message)
    }
}

const getSpecificPrescription=async(user,prescriptionId)=>{
    try{
        const prescription= await Prescription.findById(prescriptionId)
        if(!prescription){
            throw new Error("There is no prescription with this ID")
        }
        if(prescription?.user?.toHexString()!=user?.toHexString()){
            throw new Error("You are not owner of this Prescription")
        }
        
        return prescription
    }catch(error){
        throw new Error(error?.message)
    }
}

const updatePrescription= async(userId,data)=>{
    try{
        const {_id,image,user,processedAt,...updatedData}= data
        if(!_id){
            throw new Error("No id provided to update")
        }
        const isData=await Prescription.findById(_id)
        if(!isData){
            throw new Error("There is no data with this id")
        }
        if(isData?.user?.toHexString()!=userId?.toHexString()){
            throw new Error("You are not owner of this Prescription")
        }
        await Prescription.findByIdAndUpdate(_id,{$set:{...updatedData}},{merge:true})
        return "Prescription updated successfully/"
    }catch(error){
        throw new Error(error?.message)
    }
}

const deletePrescription=async(id,userId)=>{
    try{
        if(!id){
            throw new Error("Please provide id")
        }
        const isData=await Prescription.findById(id)
        if(!isData){
            throw new Error("There is no data ")
        }
        if(isData?.user?.toHexString()!=userId?.toHexString()){
            throw new Error("You are not owner of this Prescription")
        }
       const client=await MongoClient.connect(process.env.DB_URI)
       const db=await client.db()
       const collection=await db.collection("images.files")

       await collection.findOneAndUpdate(
        { filename: isData?.image },
        { $set: { 'metadata.isProcessed': false } },
        {merge:true}
      );
        await Prescription.findByIdAndDelete(id)
        client.close()
        return "Prescription deleted successfully"
    }catch(error){
        throw new Error(error?.message)
    }
}

const deletePrescriptionAndImage=async(id,userId)=>{
    try{
        if(!id){
            throw new Error("Please provide id")
        }
        const isData=await Prescription.findById(id)
        if(!isData){
            throw new Error("There is no data ")
        }
        if(isData?.user?.toHexString()!=userId?.toHexString()){
            throw new Error("You are not owner of this Prescription")
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
       await Prescription.findByIdAndDelete(id)
        client.close()
        return "Prescription & Image deleted successfully"
    }catch(error){
        throw new Error(error?.message)
    }
}
module.exports={getPrescription, getSpecificPrescription, updatePrescription,deletePrescription,deletePrescriptionAndImage}