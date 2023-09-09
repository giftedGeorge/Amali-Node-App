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

async function GetUserByPhoneNumber(phoneNumber){
    return await models.User.findOne({ PhoneNumber: phoneNumber });
}

module.exports = {
    CreateUser,
    GetUserByPhoneNumber,
};