const express=require("express");
const app=express();

app.get('/',(req,res)=>{
    res.json({
        msg:"Hello from server"
    })
})

app.listen(3000,()=>console.log("Server running"))