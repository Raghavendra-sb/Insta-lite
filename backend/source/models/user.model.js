import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
        username:
        {
            type:String,
            required:true,
            unique:true,
            trim:true
        },
        password:
        {
            type:String,
            required:[true,"Password is required"],
            minlength:6
        },
        refreshToken:
        {
            type:String,
            default:null
        },
        role:
        {
            type:String,
            required:true
        }

},{timestamps:true})

export const User = mongoose.model("User",userSchema);
//here User in the export const User and "User" are different 
//the first is the variable name and the second is the name of the collection in MongoDB
//The model is used to interact with the MongoDB collection named "users"
//the significane of the caps is tht in the coollection name, it is convention to use lowercase and plural form