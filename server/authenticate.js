const {getUserFromToken}= require("./config/jwtProvider")
const userService= require("./services/user.service")

const authenticate=async (req,res,next)=>{
    try{
        const token= req.headers?.authorization?.split(" ")[1]
        // console.log(token)
        if(!token){
            res.status(404).send({error:"Token is not found"})
        }else{
            const {userId,userEmail}=await getUserFromToken(token)
            const user=await userService.getUser(userId,userEmail)
            req.user= {
                _id: user?._id,
                name: user?.name,
                email: user?.email,
                birth: user?.birth,
                image: user?.image,
                address: user?.address,
                createdAt: user?.createdAt
            }
        }
    }catch(error){
        res.status(500).send({error: error.message})
    }
    next()
}

module.exports=authenticate