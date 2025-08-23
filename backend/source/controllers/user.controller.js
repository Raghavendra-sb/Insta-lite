import {User} from "../models/user.model.js";
import ApiError  from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js"

const generateAccessTokenandRefreshToken = async function (id){
    const user = await User.findById(id);
    if(!user)
    {
        throw new ApiError(404,"User not found in the database");
    }
    const accessToken = user.generateAcessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
   await user.save({ValidateBeforeSave: false});
   return {accessToken,refreshToken};
}


const registerUser = async (req, res) => {
    try {
        // Destructure and validate required fields from the request body.
        const { username, password, role } = req.body;
        if (!username || !password || !role) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if a user with the provided username already exists in the database.
        // This prevents duplicate key errors and provides a more helpful message to the client.
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists. Please choose a different username." });
        }

        // Create a new user in the database.
        const user = await User.create({
            username: username,
            password: password,
            role: role
        });

        // Respond with a success message and the created user object.
        res.status(201).json({ message: "User created successfully", user });

    } catch (error) {
        // Log the full error to the server console for detailed debugging.
        console.error("Error creating user:", error);
        
        // Respond with a more informative error message to the client.
        // This helps you to understand the problem without having to check the server logs every time.
        res.status(500).json({
            message: "Internal server error",
            debugMessage: error.message
        });
    }
};


const getUser = async (req,res) =>
{
    try{
        const user = await User.findById(req.params.id);
        if(!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    }
    catch(error)
    {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const loginUser = asyncHandler(async function (req,res)
{
    const {username,password}=req.body;

    if(!username)
    {
        throw new ApiError(400,"please enter the username")
    }
    if(!password)
    {
        throw new ApiError(400,"please enter the password")
    }

    const user = await User.findOne(
      {
        $or:[{username},{password}] 

      }
       // $or({username},{password})
    )

    if(!user)
    {
        throw new ApiError(404,"User not found");
    }

    const isPasswordvalid = await user.isPasswordCorrect(password)

    if(!isPasswordvalid)
    {
        throw new ApiError(401,"Incorrect Password");
    }

    const {accessToken,refreshToken}= await generateAccessTokenandRefreshToken(user._id);

    const logedInUser = await User.findOne(user._id).select("-password -refreshToken");
    
    const options = 
    {
        httpOnly:true,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Only secure in production (HTTPS)
        sameSite: "strict", 
    }

    res.status(200).
    cookie("accessToken",accessToken,options).
    cookie("refreshToken",refreshToken,options).
    json(new ApiResponse(200,{user:logedInUser,accessToken,refreshToken},"User logged in successfully"))

})

const logoutUser = asyncHandler(async function (req,res) {
    await User.findByIdAndUpdate(req.user._id ,
        {
            $set : {
                refreshToken:"",
            }
        },
        {
            new:true,
        }
    )
    const options = 
    {
        httpOnly:true,
        secure:process.env.NODE_ENV === "production" ? true : false,
        sameSite : "strict"
    }

    res.status(200).
    clearCookie("accessToken",options).
    clearCookie("refreshToken",options).
    json(new ApiResponse(200, {},"user logged out successfully"));
})






export {registerUser};
export {getUser};
export {generateAccessTokenandRefreshToken};
export {loginUser};
export {logoutUser};