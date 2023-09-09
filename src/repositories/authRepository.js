const models = require('../models');
const logger = require('../logger');


async function CreateSignUp(signUpDetails){
    try {
        await models.SignUp.create(signUpDetails);
    } catch (error) {
        logger.error(`Something went wrong while creating Sign Up: ${error}`);
        throw error;
    }
}

async function GetSignUpByPhoneNumber(phoneNumber){
    return await models.SignUp.findOne({ PhoneNumber: phoneNumber });
}

async function CreateOTP(otpDetails){
    try {
        await models.Otp.create(otpDetails);
    } catch (error) {
        logger.error(`Something went wrong while creating OTP: ${error}`);
        throw error;
    }
}

async function GetOtpByPhoneNumber(phoneNumber){
    return await models.Otp.findOne({ PhoneNumber: phoneNumber });
}


module.exports = {
    CreateSignUp,
    GetSignUpByPhoneNumber,
    CreateOTP,
    GetOtpByPhoneNumber
};