import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
const userSchema = new Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true,
            trim:true,
            lowercase:true,
            index:true
        },
        email:{
            type:String,
            required:true,
            unique:true,
            trim:true,
            lowercase:true
        },
        fullName:{
            type:String,
            required:true,
            trim:true,
            lowercase:true,
            index:true
        },
        avatar:{ // url stored
            type:String, //cldoudinary url like aws 
            required:true
        },
        coverimage:{
            type:String,
        },
        watchhistory:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"Video"
            }
        ],
        password:{
            type:String,
            required:[true,"Password is required"],
        },
        refreshtoken:{
            type:String
        }
    },
    {
        timestamps:true
    }
)
userSchema.pre('save',async function(next){ // async used because hashing may take time
    if(!this.isModified("password")){
        return next();
    } 
    this.password = await bcrypt.hash(this.password,10); // 10 is salt rounds and saved the hashed password
    next();
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password,this.password);
}

userSchema.methods.generateAccessToken = function(){  //run fast so not async
    return jwt.sign(
    {
        _id:this._id,
        email: this.email,
        username:this.username,
        fullName:this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
)
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
    {
        _id:this._id,
        email: this.email,
        username:this.username,
        fullName:this.fullName,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
)
}
export const User = mongoose.model('User',userSchema);
