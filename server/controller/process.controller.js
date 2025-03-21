const {extractTextFromImage} =require("../services/process.service")

const extractData=async(req,res)=>{
    try{
        const image= req.params?.image
        const response=await extractTextFromImage(image,req?.user?._id,req?.user?.email)
        // console.log(await response)
        res.status(200).send({message:await response})
    }catch(error){
        res.status(500).send({message: error?.message})
    }
}

module.exports={extractData}