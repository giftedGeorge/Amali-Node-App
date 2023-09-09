const argon2 = require('argon2');
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
        
        const payload = { id: createdSignUp._id, phoneNumber: createdSignUp.PhoneNumber };
        const tempAccessToken = jwtUtil.GenerateAccessToken(payload);
        
        return {
            token: tempAccessToken, 
            tokenType: tokenType, 
            expiresIn: parseInt(process.env.TEMP_ACCESS_TOKEN_EXPIRATION_TIME) * 60
        };
    } catch (error) {
        throw error;
    }
};


// async function CreatePin(req){
//     const token = req.
// }


module.exports = {
    SignUp,
}