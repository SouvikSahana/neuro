const {MongoClient,GridFSBucket,ObjectId}= require("mongodb")
const express= require("express")
const multer=require("multer")
const fs=require("fs")
const {Readable}= require("stream")
const {v4}= require("uuid")
const {uri}=require("../db")
const authenticate=require("../authenticate")
const path = require("path")
const {getUserFromToken}= require("../config/jwtProvider")

const router= express.Router()
const upload=multer({
    
})

router.post("/upload",[authenticate,upload.array("img")],async(req,res)=>{
    try{
        MongoClient.connect(uri).then(async(client)=>{
            const db=await client.db()
            const bucket=new GridFSBucket(db,{bucketName:"images"})
            let media=[]
            const type=req.body?.type
            if(!req?.files?.length>0){
                throw new Error("There is no image")
            }
            for(let i=0;i<req.files?.length;i++){
                try{
                    const bufferStream= new Readable()
                const id=v4()
                bufferStream.push(req.files[i].buffer)
                bufferStream.push(null)
                bufferStream.pipe(bucket.openUploadStream(id,{
                    metadata:{
                        type: type,
                        isProcessed: false,
                        email: req?.user?.email
                    }
                }).on("finish",()=>{
                    // media.push(id)
                }))
                media.push(id)
                }catch(error){
                    console.log("Error in this upload")
                }
            }
            res.status(200).send({message:"Images uploaded successfully",id:media})
        })
    }catch(error){
        res.status(500).send({message: error?.message})
    }
})

router.get("/img/:image",async(req,res)=>{
    const token= req?.query?.token
    try{
        const {userId,userEmail}=await getUserFromToken(token)
       await MongoClient.connect(uri).then(async(client)=>{
            const db= await client.db()
            const bucket=new GridFSBucket(db,{bucketName:"images"})
            const collection= await db.collection("images.files")
            const name= req.params?.image
            try{
                const isImage=await collection.findOne({filename:name})
                if(isImage.metadata?.email && userEmail!==isImage.metadata?.email){
                    throw new Error("You are not the owner of this image")
                }
                if(isImage ){
                    const bufferStream= await bucket.openDownloadStreamByName(name)
                    bufferStream.pipe(res)
                }else{
                    throw new Error("Error in fetching image")
                }
            }catch(error){
                throw new Error("Emage fetching error")
            }
        })
    }catch(error){
        const pathFile= path.join(__dirname,"../media/error.avif")
        const readStream= fs.createReadStream(pathFile)
        readStream.pipe(res)
    }
})

router.get("/files",authenticate,async(req,res)=>{
    try{
        await MongoClient.connect(uri).then(async(client)=>{
            const db=await client.db()
            const collection=await db.collection("images.files")
            const files=await collection.find({"metadata.email":req?.user?.email}).toArray()
            if(files?.length>0){
                res.status(200).send({data:files,message:"Images fetched successfully"})
            }else{
                res.status(200).send({data:[],message:"No images found with this user"})
            }
        })
    }catch(error){
        res.status(500).send({message:error?.message})
    }
})
router.post("/update/:image",authenticate,async(req,res)=>{
    try{
        if(!req?.body){
            throw new Error("Please provide data to update")
        }
        await MongoClient.connect(uri).then(async(client)=>{
            const db=await client.db()
            const collection=await db.collection("images.files")
            const name= req.params?.image
            const file=await collection.findOne({filename:name})
            if(!file){
                throw new Error("There is no media with this name")
            }
            if(file?.metadata?.email!=req?.user?.email){
                throw new Error("Your are not owner of this media")
            }
            await collection.findOneAndUpdate(
                { filename: name },
                { $set: { 'metadata': { ...file?.metadata, ...req?.body?.metadata } } }
              );
                res.status(200).send({message:"Image data updated successfully"})
        })
    }catch(error){
        res.status(500).send({message:error?.message})
        console.log(error)
    }
})


//delete image
router.delete("/delete/:image",authenticate,async(req,res)=>{
    try{
        await MongoClient.connect(uri).then(async(client)=>{
            const db=await client.db()
            const bucket= new GridFSBucket(db,{bucketName:"images"})
            const collection=await db.collection("images.files")
            const name= req.params?.image
            const file=await collection.findOne({filename:name})
            if(!file){
                throw new Error("There is no media with this name")
            }
            if(file?.metadata?.email!=req?.user?.email){
                throw new Error("Your are not owner of this media")
            }
            // await collection.findOneAndDelete({filename:name})
            await bucket.delete(new ObjectId(file?._id))
                res.status(200).send({message:"Image deleted successfully"})
        })
    }catch(error){
        res.status(500).send({message:error?.message})
        console.log(error)
    }
})


module.exports=router