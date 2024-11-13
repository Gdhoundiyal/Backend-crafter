import mongoose, {Schema} from "mongoose";

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
        coverimage: [
            {
                type : Schema.Types.ObjectId,
                ref : "Video"
            }
        ],
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

export const user = mongoose.model("User", userSchema)