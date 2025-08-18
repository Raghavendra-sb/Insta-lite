import {User} from "../models/user.model.js";

const registerUser = async (req, res) => {
    try {
        // Destructure and validate required fields from the request body.
        const { username, password, role } = req.body;
        if (!username || !password || !role) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if a user with the provided username already exists in the database.
        // This prevents duplicate key errors and provides a more helpful message to the client.
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists. Please choose a different username." });
        }

        // Create a new user in the database.
        const user = await User.create({
            username: username,
            password: password,
            role: role
        });

        // Respond with a success message and the created user object.
        res.status(201).json({ message: "User created successfully", user });

    } catch (error) {
        // Log the full error to the server console for detailed debugging.
        console.error("Error creating user:", error);
        
        // Respond with a more informative error message to the client.
        // This helps you to understand the problem without having to check the server logs every time.
        res.status(500).json({
            message: "Internal server error",
            debugMessage: error.message
        });
    }
};


const getUser = async (req,res) =>
{
    try{
        const user = await User.findById(req.params.id);
        if(!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    }
    catch(error)
    {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


export {registerUser};
export {getUser};