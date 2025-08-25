import {Blog} from "../models/blog.model.js";
import { Comment } from "../models/comment.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createComment = asyncHandler(async (req,res)=>
{
    const {content } = req.body;
    const author = req.user._id;
    const {blogId} = req.params;

    if(!content)
    {
        throw new ApiError(400,"Comment content is required");
    }

    //get the blog
    //create a new document and update them
    //push this document into the existed array ie comments
    //increase the comments count
    //save the changes

    const blog = await Blog.findById(blogId);

    if(!blog)
    {
        throw new ApiError(404,"Blog not found in the database");
    }

    const comment = await Comment.create({
        content,
        author,
        blogPost:blogId
    })

    blog.comments.push(comment._id);
    blog.commentsCount++;

    await blog.save();

    return res
        .status(201)
        .json(new ApiResponse(201, comment, "Comment created successfully"));
})




export {createComment};