const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const uploadService = require('../services/uploadService');
const { verifyToken } = require('../middleware/auth');

router.post('/upload', 
  verifyToken,
  uploadService.getSingleUploadMiddleware('file'),
  uploadController.uploadSingleFile
);

module.exports = router;
