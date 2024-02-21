const express=require("express");
const { postWebHook, getWebHook } = require("../controllers/chatController");
const router=express.Router();

router.post('/webhook',postWebHook);
router.get('/webhook',getWebHook)


module.exports={
    webRouter:router
}