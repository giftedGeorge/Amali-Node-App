const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

function tmp(req,res){};

router.post('/signup', authController.SignUp);
router.post('/create-pin', tmp);
router.post('/login', tmp);
router.post('/refrsh-token', tmp);

module.exports = router;