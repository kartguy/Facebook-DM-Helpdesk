const express=require("express");
const { webRouter } = require("./routes/web");
const app=express();

app.get('/',(req,res)=>{
    res.json({
        msg:"Hello from server"
    })
})


app.use('/webhook',webRouter)

app.listen(3000,()=>console.log("Server running"))