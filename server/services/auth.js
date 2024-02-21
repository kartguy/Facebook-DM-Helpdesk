require("dotenv").config();
const JWT=require("jsonwebtoken");

function createTokenForUser(user){
    const payload={
        userId:user._id
    }

    const token=JWT.sign(payload,process.env.SECRET_KEY);
    return token;
}

function validateToken(token){
    const payload=JWT.verify(token,process.env.SECRET_KEY);
    return payload;
}

module.exports={
    createTokenForUser,
    validateToken
}