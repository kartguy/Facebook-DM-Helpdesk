const express=require("express");
const { User } = require("../models/user");
const {Message} =require("../models/chat")
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
            jwtToken:`${token}`
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
                  jwtToken:`${token}`
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

// userdata getter route
router.get("/userdata", async (req, res) => {
    try {
      res.send(req.userdata);
    } catch (err) {
      console.error(err);
    }
  });
  
  // new messages storing route
  router.post("/storeMessages", async (req, res) => {
    try {
      const { custId, custMsg } = req.body;
  
      const newMessages = custMsg.map((msg) => ({
        msgId: msg.msgId,
        message: msg.message,
        created_time: msg.created_time,
        from: {
          senderName: msg.from.name,
          senderEmail: msg.from.email,
          senderId: msg.from.id,
        },
      }));
  
      const existingCustId = await Message.findOne({ custId });
  
      if (existingCustId) {
        existingCustId.messages.push(...newMessages);
        await existingCustId.save();
      } else {
        const firstTimeCust = new Message({
          custId,
          messages: newMessages,
        });
        await firstTimeCust.save();
      }
  
      res
        .status(200)
        .json({ success: true, message: "Messages stored successfully" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  router.get("/lastStoredMessageTimestamp", async (req, res) => {
    try {
      const { custId } = req.query;
  
      const latestMessage = await Message.findOne(
        { custId },
        { "messages.created_time": 1 }
      ).sort({ "messages.created_time": -1 });
  
      if (
        !latestMessage ||
        !latestMessage.messages ||
        latestMessage.messages.length === 0
      ) {
        res.send({timestamp: "0"});
      } else {
        res.send({timestamp: latestMessage.messages[0].created_time});
      }
    } catch (error) {
      console.error("Error retrieving last stored message timestamp:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

module.exports={
    rootRouter:router
}