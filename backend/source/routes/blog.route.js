import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { createBlog, getBlogById, getBlogs, updateBlog, deleteBlog } from "../controllers/blog.controller.js";
import { upload } from "../middleware/multer.middleware.js";//importing the multer middleware
const router = Router();

// Route for creating a new blog (POST) and getting all blogs (GET)
router.route("/")
    .post(verifyJWT,upload.fields(
        [{
        name : "pictures",
        maxCount : 5

        }]
),createBlog)
   router.route("/").get(verifyJWT, getBlogs);

// Route for getting a single blog (GET), updating (PUT), and deleting (DELETE)
router.route("/:id")
    .get(verifyJWT, getBlogById)
    .put(verifyJWT, updateBlog)
    .delete(verifyJWT, deleteBlog);


export default router;