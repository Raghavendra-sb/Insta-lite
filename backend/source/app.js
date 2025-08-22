// This file is the main entry point for the Express application.
import express from "express";
import router from "./routes/user.route.js";
import cookieParser from "cookie-parser"; 
import dotenv from "dotenv"; 
import connectDB from './db/index.js'; // Assuming you have a file to connect to the DB

// Load environment variables from a .env file.
dotenv.config({
    path: './.env'
});

const app = express();

// Middleware to parse incoming JSON requests.
app.use(express.json({ limit: "16kb" }));

// Middleware to parse URL-encoded data.
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Middleware to serve static files.
app.use(express.static("public"));

// Middleware to parse cookies.
app.use(cookieParser());

// Connect to the database.
// This function call should be placed here to ensure the connection is established when the app starts.
connectDB();

// Mount the user routes on the /api/users path.
// This must be done before exporting the app.
app.use("/api/users", router);   //So basically, app.use("/api/users", router) says:

//“Hey Express, any request that starts with /api/users should be handled by this router module.”

// A simple root route for testing.
app.get("/", (req, res) => {
    res.send("Hello World");
});

export default app;