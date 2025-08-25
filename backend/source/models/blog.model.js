import mongoose  from "mongoose";

const blogSchema = new mongoose.Schema(
    {
        title : {
            type : String,
            required : true
        },
        content : {
            type : String,
            required : true
        },
        coverImage :
        {
            type : String
        },
        tags :
        [String],

        author : 
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true
        },
        pictures:
        [{
            type : String
        }],
        likesCount : {
            type : Number,
            default : 0
        },
        likedBy :
        [{
            type: mongoose.Schema.Types.ObjectId,
            ref : "User"
        }],
        commentsCount : {
            type : Number,
            default : 0
        },
        comments:[
            {
                type : mongoose.Schema.Types.ObjectId,
                ref : "Comment"
            }
        ]

    },


    {timestamps:true})


    export const Blog = mongoose.model("Blog",blogSchema);