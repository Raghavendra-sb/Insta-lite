import connectDB from "./db/index.js";
import app from "./app.js"
import dotenv from "dotenv";

dotenv.config({
    path:'./env'
})


connectDB()
.then(()=>{
   app.listen(process.env.PORT || 8000 ,()=>{
    console.log(`Server running on the port ${process.env.PORT}`);
    app.on("error",(error)=>{
        console.log("Error:",error);
        throw error; 
    })
   })
})
.catch((error)=>{
 console.error(`Mongo db connection failed :${error}`)
})


// index.js (or sometimes server.js)

// Usually serves as the entry point of your application.

// Its main job is to start the server and maybe load environment variables.

// Keeps things minimal, so your app structure is clean.