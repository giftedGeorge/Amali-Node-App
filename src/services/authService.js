const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const models = require('../models');
const logger = require('../logger');
const {authRepository, userRepository} = require('../repositories')
const {otpUtil, jwtUtil} = require('../utils');
const { Error } = require('mongoose');
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
            throw new Error('Failed to send OTP');
        }
        logger.info(`OTP was successfully sent to ${req.body.phoneNumber}`);

        const createdSignUp = await authRepository.GetSignUpByPhoneNumber(req.body.phoneNumber);
        
        if(!createdSignUp){
            throw new Error(`no SignUp was found with phone number: ${req.body.phoneNumber}`)
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
          throw new Error('Phone number mismatch. Token is invalid!');
        }
    
        // Find the signup document
        const userSignUp = await authRepository.GetSignUpByPhoneNumber(phoneNumber);
    
        if (!userSignUp) {
            throw new Error('User not found');
        }
    
        // Check if isPhoneNumberVerified is false
        if (userSignUp.isPhoneNumberVerified) {
            throw new Error('Phone number already verified');
        }
    
        // Find the OTP document matching the phone number
        const otpDoc = await authRepository.GetOtpByPhoneNumber(phoneNumber);
    
        if (!otpDoc) {
            throw new Error('OTP not found');
        }
    
        // Check if the hashed OTP code from the request matches the stored hash
        const isOtpMatch = await argon2.verify(otpDoc.Code, otpCode);
    
        if (!isOtpMatch) {
            throw new Error('Error! OTP code mismatch!');
        }
    
        // Check if the OTP code has expired
        const expirationTime = otpDoc.SentAt.getTime() + parseInt(process.env.OTP_EXPIRATION_TIME) * 60000;
        if (expirationTime < Date.now()) {
            throw new Error('OTP code expired');
        }
    
        // Update isPhoneNumberVerified to true in the user document
        userSignUp.IsPhoneNumberVerified = true;
        await userSignUp.save();
    
        // Return success response
        logger.info('Phone number verified successfully');
        return true
      } catch (error) {
        logger.error('Error validating OTP:', error);
        throw error;
      }
    };

async function CreatePin(req, res){
    try {
        const phoneNumber = req.body.phoneNumber;
        const pin = req.body.pin;
    
        // Verify that the phone number in the JWT matches the request's phone number
        const decodedToken = jwtUtil.DecodeAccessToken(req);
        if (phoneNumber !== decodedToken.phoneNumber) {
            throw new Error('Phone number mismatch. Token is invalid!');
        }
    
        // Find the signup document
        const userSignUp = await authRepository.GetSignUpByPhoneNumber(phoneNumber);
    
        if (!userSignUp) {
            throw new Error('User not found');
        }
    
        // Check if isPhoneNumberVerified is true
        if (userSignUp.IsPhoneNumberVerified != true) {
            throw new Error('Phone number already verified');
        }
    
        // Create User
        const newUserDoc = models.User({
            PhoneNumber: phoneNumber,
        });
    
        await userRepository.CreateUser(newUserDoc);
        const createdUser = await userRepository.GetUserByPhoneNumber(phoneNumber);
    
        if (!createdUser) {
            throw new Error('User not found');
        }
    
        // create UserLogin doc
        const newUserLoginDoc = models.UserLogin({
            UserId: createdUser._id,
            Pin: await argon2.hash(pin)
        });
    
        await userRepository.CreateUserLogin(newUserLoginDoc);
    
        return true
    } catch (err) {
        logger.error('Error creating pin:', error);
        throw error;
    }
}

module.exports = {
    SignUp,
    ValidateOtp,
    CreatePin,
}