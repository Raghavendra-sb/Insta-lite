// user.model.js - Corrected and Debugged
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: 6
    },
    refreshToken: {
        type: String,
        default: null
    },
    role: {
        type: String,
        required: true // Ensures a role is always provided.
    },
    avatar:
    {
            
        type: String,//cloudinary URL
        required: true,
            
    },
    coverImage:
    {
        type: String,//cloudinary URL
    }
    
}, { timestamps: true });

// Middleware to hash the password before saving a new user or updating the password
userSchema.pre("save", async function (next) {
    // Correctly checks if the 'password' field has been modified.
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    return next();
});

// Method to compare the password
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Method to generate an access token
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    );
};

// Method to generate a refresh token
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    );
};

export const User = mongoose.model("User", userSchema);