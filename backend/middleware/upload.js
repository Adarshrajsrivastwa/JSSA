import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer for temporary storage (before uploading to Cloudinary)
const storage = multer.memoryStorage();

// File filter - only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Only image files are allowed (jpeg, jpg, png, gif, webp)"));
  }
};

// Configure multer
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter,
});

/**
 * Upload file to Cloudinary
 * @param {Buffer} fileBuffer - File buffer from multer
 * @param {string} folder - Cloudinary folder path
 * @returns {Promise<{url: string, public_id: string}>}
 */
export const uploadToCloudinary = async (fileBuffer, folder = "jssa/gallery") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: "image",
        transformation: [
          {
            width: 1000,
            height: 1000,
            crop: "limit",
            quality: "auto",
          },
        ],
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve({
            url: result.secure_url,
            public_id: result.public_id,
          });
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
};

/**
 * Delete image from Cloudinary
 * @param {string} publicId - Cloudinary public_id
 * @returns {Promise}
 */
export const deleteCloudinaryImage = async (publicId) => {
  try {
    // Extract public_id from URL if full URL is provided
    let actualPublicId = publicId;
    if (publicId.includes("cloudinary.com")) {
      // Extract public_id from URL
      const urlParts = publicId.split("/");
      const uploadIndex = urlParts.findIndex((part) => part === "upload");
      if (uploadIndex !== -1) {
        const versionIndex = uploadIndex + 1;
        const publicIdParts = urlParts.slice(versionIndex + 1);
        actualPublicId = publicIdParts.join("/").replace(/\.[^/.]+$/, "");
      }
    }

    const result = await cloudinary.uploader.destroy(actualPublicId);
    return result;
  } catch (error) {
    console.error("Error deleting Cloudinary image:", error);
    throw error;
  }
};

export default upload;
