const crawlerService= require("../services/crawler.service")

const crawleMedicine=async(req,res)=>{
    try{
        const response=await crawlerService.findMedicineIngredients(req.body?.medicine)
        return res.status(200).send({message:"Medicine crawled successfully",data:response})
    }catch(error){
        return res.status(500).send({message:error?.message})
    }
}

module.exports={crawleMedicine}