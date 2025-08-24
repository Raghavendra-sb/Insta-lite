import {Blog} from "../models/blog.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createBlog = asyncHandler ( async (req,res) => {
    const {title,content,coverImage,tags } = req.body;

     const author = req.user._id;

     if(!title || !content)
     {
        throw new ApiError (400,"Title and content are required fileds");
     }

     const blog = await Blog.create(
        {
            title,
            content,
            coverImage,
            tags,
            author,
       }
     );

     if(!blog)
     {
        throw new ApiError(500,"Failed in the creation of the blog post");
     }

    return res.
    status(200).
    json(ApiResponse(201,blog,"Blog created successfully"));

})


const getBlogs = asyncHandler(async (req,res) => {
    const author = req.user._id;

    const blogs = await Blog.find({author});

    if(!blogs)
    {
        throw new ApiError(500,"failed to fetch the blogs from the database");
    }

    return res.status(200).json(ApiResponse(
        200,
        blogs,
        "Successfully fetched all blogs for the authenticated user"
    ));
})

const getBlogById = asyncHandler(async (req,res) => {
    const {id}= req.params;

    const blog = await Blog.findById(id);

    if(!blog)
    {
        throw new ApiError(404 , "Blog not found");
    }

    if (blog.author.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to view this blog post");
    }

    return res.status(200).json(ApiResponse(200,blog,"Blog post fetched successfully."));

})

const updateBlog = asyncHandler(async (req,res) => {
     const {id} = req.params;

     const {title,content,coverImage,tags } = req.body;

     const blog = await Blog.findById(id);

     if(!blog)
     {
        throw new ApiError(404,"Blog post not found")
     }

     if(blog.author.toString() !== req.user._id.toString())
     {
        throw new ApiError(403,"You are not authorized to update the post");
     }
     if(title)
     {
        blog.title = title;
     }
     if (content) {
        blog.content = content;
    }
    if (coverImage) {
        blog.coverImage = coverImage;
    }
    if (tags) {
        blog.tags = tags;
    }

    const updatedBlog = await blog.save();

     return res.status(200).json(
        new ApiResponse(200, updatedBlog, "Blog post updated successfully.")
    );

})

const deleteBlog = asyncHandler(async (req,res) => {
    const {id}= req.params;

    const blog = await Blog.findById(id);

    if(!blog)
    {
        throw new ApiError(404 , "Blog not found");
    }

    if (blog.author.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to view this blog post");
    }

    const deletedBlog = await Blog.findByIdAndDelete(id);



     return res.status(200).json(
        new ApiResponse(200, deletedBlog, "Blog post deleted successfully.")
    );

})





export {getBlogById};
export {createBlog};
export {getBlogs};
export {updateBlog};
export {deleteBlog};