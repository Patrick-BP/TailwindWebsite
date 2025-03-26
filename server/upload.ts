import multer from "multer";
import path from "path";
import fs from "fs";
import { randomBytes } from "crypto";

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Generate a unique filename to prevent overwriting
    const uniqueSuffix = `${Date.now()}-${randomBytes(8).toString('hex')}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  }
});

// Define file filter to only allow images
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|svg)$/)) {
    return cb(new Error('Only image files are allowed!'));
  }
  cb(null, true);
};

// Create multer middleware
export const uploadMiddleware = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  }
});

// Handle file upload and return the URL
export const handleFileUpload = async (file: Express.Multer.File): Promise<string> => {
  // In a real-world scenario, you might want to:
  // 1. Process the image (resize, compress, etc.)
  // 2. Upload to a CDN or cloud storage
  // 3. Return the URL from the CDN or cloud storage
  
  // For now, we'll just return the local path
  return `/uploads/${file.filename}`;
};
