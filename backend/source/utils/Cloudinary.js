import { v2 as cloudinary } from 'cloudinary';//The v2 API of the Cloudinary SDK for Node.js.
import fs from "fs"//Node.js's file system module to delete the local file after use.




    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret:process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
    });

const uploadFileCloudinary = async(localFilePath)=>{
    try {
        if(!localFilePath) return null;
        //upload file in cloudinary
       const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto" //wht type of file tht im uploading
        })
        fs.unlinkSync(localFilePath) //remove the file in the locally saved as upload uperation got success 
        console.log("file is uploaded on cloudinary successfully",response.url);//wt is the upload url of the file is given by the response.url
        return response;
    } catch (error) {
        //yea to save from storing garbage files
        fs.unlinkSync(localFilePath) //remove the file in the locally saved as upload uperation got fail
        return null;
    }
}

export {uploadFileCloudinary}