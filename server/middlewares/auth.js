const { validateToken } = require("../services/auth");

const authMiddleware=(req,res,next)=>{
    const auth=req.header('Authorization');
    if(!auth || !auth.startsWith("Bearer ")){
        return res.status(403).json({msg:"No credentials"})
    }

    const token= auth.split(" ")[1];

    try {
        const payload= validateToken(token);
        if(payload==null){
            console.log("Invalid token");
        }
        req.body={...req.body,userId:payload.userId};
        // console.log(req.body);
    } 
    catch (error) {
        console.log(error);
        return res.status(403).json({msg:"Unauthorized! Please Sign in."})
    }
    
    next();
}

module.exports={
    authMiddleware
}