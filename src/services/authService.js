const argon2 = require('argon2');
const models = require('../models');
const logger = require('../logger');
const {authRepository, userRepository} = require('../repositories')
const {otpUtil, jwtUtil} = require('../utils');
const { Error } = require('mongoose');
const customErrors = require('../errors');
const tokenType = "Bearer";
  

async function SignUp (req){
    try {
        const signUpDoc = models.SignUp({
            PhoneNumber: req.body.phoneNumber,
            UserType: req.body.userType,
            IsInterestAllowed: req.body.isInterestAllowed
        });
        const existingUser = await userRepository.GetUserByPhoneNumber(req.body.phoneNumber);

        if(existingUser && existingUser.IsPhoneNumberVerified === true){
            throw new Error('User has already been verified');
        }

        const otp = otpUtil.GenerateOTP();

        await authRepository.CreateSignUp(signUpDoc);
        logger.info(`new signUp with phone number ${req.body.phoneNumber} was successfully created in Users collection`);
        
        const phoneNumString = String(req.body.phoneNumber);
        const sendOtpResult = await otpUtil.SendOTP(phoneNumString, otp);
        if(sendOtpResult !== true){
            logger.error('Failed to send OTP');
            return false;
        }
        logger.info(`OTP was successfully sent to ${req.body.phoneNumber}`);

        const createdSignUp = await authRepository.GetSignUpByPhoneNumber(req.body.phoneNumber);
        
        if(!createdSignUp){
            logger.error(`no SignUp was found with phone number: ${req.body.phoneNumber}`);
            return false
        }
        logger.info(`found one SignUp with phone number: ${createdSignUp.PhoneNumber}`);

        const otpDoc = models.Otp({
            PhoneNumber: req.body.phoneNumber,
            Code: await argon2.hash(otp),
        });
        await authRepository.CreateOTP(otpDoc);
        logger.info(`OTP was successfully created in Otps collection`);
        
        const payload = { userId: createdSignUp._id, phoneNumber: createdSignUp.PhoneNumber };
        const tempAccessToken = jwtUtil.GenerateAccessToken(payload, process.env.TEMP_ACCESS_TOKEN_EXPIRATION_TIME);
        
        return {
            token: tempAccessToken, 
            tokenType: tokenType, 
            expiresIn: parseInt(process.env.TEMP_ACCESS_TOKEN_EXPIRATION_TIME) * 60
        };
    } catch (error) {
        logger.error('An error occurred during the sign up process:', err);
        throw error;
    }
};

async function ValidateOtp(req){
    try {
        const phoneNumber = req.body.phoneNumber;
        const otpCode = req.body.otpCode;
    
        // Verify that the phone number in the JWT matches the request's phone number
        const decodedToken = jwtUtil.DecodeAccessToken(req);
        if (phoneNumber !== decodedToken.phoneNumber) {
          logger.error('Phone number mismatch. Token is invalid!');
          return false;
        }
    
        // Find the signup document
        const userSignUp = await authRepository.GetSignUpByPhoneNumber(phoneNumber);
    
        if (!userSignUp) {
            logger.error('SignUp not found');
            return false;
        }
    
        // Check if isPhoneNumberVerified is false
        if (userSignUp.isPhoneNumberVerified) {
            logger.error('Phone number already verified');
            return false;
        }
    
        // Find the OTP document matching the phone number
        const otpDoc = await authRepository.GetOtpByPhoneNumber(phoneNumber);
    
        if (!otpDoc) {
            logger.error('OTP not found');
            return false;
        }
    
        // Check if the hashed OTP code from the request matches the stored hash
        const isOtpMatch = await argon2.verify(otpDoc.Code, otpCode);
    
        if (!isOtpMatch) {
            throw new customErrors.OtpValidationError('Error! OTP code mismatch!');
        }
    
        // Check if the OTP code has expired
        const expirationTime = otpDoc.SentAt.getTime() + parseInt(process.env.OTP_EXPIRATION_TIME) * 60000;
        if (expirationTime < Date.now()) {
            throw new customErrors.OtpValidationError('OTP code expired');
        }
    
        // Update isPhoneNumberVerified to true in the user document
        userSignUp.IsPhoneNumberVerified = true;
        await userSignUp.save();
    
        // Return success response
        logger.info('Phone number verified successfully');
        return true
      } catch (err) {
        logger.error('Error validating OTP:', err);
        throw err;
      }
    };

async function CreatePin(req){
    try {
        const phoneNumber = req.body.phoneNumber;
        const pin = req.body.pin;
    
        // Verify that the phone number in the JWT matches the request's phone number
        const decodedToken = jwtUtil.DecodeAccessToken(req);
        if (phoneNumber !== decodedToken.phoneNumber) {
            logger.error('Phone number mismatch. Token is invalid!');
            return false;
        }
    
        // Find the signup document
        const userSignUp = await authRepository.GetSignUpByPhoneNumber(phoneNumber);
    
        if (!userSignUp) {
            logger.error('SignUp not found');
            return false;
        }
    
        // Check if isPhoneNumberVerified is true
        if (userSignUp.IsPhoneNumberVerified != true) {
            logger.error('Phone number already verified');
            return false
        }
    
        // Create User
        const newUserDoc = models.User({
            PhoneNumber: phoneNumber,
        });
    
        await userRepository.CreateUser(newUserDoc);
        const createdUser = await userRepository.GetUserByPhoneNumber(phoneNumber);
    
        if (!createdUser) {
            logger.error('User not found');
            return false;
        }
    
        // create UserLogin doc
        const newUserLoginDoc = models.UserLogin({
            UserId: createdUser._id,
            PhoneNumber: phoneNumber,
            Pin: await argon2.hash(pin)
        });
    
        await userRepository.CreateUserLogin(newUserLoginDoc);
    
        return true
    } catch (err) {
        logger.error('Error creating pin:', err);
        throw err;
    }
}

module.exports = {
    SignUp,
    ValidateOtp,
    CreatePin,
}