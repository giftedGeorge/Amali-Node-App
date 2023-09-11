const express = require('express');
const router = express.Router();
require('swagger-jsdoc');
const authController = require('../controllers/authController');
const middleware = require('../middleware');


/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Get a One time password from the API
 *     description: Use provided information to begin sign-up process. Send a one time password to provided phone number and provdes a temporary access token to access the subsequent resources to complete the sign-up process.
 *     tags:
 *       - Authentication
 *     parameters:
 *       - in: body
 *         name: signUpDetails
 *         description: User object that needs to be added
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             phoneNumber:
 *               type: string
 *               description: Phone number of the user.
 *             userType:
 *               type: number
 *               description: The selected type of the user. Enter 1 for "individual", 2 for "agent"
 *             isInterestAllowed:
 *               type: boolean
 *               description: true or false based on user selection.
 *     responses:
 *       200:
 *         description: Successful response
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server error
 */
router.post('/signup', authController.SignUp);


/**
 * @swagger
 * /api/auth/validate-otp:
 *   post:
 *     summary: Validate OTP
 *     description: Use provided information to validate the otp sent to the user.
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
 *         name: otpValidationDetails
 *         description: OTP validation object that contains information to be used in validating the OTP.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             phoneNumber:
 *               type: string
 *               description: Phone number of the user.
 *             otpCode:
 *               type: string
 *               description: The 6-digit one time password sent to the user.
 *     responses:
 *       200:
 *         description: Successful response
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized 
 *       500:
 *         description: Internal Server error
 */
router.post('/validate-otp', middleware.ValidateAccessToken, authController.ValidateOtp);


/**
 * @swagger
 * /api/auth/create-pin:
 *   post:
 *     summary: Create a pin.
 *     description: Use provided information to create a pin which will be used for logging in and authentication.
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
 *         name: otpValidationDetails
 *         description: OTP validation object that contains information to be used in validating the OTP.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             phoneNumber:
 *               type: string
 *               description: Phone number of the user.
 *             pin:
 *               type: string
 *               description: The 6-digit pin entered by the user.
 *     responses:
 *       200:
 *         description: Successful response
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized 
 *       500:
 *         description: Internal Server error
 */
router.post('/create-pin', middleware.ValidateAccessToken, authController.CreatePin);

module.exports = router;