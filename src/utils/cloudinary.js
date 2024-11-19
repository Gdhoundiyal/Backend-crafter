import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'
import dotenv from "dotenv"
dotenv.config();
    // Configuration
    cloudinary.config({ 
        cloud_name: 'dy6ynkna8', 
        api_key: '194192566931368', 
        api_secret: '0mwTLONEK2AstzzIg97huttf-Cc'// Click 'View API Keys' above to copy your API secret
    });

  console.log(process.env.CLOUDINARY_API_NAME)
    const uploadOnCloudinary = async (localFilePath) => {
        try{
            if(!localFilePath) return null

            const response = await cloudinary.uploader.upload(localFilePath, {
                resource_type: 'auto'
            })
            console.log("response onn cloudinary", response);
            fs.unlinkSync(localFilePath)
            return response
        } catch(err){
            fs.unlinkSync(localFilePath) 
            return null;
        }
    }



    
    // // Upload an image
    //  const uploadResult = await cloudinary.uploader
    //    .upload(
    //        'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
    //            public_id: 'shoes',
    //        }
    //    )
    //    .catch((error) => {
    //        console.log(error);
    //    });
    
    // console.log(uploadResult);
    
    // // Optimize delivery by resizing and applying auto-format and auto-quality
    // const optimizeUrl = cloudinary.url('shoes', {
    //     fetch_format: 'auto',
    //     quality: 'auto'
    // });
    
    // console.log(optimizeUrl);
    
    // // Transform the image: auto-crop to square aspect_ratio
    // const autoCropUrl = cloudinary.url('shoes', {
    //     crop: 'auto',
    //     gravity: 'auto',
    //     width: 500,
    //     height: 500,
    // });
    
    // console.log(autoCropUrl);    

export {uploadOnCloudinary}