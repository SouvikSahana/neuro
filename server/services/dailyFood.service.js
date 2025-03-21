const {MongoClient,GridFSBucket}= require("mongodb")
const DailyFood=require("../models/dailyFood.model")
const {Readable}= require("stream")
const fs= require("fs")
const path= require("path")
const {v4}= require("uuid")
const {uri}=require("../db")



const createDailyFood=async(files,user,items,email,time)=>{ 
    try{
        if(!user){
            throw new Error("User no specified")
        }
        if(!(files?.length>0 || items?.length>0)){
            throw new Error("Either add foods or images")
        }
        
        return new Promise(async(resolve,reject)=>{
            if(files?.length>0){
                const client=await MongoClient.connect(uri)
                const db=await client.db()
                const bucket=new GridFSBucket(db,{bucketName:"images"})
                var imgArr=[]
                let count=0;
                for(let i=0;i<files?.length;i++){
                    let id=v4()
                    const bufferStream= new Readable()
                    bufferStream.push(files[i].buffer)
                    bufferStream.push(null)
                    bufferStream.pipe(bucket.openUploadStream(id,{
                        metadata:{
                            type:"dailyfood",
                            email: email
                        }
                    }).on("finish",async()=>{
                        imgArr.push(id)
                        count++;
                        if(count==files?.length){
                            // console.log(symps)
                            await DailyFood.create({user,images:imgArr||[],items:JSON.parse(items)||[],time:time ||Date.now()})
                            resolve("Data created successfully")
                            client.close()
                        }
                    }))
                }
            }else{
                await DailyFood.create({user,items:JSON.parse(items)||[],time:time|| Date.now()})
                resolve("Data created successfully")
            }
        })
        
       
    }catch(error){
        throw error
    }
}

const updateDialyFood=async(id,files,user,items,email,images,time)=>{
    images=images?.length>0? images:[]
    items= items?.length>0? items:[]
    try{
        if(!user){
            throw new Error("User no specified")
        }
        if(!((files?.length>0 || images?.length>0)|| items?.length>0)){
            throw new Error("Either add Daily Food or images")
        }
        const isFile=await DailyFood.findById(id)
        if(!isFile){
            throw  new Error("There is no file with this ID")
        }
        if(user?.toHexString()!=isFile?.user?.toHexString()){
            throw new Error("You are not owner of this file")
        }
        
        return new Promise(async(resolve,reject)=>{
            const diffArr=isFile?.images?.filter((img)=>!images.includes(img))
            const client=await MongoClient.connect(uri)
            const db=await client.db()
            const bucket=new GridFSBucket(db,{bucketName:"images"})

            if(diffArr?.length>0){
                const collection=await db.collection("images.files")
                for(let i=0;i<diffArr?.length;i++){
                    try{
                        const isFile=await collection.findOne({filename:diffArr[i]})
                       await bucket.delete(isFile?._id)
                    }catch(error){
                        console.log("No file")
                    }
                }
            }
            

            if(files?.length>0){
                var imgArr=[]
                let count=0;
                for(let i=0;i<files?.length;i++){
                    let id=v4()
                    const bufferStream= new Readable()
                    bufferStream.push(files[i].buffer)
                    bufferStream.push(null)
                    bufferStream.pipe(bucket.openUploadStream(id,{
                        metadata:{
                            type:"dailyfood",
                            email: email
                        }
                    }).on("finish",async()=>{
                        imgArr.push(id)
                        count++;
                        if(count==files?.length){
                            // console.log(symps)
                            await DailyFood.findByIdAndUpdate(isFile?._id,{$set:{images:[...images,...imgArr],items:items,time}},{merge:true})
                            resolve("Data updated successfully")
                            client.close()
                        }
                    }))
                }
            }else{
                await DailyFood.findByIdAndUpdate(isFile?._id,{$set:{images:images,items:items,time}},{merge:true})
                resolve("Data updated successfully")
                client.close()
            }
        })
        
       
    }catch(error){
        throw error
    }
}
const deleteDailyFood=async(id)=>{
    try{
        const isExists= await DailyFood.findById(id)
        if(!isExists){
            throw new Error("There is no Daily Food file with this id")
        }
        return new Promise(async(resolve,reject)=>{
            if(isExists?.images?.length>0){
                const client= await MongoClient.connect(uri)
                const db= await client.db()
                const bucket= new GridFSBucket(db,{bucketName:"images"})
                const collection=await db.collection("images.files")
                let count=0;
                for(let i=0;i<isExists?.images?.length;i++){
                    try{
                        const isFile=await collection.findOne({filename:isExists.images[i]})
                       await bucket.delete(isFile?._id)
                    }catch(error){
                        console.log("No file")
                    }finally{
                        count ++;
                        if(count== isExists?.length){
                            client.close()
                        }
                    }
                }
            }
            await DailyFood.findByIdAndDelete(id)
            resolve("Daily Food file data deleted successfully")
        })
    }catch(error){
        throw new Error(error?.message)
    }
}

const getDailyFood= async(user)=>{
    try{
        const dailyfoods= await DailyFood.find({user}).sort({ time: -1 })
        return dailyfoods
    }catch(error){
        throw new Error(error?.message)
    }
}

const getSpecificDailyFood=async(user,id)=>{
    try{
        const dailyfood=await DailyFood.findById(id)
        if(!dailyfood){
            throw new Error("There is no Daily Food data with this ID")
        }
        if(dailyfood?.user?.toHexString()!=user?.toHexString()){
            throw new Error("You are not owner of this data")
        }
        return dailyfood
    }catch(error){
        throw new Error(error?.message)
    }
}


module.exports={createDailyFood,updateDialyFood, getSpecificDailyFood, getDailyFood, deleteDailyFood}