const { mongoose } = require("mongoose");
const bcrypt=require("bcrypt")

const userSchema=new mongoose.Schema(
    {
    email:{
            type:String,
            required:true,
            unique:true
        },
    fullName:{
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    password:{
        type: String,
        required: true,
        minLength: 6
    }

},
{timestamps:true}
)


userSchema.methods.createHash = async function (plainTextPassword) {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(plainTextPassword, salt);
  };
  
userSchema.methods.validatePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  };

  const User=mongoose.model("user",userSchema);

  module.exports= {
    User
}