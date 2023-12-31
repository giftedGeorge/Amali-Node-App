const models = require('../models');
const logger = require('../logger');


async function CreateUser(userDetails){
    try {
        await models.User.create(userDetails);
    } catch (error) {
        logger.error(`Something went wrong while creating user: ${error}`);
        throw error;
    }
}

async function CreateUserLogin(userLoginDetails){
    try {
        await models.UserLogin.create(userLoginDetails);
    } catch (error) {
        logger.error(`Something went wrong while creating a userLogin: ${error}`);
        throw error;
    }
}

async function GetUserByPhoneNumber(phoneNumber){
    return await models.User.findOne({ PhoneNumber: phoneNumber });
}

module.exports = {
    CreateUser,
    GetUserByPhoneNumber,
    CreateUserLogin,
};