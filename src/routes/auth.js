const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const middleware = require('../middleware');


function tmp(req,res){};

router.post('/signup', authController.SignUp);
router.post('/validate-otp', middleware.ValidateAccessToken, authController.ValidateOtp);
router.post('/create-pin', middleware.ValidateAccessToken, authController.CreatePin);
router.post('/login', tmp);

module.exports = router;