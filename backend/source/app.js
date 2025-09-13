import express from "express";
import userRoutes from "./routes/user.route.js";
import blogRoutes from "./routes/blog.route.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import cors from "cors";

// Load environment variables
dotenv.config({ path: "./.env" });

const app = express();

app.use(cors({
    origin: [
        'https://insta-lite-1.onrender.com', // Your backend's URL
        'http://localhost:5173',             // Your local frontend URL
        'https://insta-lite-2.onrender.com'  // Your new deployed frontend URL
    ],
    credentials: true,
}));
// Middleware
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// DB Connection
connectDB();

// Routes
app.use("/api/users", userRoutes);
app.use("/api/blogs", blogRoutes);

// Root test route
app.get("/", (req, res) => {
  res.send("Hello World");
});

export default app;