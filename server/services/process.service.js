const { MongoClient, GridFSBucket } = require('mongodb');
const Tesseract = require('tesseract.js');
const stream = require('stream');
const axios = require('axios');
const OpenAI=require("openai")
require("dotenv").config()
const { Mistral } =require('@mistralai/mistralai');
const fs= require("fs")

const Bill=require("../models/bill.model")
const Report= require("../models/report.model")
const Prescription= require("../models/prescription.model")


const mongoURI = process.env.DB_URI 
const bucketName = 'images'; 

const clientMistral = new Mistral({ apiKey: process.env.KEY });
const prompts=new Map([
    ["report",`refBy:String,
        date:Date(date of test) in mongodb date format,
        labName:String,
        labAddress:String,
        labMobile:Number,
        labEmail:String,
            values:[
                {testName:String,
                    testValue:Number,
                    testUnit:String,
                    testMethod:String
                }
            ],
        remark: String
        extract and only give me data in json format like this and no other text other than json data`],
    ["bill",`date:Date(date of purchase) in mongodb date format,
        shop:String,
        shopAddress:String,
        medicines:[{name:String, amount:Number}],
        amount:Number(total value before discount),
        finalAmount:Number (amount after discount),
        phone:Number,
        email:String,
        remark: String
        extract and only give me data in json format like this and no other text other than json data`],
    ["prescription",`doctor:String (doctor name),
        doctorMobile:Number(doctor mobile),
        date:Date(prescription date) in mongodb date format,
        regnNo:Number(doctor registration number),
        degrees:[String],
        diseases:[String] (diagnosed diseases),
        medicines:[String],
        remark: String
        extract and only give me data in json format like this and no other text other than json data`]
])
const extractTextFromImage = async (imageFilename,user,email) => {
    try {
        if(!email){
            throw new Error("There is authentication failed")
        }
        
        const client = new MongoClient(mongoURI);
        await client.connect();
        const db = client.db();
        const bucket = new GridFSBucket(db, { bucketName });
        const collection= await db.collection("images.files")
        const isFIle=await collection.findOne({filename:imageFilename})
        
        
       
        if(!isFIle){
            client.close();
            throw new Error("There is no image with this name")
        }
        if(isFIle?.metadata?.isProcessed){
            throw new Error("This image is already processed")
        }
        if(isFIle?.metadata?.email!=email){
            client.close();
            throw new Error("You are not owner of this file")
        }
        const promptText= prompts.get(isFIle?.metadata?.type)
        if(!promptText){
            client.close();
            throw new Error("This is not for processing")
        }
        
        return new Promise((resolve, reject) => {
            const downloadStream = bucket.openDownloadStreamByName(imageFilename);

            let imageBuffer = Buffer.alloc(0);
            downloadStream.on('data', (chunk) => {
                imageBuffer = Buffer.concat([imageBuffer, chunk]);
            });

            downloadStream.on('end', async () => {
                try {
                   
                    // const { data: { text } } = await Tesseract.recognize(imageBuffer, 'eng', {
                    //     oem: 1, 
                    //     psm: 6, 
                    //     tessdata: '/usr/local/share/tessdata', 
                    //   });
                    if (imageBuffer.length === 0) {
                        client.close();
                        throw new Error('Image buffer is empty');
                    }

                    const base64Image = imageBuffer.toString('base64');
                    const dataUrl = `data:image/jpeg;base64,${base64Image}`;

                    if (!clientMistral.chat || typeof clientMistral.chat.complete !== 'function') {
                        client.close();
                        throw new Error('Client does not have a chat.complete method');
                    }
                    const chatResponse = await clientMistral.chat.complete({
                        model: "pixtral-12b",
                        messages: [
                          {
                            role: "user",
                            content: [
                              { type: "text", text: promptText },
                              {
                                type: "image_url",
                                imageUrl: dataUrl,
                              },
                            ],
                          },
                        ],
                      });
                      
                      const text= chatResponse.choices[0].message.content
                   
                      if(text){
                        if(isFIle?.metadata?.type=="bill"){
                            await Bill.create({...JSON.parse(text.replace("```json","").replace("```","")),image:imageFilename,user:user})
                        }else if(isFIle?.metadata?.type=="prescription"){
                            await Prescription.create({...JSON.parse(text.replace("```json","").replace("```","")),image:imageFilename,user:user})
                        }else if(isFIle?.metadata?.type=="report"){
                            await Report.create({...JSON.parse(text.replace("```json","").replace("```","")),user:user,image:imageFilename})
                            // console.log(JSON.parse(text.replace("```json","").replace("```","")))
                        }
                         await collection.findOneAndUpdate(
                            { filename: imageFilename },
                            { $set: { 'metadata': { ...isFIle?.metadata, isProcessed:true } } }
                          );
                          resolve("Data extracted successfully")
                          client.close();
                      }else{
                        reject("No data from ai response")
                        client.close();
                      }
                } catch (error) {
                    client.close();
                    reject(error); 
                }
            });

            downloadStream.on('error', (err) => {
                console.error('Error fetching image:', err);
                client.close();
                reject(err);
            });
        });

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

module.exports={extractTextFromImage}