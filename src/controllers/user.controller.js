import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const resgisterUser = asyncHandler(async (req, res) => {
    
    // res.status(200).json({
    //     message: 'ok'
    // })
    const {fullname, username, email, password} = req.body
    console.log("text: ", req.body)

    if([fullname, username, email, password].some((field)=>
    field?.trim() === ""
    )){
        throw new ApiError(400, "All fields are required")
    }

    const existedUser =  await User.findOne({
        $or:  [{ username }, { email }]
    })

    if(existedUser){
        throw new ApiError(409, "User with email or username already exist ")
    }


    const  avatarLocalPath = req.files?.avatar[0]?.path;
    const  coverImageLocalPath = req.files?.coverimage[0]?.path;
   

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required")
    }
    
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    
    console.log("......avatar", avatar.url);
    console.log("......coverImage", coverImage.url);


    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required")
    }

console.log(typeof(coverImage.url),"-------------------------------------------->coverImage.url")
    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverimage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    console.log("user createx", user);

    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Registered Successfully")
    )

})

export {resgisterUser} 