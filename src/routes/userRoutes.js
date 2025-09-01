const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateRegister, validateLogin } = require('../middleware/validation');
const { verifyToken } = require('../middleware/auth');


router.post('/register', validateRegister, userController.register);
router.post('/login', validateLogin, userController.login);
router.get('/verify-email', userController.verifyEmail);
router.post('/resend-verification', userController.resendVerification);
router.post('/logout', verifyToken, userController.logout);
router.get('/profile', verifyToken, userController.profile);

module.exports = router;
