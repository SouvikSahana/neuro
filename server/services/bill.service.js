const Bill= require("../models/bill.model")
const {ObjectId,MongoClient,GridFSBucket}= require("mongodb")



const getBills=async(user)=>{
    try{
        const bills= await Bill.find({user})?.sort({date:-1})
        return  bills
    }catch(error){
        throw new Error(error?.message)
    }
}

const getSpecificBill=async(user,billId)=>{
    try{
        const bill= await Bill.findById(billId)
        if(!bill){
            throw new Error("There is no bill with this ID")
        }
        if(bill?.user?.toHexString()!=user?.toHexString()){
            throw new Error("You are not owner of this Bill")
        }
        
        return bill
    }catch(error){
        throw new Error(error?.message)
    }
}
const updateBill= async(userId,data)=>{
    try{
        const {_id,image,user,...updatedData}= data
        if(!_id){
            throw new Error("No id provided to update")
        }
        const isData=await Bill.findById(_id)
        if(!isData){
            throw new Error("There is no data with this id")
        }
        if(isData?.user?.toHexString()!=userId?.toHexString()){
            throw new Error("You are not owner of this Bill")
        }
        await Bill.findByIdAndUpdate(_id,{$set:{...updatedData}},{merge:true})
        return "Bill updated successfully/"
    }catch(error){
        throw new Error(error?.message)
    }
}

const deleteBill=async(id,userId)=>{
    try{
        if(!id){
            throw new Error("Please provide id")
        }
        const isData=await Bill.findById(id)
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
        await Bill.findByIdAndDelete(id)
        client.close()
        return "Bill deleted successfully"
    }catch(error){
        throw new Error(error?.message)
    }
}

const deleteBillAndImage=async(id,userId)=>{
    try{
        if(!id){
            throw new Error("Please provide id")
        }
        const isData=await Bill.findById(id)
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
       await Bill.findByIdAndDelete(id)
        client.close()
        return "Bill deleted successfully"
    }catch(error){
        throw new Error(error?.message)
    }
}
module.exports={getBills, getSpecificBill,updateBill, deleteBill,deleteBillAndImage }