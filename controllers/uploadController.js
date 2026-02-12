
const cloudinary = require('../config/cloudinary');

exports.uploaadImage = async(req,res)=>{
    try {
        if(!req.files || req.files.length === 0){
            return res.status(400).json({
                message : 'No image provided'
            })
        }
        console.log("FILES:", req.files);
    console.log("USER:", req.user);
        const uploadPromises = req.files.map(file => {
            return new Promise((resolve,reject)=>{
                const stream = cloudinary.uploader.upload_stream(
                    {folder : "posts"},
                    (error,result)=>{
                        if(error) reject(error);
                        else resolve(result.secure_url);
                        
                    }
                );
                stream.end(file.buffer);
            })
        })
        const imageUrls = await Promise.all(uploadPromises);
        res.status(200).json({ imageUrls });
    
    } catch (error) {
        res.status(500).json({ message: "Cloudinary upload failed" });
         
    }
}