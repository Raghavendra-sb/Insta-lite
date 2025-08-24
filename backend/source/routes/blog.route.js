import { Router } from "express";
import { verifyJWT,verifyUser } from "../middleware/auth.middleware.js";
import { createBlog,getBlogById,getBlogs,updateBlog,deleteBlog } from "../controllers/blog.controller.js";
const router = new Router();

router.route("/blogs").POST(verifyJWT,createBlog);
router.route("/blogs").GET(verifyJWT,getBlogs);
router.route("/blogs/:id").GET(verifyJWT,getBlogById);
router.route("blog/:id").PUT(verifyJWT,updateBlog);
router.route("blog/:id").DELETE(verifyJWT ,deleteBlog);



export default router;