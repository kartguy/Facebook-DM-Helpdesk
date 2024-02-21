require("dotenv").config();
const express=require("express");
const { webRouter } = require("./routes/web");
const app=express();
const cors=require("cors");
const { default: mongoose } = require("mongoose");
const { rootRouter } = require("./routes/routes");

mongoose.connect(process.env.Mongo_URL)
    .then(console.log("MongoDB Connected"));

app.use(cors());
app.use(express.json());

app.use(express.urlencoded({extended:true}))


app.get('/',(req,res)=>{
    res.json({
        msg:"Hello from server"
    })
})

app.use('/api',rootRouter);

app.use('/',webRouter)

app.listen(process.env.PORT,()=>console.log(`Server running at port ${process.env.PORT}`))