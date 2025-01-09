import { User } from "../models/user.models.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken'
 
 export const verifyJWT = asyncHandler( async (req, res, next)=>{

    try {
        console.log("token", req.cookies?.accessToken);
        
        const decodedToken = jwt.verify(req.cookies?.accessToken, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select(
            "--password --refreshToken"
        )
    
        if (!user) {
            throw new ApiError(401, "invalid Access Token")
        }

        req.user = user;
        next()

    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access Token")
    }

})