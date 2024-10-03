import multer from 'multer';

// Configure multer to use memory storage
const storage = multer.memoryStorage();

// Middleware for handling single file upload
export const singleUpload = multer({ storage }).single('file');

// Middleware for handling multiple file uploads
export const uploadFields = multer({ storage }).fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'profileCoverPhoto', maxCount: 1 },
    { name: 'resume', maxCount: 1 }
  ]);