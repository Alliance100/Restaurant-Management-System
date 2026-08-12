import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import path from 'path';
import 'dotenv/config';

// Configure Cloudinary using the environment variable (CLOUDINARY_URL)
cloudinary.config();

// Use memory storage since Vercel filesystem is read-only
const storage = multer.memoryStorage();

const fileFilter = (_req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|gif|avif/;
  if (allowed.test(path.extname(file.originalname).toLowerCase()) && allowed.test(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpg, png, webp, gif)'));
  }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

// POST /api/v1/upload
export const uploadImage = [
  upload.single('image'),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    try {
      // Upload stream to Cloudinary
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'tablecraft_uploads' },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            return res.status(500).json({ success: false, message: 'Cloudinary upload failed' });
          }
          res.json({ success: true, data: { imageUrl: result.secure_url, filename: result.public_id } });
        }
      );

      streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
    } catch (error) {
      console.error('Upload handler error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  },
];
