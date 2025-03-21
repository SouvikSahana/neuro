const {MongoClient,GridFSBucket}= require("mongodb")
const Symptomp=require("../models/symptomp.model")
const {Readable}= require("stream")
const fs= require("fs")
const path= require("path")
const {v4}= require("uuid")
const {uri}=require("../db")



const createSymptomp=async(files,user,symps,email,time)=>{ 
    try{
        if(!user){
            throw new Error("User no specified")
        }
        if(!(files?.length>0 || symps?.length>0)){
            throw new Error("Either add symptomps or images")
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
                            type:"symptomp",
                            email: email
                        }
                    }).on("finish",async()=>{
                        imgArr.push(id)
                        count++;
                        if(count==files?.length){
                            // console.log(symps)
                            await Symptomp.create({user,images:imgArr||[],symps:JSON.parse(symps)||[],time:time ||Date.now()})
                            resolve("Data created successfully")
                            client.close()
                        }
                    }))
                }
            }else{
                await Symptomp.create({user,symps:JSON.parse(symps)||[],time:time|| Date.now()})
                resolve("Data created successfully")
            }
        })
        
       
    }catch(error){
        throw error
    }
}

const updateSymptomp=async(id,files,user,symps,email,images)=>{
    images=images?.length>0? images:[]
    symps= symps?.length>0? symps:[]
    try{
        if(!user){
            throw new Error("User no specified")
        }
        if(!((files?.length>0 || images?.length>0)|| symps?.length>0)){
            throw new Error("Either add symptomps or images")
        }
        const isFile=await Symptomp.findById(id)
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
                            type:"symptomp",
                            email: email
                        }
                    }).on("finish",async()=>{
                        imgArr.push(id)
                        count++;
                        if(count==files?.length){
                            // console.log(symps)
                            await Symptomp.findByIdAndUpdate(isFile?._id,{$set:{images:[...images,...imgArr]||[],symps:symps}},{merge:true})
                            resolve("Data updated successfully")
                            client.close()
                        }
                    }))
                }
            }else{
                await Symptomp.findByIdAndUpdate(isFile?._id,{$set:{images:images,symps:symps}},{merge:true})
                resolve("Data updated successfully")
                client.close()
            }
        })
        
       
    }catch(error){
        throw error
    }
}
const deleteSymptomp=async(id)=>{
    try{
        const isExists= await Symptomp.findById(id)
        if(!isExists){
            throw new Error("There is no symptomp file with this id")
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
            await Symptomp.findByIdAndDelete(id)
            resolve("Symptomp file data deleted successfully")
        })
    }catch(error){
        throw new Error(error?.message)
    }
}

const getSymptomps= async(user)=>{
    try{
        const symptomps= await Symptomp.find({user})
        return symptomps
    }catch(error){
        throw new Error(error?.message)
    }
}

const getSpecificSymptomp=async(user,id)=>{
    try{
        const symptomp=await Symptomp.findById(id)
        if(!symptomp){
            throw new Error("There is no Symptomp data with this ID")
        }
        if(symptomp?.user?.toHexString()!=user?.toHexString()){
            throw new Error("You are not owner of this data")
        }
        return symptomp
    }catch(error){
        throw new Error(error?.message)
    }
}


module.exports={createSymptomp, deleteSymptomp,getSymptomps,getSpecificSymptomp, updateSymptomp}