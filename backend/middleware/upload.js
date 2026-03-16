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

// File filter for PDFs and images
const fileFilterPDF = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|pdf/;
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Only PDF and image files are allowed (jpeg, jpg, png, gif, webp, pdf)"));
  }
};

// Configure multer for images only
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter,
});

// Configure multer for PDFs and images (for advertisements)
export const uploadPDF = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit for PDFs
  },
  fileFilter: fileFilterPDF,
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
 * Upload PDF or image to Cloudinary
 * @param {Buffer} fileBuffer - File buffer from multer
 * @param {string} folder - Cloudinary folder path
 * @param {string} mimetype - MIME type of the file
 * @returns {Promise<{url: string, public_id: string}>}
 */
export const uploadFileToCloudinary = async (fileBuffer, folder = "jssa/advertisements", mimetype = "application/pdf") => {
  return new Promise((resolve, reject) => {
    const isPDF = mimetype === "application/pdf";
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: isPDF ? "raw" : "image",
        ...(isPDF ? {} : {
          transformation: [
            {
              width: 1000,
              height: 1000,
              crop: "limit",
              quality: "auto",
            },
          ],
        }),
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
