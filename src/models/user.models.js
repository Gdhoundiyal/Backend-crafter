import mongoose, {Schema} from "mongoose";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const userSchema = new Schema(
    {
        username: {
            type : String,
            required : true,
            unique : true,
            lowercase : true,
            index : true,
            trim : true
        },
        email: {
            type : String,
            required : true,
            unique : true,
            lowercase : true,
            trim : true
        },
        fullname: {
            type : String,
            required : true,
            index : true,
            trim : true
        },
        avatar: {
            type : String, // cloudinary url
            required : true,
        },
        coverimage: {
            type: String,
        },
        
        password: {
            type : String,
            required: [true, 'Password is required']
        },
        refreshToken: {
            type: String
        }
    }, {
        timestamps: true
    }
)

userSchema.pre('save', async function(next){
    // directly returning if not modified
    if(this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.generateAccessToken = function (){
    jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateAccessToken = function (){
    jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullname
        },
        process.env.REQUEST_TOKEN_SECRET,
        {
            expiresIn: process.env.REQUEST_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)