import { Router } from "express";
import { registerUser,getUser,loginUser,logoutUser} from "../controllers/user.controller.js";
import { verifyJWT,verifyUser } from "../middleware/auth.middleware.js";

const router = Router();

// Route to create a new user
router.route("/register").post(registerUser);
// Route to get a user by ID
router.route("/:id").get(getUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT,logoutUser);



export default router;