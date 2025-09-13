import {Blog} from "../models/blog.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadFileCloudinary } from "../utils/Cloudinary.js";

const createBlog = asyncHandler ( async (req,res) => {
    const {title,content,coverImage,tags } = req.body;

     const author = req.user._id;

     if(!title || !content)
     {
        throw new ApiError (400,"Title and content are required fileds");
     }

  // Step 1: Collect local paths for the picture files
    let picturesLocalPaths = [];
    if (req.files && Array.isArray(req.files.pictures) && req.files.pictures.length > 0) {
        console.log(req.files.pictures);
        picturesLocalPaths = req.files.pictures.map(file => file.path);
    } else {
        // If no pictures were uploaded, we can still proceed
        picturesLocalPaths = [];
    }
    
    // Step 2: Upload all picture files to Cloudinary concurrently
    // We use Promise.all to handle multiple asynchronous operations in parallel
    // and wait for all of them to complete.
    const uploadPromises = picturesLocalPaths.map(path => uploadFileCloudinary(path));
    const cloudinaryUploadResults = await Promise.all(uploadPromises);

    // Filter out any failed uploads (where the result is null)
    const uploadedPictures = cloudinaryUploadResults.filter(result => result !== null);

    // Step 3: Extract the secure URLs from the successful uploads
    const picturesCloudinaryUrls = uploadedPictures.map(result => result.secure_url);

    // Step 4: Create the new blog post document
    const blog = await Blog.create({
        title,
        content,
        // Assuming coverImage is a URL or is handled separately.
        // If it's a local file, you'd need to upload it here as well.
        coverImage, 
        tags,
        author,
        pictures: picturesCloudinaryUrls // Assign the array of Cloudinary URLs to the pictures field
    });

     if(!blog)
     {
        throw new ApiError(500,"Failed in the creation of the blog post");
     }

    return res.
    status(200).
    json(new ApiResponse(201,blog,"Blog created successfully"));

})

// Corrected backend route for fetching user's blogs
const getBlogs = asyncHandler(async (req, res) => {
    // 1. Get the author's ID from the authenticated user
    const author = req.user._id;

    // 2. Find all blogs where the author matches the authenticated user
    const blogs = await Blog.find({ author }).sort({ createdAt: -1 });

    // 3. Return the blogs. Mongoose will return an empty array if no blogs are found,
    // which is the correct and expected behavior.
    return res.status(200).json(
        new ApiResponse(
            200,
            blogs,
            "Successfully fetched all blogs for the authenticated user"
        )
    );
});

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

    return res.status(200).json(new ApiResponse(200,blog,"Blog post fetched successfully."));

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

const toggleLike = asyncHandler(async (req,res) => {

    //get blog id
    //get auth user info through the req object
    //get the blog useing id from db
    //check if the user alredy liked the blog
    //if he already liked the blog decreased the like count 
    //or else increase the like value
    //save the updated changes in the db
    //return response


        const {blogId} = req.params;

       const userId = req.user._id;

       const blog = await Blog.findById(blogId);

       if(!blog)
       {
        throw new ApiError(404,"Blog with this id not found in the database");
       }

       const hasLiked = blog.likedBy.includes(userId);

       if(hasLiked)
       {
        blog.likedBy.pull(userId);
        blog.likesCount--;
       }
       else
       {
        blog.likedBy.push(userId);
        blog.likesCount++;
       }

       await blog.save();

       return res.status(200).json(new ApiResponse(200,{},"Liked toggeled successully"))


})





export {getBlogById};
export {createBlog};
export {getBlogs};
export {updateBlog};
export {deleteBlog};
export {toggleLike};