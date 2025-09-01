const multer = require('multer');
const path = require('path');
const fs = require('fs');

class UploadService {
  constructor() {

    this.uploadsDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir, { recursive: true });
    }


    this.storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, this.uploadsDir);
      },
      filename: (req, file, cb) => {

        const timestamp = Date.now();
        const originalName = file.originalname.replace(/\s+/g, '-');
        const filename = `${timestamp}-${originalName}`;
        cb(null, filename);
      }
    });


    this.fileFilter = (req, file, cb) => {

      const allowedTypes = {
        'image/jpeg': '.jpg',
        'image/jpg': '.jpg', 
        'image/png': '.png',
        'image/gif': '.gif',
        'image/webp': '.webp',
        'application/pdf': '.pdf',
        'text/plain': '.txt',
        'application/msword': '.doc',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx'
      };

      if (allowedTypes[file.mimetype]) {
        cb(null, true);
      } else {
        cb(new Error(`File type ${file.mimetype} not allowed. Allowed types: ${Object.values(allowedTypes).join(', ')}`), false);
      }
    };


    this.upload = multer({
      storage: this.storage,
      fileFilter: this.fileFilter,
      limits: {
        fileSize: 5 * 1024 * 1024,
        files: 1
      }
    });
  }


  getSingleUploadMiddleware(fieldName = 'file') {
    return this.upload.single(fieldName);
  }


  getMultipleUploadMiddleware(fieldName = 'files', maxCount = 5) {
    return this.upload.array(fieldName, maxCount);
  }


  processUploadedFile(file, baseUrl = 'http://localhost:3000') {
    if (!file) {
      throw new Error('No file uploaded');
    }

    const fileInfo = {
      originalName: file.originalname,
      filename: file.filename,
      mimetype: file.mimetype,
      size: file.size,
      path: file.path,
      url: `${baseUrl}/uploads/${file.filename}`,
      uploadedAt: new Date()
    };

    console.log('File uploaded successfully:', fileInfo.filename);
    return fileInfo;
  }


  processUploadedFiles(files, baseUrl = 'http://localhost:3000') {
    if (!files || files.length === 0) {
      throw new Error('No files uploaded');
    }

    return files.map(file => this.processUploadedFile(file, baseUrl));
  }


  deleteFile(filename) {
    try {
      const filePath = path.join(this.uploadsDir, filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log('File deleted successfully:', filename);
        return true;
      } else {
        console.log('File not found:', filename);
        return false;
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }


  getFileInfo(filename) {
    try {
      const filePath = path.join(this.uploadsDir, filename);
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        return {
          filename,
          size: stats.size,
          createdAt: stats.birthtime,
          modifiedAt: stats.mtime,
          path: filePath,
          url: `${process.env.BASE_URL || 'http://localhost:3000'}/uploads/${filename}`
        };
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting file info:', error);
      throw new Error(`Failed to get file info: ${error.message}`);
    }
  }


  listFiles() {
    try {
      const files = fs.readdirSync(this.uploadsDir);
      return files.map(filename => this.getFileInfo(filename)).filter(Boolean);
    } catch (error) {
      console.error('Error listing files:', error);
      throw new Error(`Failed to list files: ${error.message}`);
    }
  }


  getAllowedTypes() {
    return {
      images: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
      documents: ['.pdf', '.txt', '.doc', '.docx'],
      maxSize: '5MB',
      maxFiles: 1
    };
  }
}

module.exports = new UploadService();
