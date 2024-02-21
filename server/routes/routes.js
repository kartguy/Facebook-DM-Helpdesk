const express=require("express");
const { User } = require("../models/user");
const router=express.Router();
const{createTokenForUser} =require('../services/auth')

router.post('/signup',async (req,res)=>{
    const userbody=req.body;

    try {
        const userbody=req.body;

        if (!userbody.fullName || !userbody.email || !userbody.password) {
            return res.status(422).json({ error: "You're missing some fields" });
        }

        const existingUser=await User.findOne({email:userbody.email});
        if(existingUser){
            return res.status(411).json({msg:"Email already taken."})
        }
            
        const newUser = new User({
            email: userbody.email,
            fullName: userbody.fullName
        });

        const hashedPassword=await newUser.createHash(userbody.password);

        newUser.password=hashedPassword;

        await newUser.save();

        const token= createTokenForUser(newUser);

        return res.status(201).json({   
            msg:"User created successfully.",
            token:`${token}`
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg:"Server not working" });
    }
})

router.post('/login',async (req,res)=>{
 
    try {
        const userBody=req.body;

        if (!userBody.email || !userBody.password) {
            return res.status(422).json({ error: "You're missing some fields" });
        }

        const user=await User.findOne({email:userBody.email});

        if(user==null){
            return res.status(400).json({
                msg: "User not found."
            })
        }
        else{
            if (await user.validatePassword(userBody.password)) {
                
                const token= createTokenForUser(user);

                return res.status(200).json({
                  message: "User Successfully Logged In",
                  token:`${token}`
                });
              } else {
                return res.status(400).json({
                  message: "Incorrect Password",
                });
              }
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg:"Server error" });
    }
})

module.exports={
    rootRouter:router
}