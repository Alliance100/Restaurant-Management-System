import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config({ path: '.env' });
cloudinary.config();

cloudinary.uploader.upload('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', { folder: 'test' })
  .then(result => {
    console.log('Upload successful:', result.secure_url);
  })
  .catch(error => {
    console.error('Upload failed:', error);
  });
