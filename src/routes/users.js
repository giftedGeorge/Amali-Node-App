const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const middleware = require('../middleware');


/**
 * @swagger
 * /api/auth/create-user:
 *   put:
 *     summary: Create a new user
 *     description: Use provided information to create the new user.
 *     tags:
 *       - Authentication
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: Bearer token for JWT authorization
 *       - in: body
 *         name: userDetails
 *         description: object that contains information to be used in validating the OTP.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             phoneNumber:
 *               type: string
 *               description: Phone number of the user.
 *             firstName:
 *               type: string
 *               description: First name of the user.
 *             lastName:
 *               type: string
 *               description: Last name of the user.
 *             email:
 *               type: string
 *               description: Email address of the user.
 *             bvn:
 *               type: string
 *               description: Bank verification number of the user.
 *     responses:
 *       201:
 *         description: Created 
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized 
 *       500:
 *         description: Internal Server error
 */
router.put('/create-user', middleware.ValidateAccessToken, userController.CreateUser);


/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User Login
 *     description: Uses provided information to log users in and grant them access to our services. Provdes access and refresh tokens to access authorized resources during the session.
 *     tags:
 *       - Authentication
 *     parameters:
 *       - in: body
 *         name: loginDetails
 *         description: object that contains the user's username and pin.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             phoneNumber:
 *               type: string
 *               description: Phone number of the user.
 *             pin:
 *               type: string
 *               description: The user's pin.
 *     responses:
 *       200:
 *         description: Successful response
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server error
 */
router.post('/login', userController.Login);

module.exports = router;