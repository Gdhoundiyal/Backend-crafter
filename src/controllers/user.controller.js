import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.models.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"

const resgisterUser = asyncHandler(async (req, res) => {
    
    // res.status(200).json({
    //     message: 'ok'
    // })
    const {fullname, username, email, password} = req.body
    console.log("email: ", req.body)

    if([fullname, username, email, password].some((field)=>
    field?.trim() === ""
    )){
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = User.findOne({
        $or:  [{ username }, { email }]
    })

    if(existedUser){
        throw new ApiError(409, "User with email or username already exist ")
    }


    const  avatarLocalPath = req.files?.avatar[0]?.path;
    const  coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required")
    }

})

export {resgisterUser} 