const models = require('../models');
const logger = require('../logger');
const {authRepository, userRepository} = require('../repositories')
const {jwtUtil} = require('../utils');
const { Error } = require('mongoose');
const argon2 = require('argon2');
const tokenType = "Bearer";


async function CreateUser(req){
    try {
        const reqBody = req.body
        const phoneNumber = reqBody.phoneNumber;
    
        const decodedToken = jwtUtil.DecodeAccessToken(req);
        if (phoneNumber !== decodedToken.phoneNumber) {
            logger.error('Phone number mismatch. Token is invalid!');
            return false;
        }
    
        // Find the user document
        const user = await userRepository.GetUserByPhoneNumber(phoneNumber);
    
        if (!user) {
            logger.error('User not found');
            return false;
        }

        const userLogin = await authRepository.GetUserLoginByPhoneNumber(user.PhoneNumber);

        if(!userLogin || !userLogin.Pin){
            logger.error('User has not created a Pin!');
            return false;
        }

        const userSignUp = await authRepository.GetSignUpByPhoneNumber(phoneNumber);
        if(!userSignUp){
            logger.error('SignUp has not been created');
            return false;
        }

        user.FirstName = reqBody.firstname;
        user.LastName = reqBody.lastName;
        user.Email = reqBody.email;
        user.Bvn = reqBody.bvn;
        user.UserType = userSignUp.UserType;
        user.IsInterestAllowed = userSignUp.IsInterestAllowed;
        user.ModifiedAt = Date.now();
        await user.save();

        return true;

    } catch(err){
        logger.error('Error creating user:', err);
        throw err;
    }
}

async function Login(req){
    try {
        const reqPhoneNumber = req.body.phoneNumber;
        const reqPin = req.body.pin;

        const userLogin = await authRepository.GetUserLoginByPhoneNumber(reqPhoneNumber);
        
        if(!userLogin){
            throw new Error(`User With phone number ${reqPhoneNumber} does not exist!`);
        }

        const isPinMatch = await argon2.verify(userLogin.Pin, reqPin);
        if(!isPinMatch){
            throw new Error('Pin mismatch!');
        }

        const refreshTokenDoc = models.RefreshToken({
            Owner: userLogin.UserId
        });
    
        await refreshTokenDoc.save();
    
        const user = await userRepository.GetUserByPhoneNumber(reqPhoneNumber);
        if (!user) {
            throw new Error('User not found');
        }
    
        const refreshToken = jwtUtil.GenerateRefreshToken(userLogin._id, refreshTokenDoc._id);
    
        const payload = {id:userLogin.UserId, username: userLogin.PhoneNumber, firstName: user.FirstName, lastName: user.LastName}
        const accessToken = jwtUtil.GenerateAccessToken(payload, process.env.ACCESS_TOKEN_EXPIRATION_TIME);
    
        return{
            access_token: accessToken,
            token_type: tokenType,
            expiresIn: parseInt(process.env.ACCESS_TOKEN_EXPIRATION_TIME) * 60,
            refresh_token: refreshToken
        }
    
    } catch (err) {
        logger.error('Error Logging in:', err);
        throw err;
    }
}

module.exports = {
    CreateUser,
    Login,
}