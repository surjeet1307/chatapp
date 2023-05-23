const jwt=require('jsonwebtoken')

const genrateToken=(id)=>{
    return jwt.sign({id},process.env.SCREATJWT,{
        expiresIn:"2d"
    })
}

module.exports=genrateToken