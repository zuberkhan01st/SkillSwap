// File upload middleware placeholder
// Note: Install multer and @types/multer packages to enable file uploads
// npm install multer @types/multer

import { Request, Response, NextFunction } from 'express';

export const uploadProfilePhoto = {
  single: (fieldName: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
      // Placeholder middleware - implement with multer when package is installed
      console.log('File upload middleware called - install multer package');
      next();
    };
  }
};

export default uploadProfilePhoto;
