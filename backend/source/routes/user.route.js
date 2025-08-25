import { Router } from "express";
import { registerUser,getUser,loginUser,logoutUser} from "../controllers/user.controller.js";
import { verifyJWT,verifyUser } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";//importing the multer middleware

const router = Router();

// Route to create a new user
router.route("/register").post(//is upload is the middleware for hnagling file upload provide by multer,
    upload.fields([//for multiple file upload
        {
             name:"avatar",//name of the field in the form data
             maxCount:1
        }
        ,
        {
            name:"cover",
            maxCount:1 
        }
    ]),
    registerUser);
// Route to get a user by ID
router.route("/:id").get(getUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT,logoutUser);



export default router;