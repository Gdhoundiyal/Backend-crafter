import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const resgisterUser = asyncHandler(async (req, res) => {

    //extracting data from forntend request
    const {fullname, username, email, password} = req.body

    //checking validation
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
    let  coverImageLocalPath;
   
    if(req.files && Array.isArray(req.files.coverimage) && req.files.coverimage.length > 0){
        coverImageLocalPath = req.files.coverimage[0].path
    }

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required")
    }
    
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)


    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required")
    }

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverimage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })


    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Registered Successfully")
    )

})

const generateAccessTokenAndRefreshToken = async(userId)=> {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false})

        return {accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(500, 'Something went wrong while generating access and refresh Tokens')
    }
}

const loginUser = asyncHandler(async (req, res)=>{
    // extract data 
    // data validation
    // find the user
    // password check
    // generate access and refresh token
    // send cookies

    const {username, email, password} = req.body;

    if(!username || !email){
        throw new ApiError(400, 'username and password is required');
    }

    const user = User.findOne({
        $or: [{username}, {email}]
    })

    if(!user){
        throw new ApiError(401, 'User does not exist')
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if(!isPasswordValid){
        throw new ApiError(401, 'invalid user credentials')
    }

    const {accessToken, refreshToken} = await generateAccessTokenAndRefreshToken(user._id);

    const loggedinUser = await User.findById(user._id).select(-password -refreshToken);

    const options = {
        httpOnly : true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken  , options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedinUser, accessToken, refreshToken
            },
            "User Logged In Successfully"
        )
    )
})

const logoutUser = asyncHandler(async (req, res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            refreshToken: undefined
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly : true,
        secure: true
    }

    return res 
        .status(200)
        .ClearCookie("accessToken", options)
        .ClearCookie("refreshToken", options)
        .json(200, {}, 'User Logged Out Successfully')
})
export {
    resgisterUser,
    loginUser,
    logoutUser
} 