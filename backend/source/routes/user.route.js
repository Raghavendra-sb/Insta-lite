import { Router } from "express";
import { registerUser,getUser } from "../controllers/user.controller.js";


const router = Router();

// Route to create a new user
router.route("/register").post(registerUser);
// Route to get a user by ID
router.route("/:id").get(getUser);


export default router;