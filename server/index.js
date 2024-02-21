const express=require("express");
const { webRouter } = require("./routes/web");
const app=express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.get('/',(req,res)=>{
    res.json({
        msg:"Hello from server"
    })
})

app.use('/',webRouter)

app.listen(3000,()=>console.log("Server running"))