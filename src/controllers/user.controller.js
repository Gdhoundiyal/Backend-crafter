import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const resgisterUser = asyncHandler(async (req, res) => {
    // console.log("logg req", req);
    
    //extracting data from forntend request
    const {fullname, username, email, password, } = req.body

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

    console.log("avatart file", req.files, req.files?.avatar)
    // console.log("avatart body", req.body)
    const  avatarLocalPath = req.files?.avatar[0]?.path ?? req.body?.avatar;
    let  coverImageLocalPath = req.files?.coverimage[0]?.path ?? req.body?.coverimage
    
    console.log(" avatarLocalPath", avatarLocalPath)
    // if(req.files && Array.isArray(req.files.coverimage) && req.files.coverimage.length > 0){
    //     coverImageLocalPath = req.files.coverimage[0].path
    // }

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required")
    }
    
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)


    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required")
    }
    console.log("cretionn", avatar);
    

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
        console.log("isPasswordCorrect in >>>>>", user);
        
        const accessToken = user.generateAccessToken()
        console.log("accessTOken.....", accessToken)
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        console.log("refreshToken.....", refreshToken)
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

    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    if(!user){
        throw new ApiError(401, 'User does not exist')
    }
    // console.log("user>>>>>>>>>>>", user);

    // const isPasswordValid = await user.isPasswordCorrect(password);

    // if(!isPasswordValid){
    //     throw new ApiError(401, 'invalid user credentials')
    // }

    // const stringId = user?._id.toString();
    console.log("user>>>>", user._id)
    const {accessToken, refreshToken} = await generateAccessTokenAndRefreshToken(user?._id);
    
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
    console.log("logoit hitted", req.cookies?.accessToken);
    
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            refreshToken: undefined
        },
        {
            new: true
        }
    )
    console.log("logoutUsersss", user);
    
    const options = {
        httpOnly : true,
        secure: true
    }

    return res 
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(200, {}, 'User Logged Out Successfully')
})
export {
    resgisterUser,
    loginUser,
    logoutUser
} 