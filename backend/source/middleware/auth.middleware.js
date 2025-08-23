import {ApiError} from "../utils/ApiError.js"
import jwt from "jsonwebtoken"
import { asyncHandler } from "../utils/asyncHandler.js"
import {User} from "../models/user.model.js"

export const verifyJWT = asyncHandler(async (req,res,next)=>
{
    const token = req.cookies?.accessToken || req.headers["authorization"]?.replace("Bearer ", "");
    
    if(!token)
    {
        throw new ApiError(401,"User not authenticated")
    }
    
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
    // CORRECTED: Changed the select statement to only include the 'role' field
    // This avoids the MongoServerError caused by mixing inclusion and exclusion.
    const user = await User.findById(decodedToken?._id).select("role");
    
    if(!user)
    {
        throw new ApiError(401,"Invalid Access token")
    }   
    
    req.user = user;
    
    next();
});

export const verifyUser = (...allowedRoles) => asyncHandler(async (req,res,next)=>{
 
    if( !req.user || !allowedRoles.includes(req.user.role))
    {
        throw new ApiError(403,"User not authorized")
    }
    next();

});