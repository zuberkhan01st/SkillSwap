// File upload middleware
// Install multer package: npm install multer @types/multer
import { Request, Response, NextFunction } from 'express';

// Simple file upload middleware placeholder
export const uploadProfilePhoto = {
  single: (fieldName: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
      // For now, just proceed without file handling
      // When multer is installed, this will handle file uploads
      console.log(`File upload middleware for field: ${fieldName}`);
      next();
    };
  }
};

export default uploadProfilePhoto;
