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
