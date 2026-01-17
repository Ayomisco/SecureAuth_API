const express = require('express');

const router = express.Router();
const authController = require('../controllers/authController');
const { identifier } = require('../middlewares/identification');

router.post('/register', authController.signup);
router.post('/login', authController.login);
router.post('/logout', identifier, authController.logout);

router.patch('/verify-email', authController.sendverificationCode);
router.patch('/accept-verification-code', authController.verifyVerificationCode);

router.patch('/change-password', identifier,  authController.changePassword);
module.exports = router;