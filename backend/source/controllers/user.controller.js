import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadFileCloudinary } from "../utils/Cloudinary.js";

const generateAccessTokenandRefreshToken = async function (id) {
    const user = await User.findById(id);
    if (!user) {
        throw new ApiError(404, "User not found in the database");
    }
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ ValidateBeforeSave: false });
    return { accessToken, refreshToken };
};

// Corrected registerUser to include the role field
const registerUser = asyncHandler(async function (req, res) {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
        throw new ApiError(400, "All fields (username, password, role) are required");
    }



    const existedUser = await User.findOne({ username });
    if (existedUser) {
        throw new ApiError(409, "User with this username already exists");
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar is a reqired field");
    }

    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.cover) && req.files.cover.length > 0)
    {
        coverImageLocalPath = req.files.cover[0]?.path;
    }

    const avatar = await uploadFileCloudinary(avatarLocalPath);
    const cover = await uploadFileCloudinary(coverImageLocalPath);

    if(!avatar)
    {
        throw new ApiError(400,"Failed to upload to cloudinary");
    }

    const user = await User.create({
        username: username.toLowerCase(),
        avatar : avatar.url,
        coverImage : cover?.url || "",
        password,
        role, // Pass the role to the creation method
    });

    const userCreated = await User.findById(user._id).select("-password -refreshToken");

    if (!userCreated) {
        throw new ApiError(500, "User creation failed");
    }

    return res.status(201).json(
        new ApiResponse(201, userCreated, "User registered successfully")
    );
});


const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// This is the fixed loginUser function.
const loginUser = asyncHandler(async function (req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
        throw new ApiError(400, "Username and password are required");
    }

    // CORRECTED: The findOne query now uses the correct syntax.
    const user = await User.findOne({ username });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isPasswordvalid = await user.isPasswordCorrect(password);

    if (!isPasswordvalid) {
        throw new ApiError(401, "Incorrect Password");
    }

    const { accessToken, refreshToken } = await generateAccessTokenandRefreshToken(user._id);

    const logedInUser = await User.findById(user._id).select("-password -refreshToken");

    // Cleaned up the options object to remove the duplicate httpOnly property.
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    };

    res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, { user: logedInUser, accessToken, refreshToken }, "User logged in successfully"));
});

const logoutUser = asyncHandler(async function (req, res) {
    await User.findByIdAndUpdate(req.user._id,
        {
            $set: {
                refreshToken: "",
            }
        },
        {
            new: true,
        }
    );
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" ? true : false,
        sameSite: "strict",
    };

    res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "user logged out successfully"));
});



export { registerUser, getUser, loginUser, logoutUser, generateAccessTokenandRefreshToken };