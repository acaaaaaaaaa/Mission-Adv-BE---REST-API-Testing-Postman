const uploadService = require('../services/uploadService');

class UploadController {
  async uploadSingleFile(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          status: false,
          message: 'No file uploaded'
        });
      }

      const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
      const fileInfo = uploadService.processUploadedFile(req.file, baseUrl);

      res.status(200).json({
        status: true,
        message: 'File uploaded successfully',
        data: fileInfo
      });
    } catch (error) {
      console.error('Error in uploadSingleFile:', error);
      res.status(500).json({
        status: false,
        message: 'File upload failed',
        error: error.message
      });
    }
  }
}

module.exports = new UploadController();
