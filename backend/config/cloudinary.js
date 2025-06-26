import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// Configure cloudinary account
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Set up multer-storage-cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "flexin'",
    allowed_formats: ["jpg", "jpeg", "png"], // Allowed file types
    public_id: (req, file) => `${Date.now()}-${file.originalname}` // Custom public ID
  }
});

export { cloudinary, storage };