const logger = require('../logger');
const {userService}= require('../services');


async function CreateUser(req, res) {
    try {        
        result = await userService.CreateUser(req);
        
        if(!result || result === false){
            return res.status(400).json({error:'An error ocurred while creating user. Please try again'});
        }
        return res.status(201);
        } catch (error) {
        logger.error(error);
        return res.status(500).json({error:'Unable to complete sign up at the moment. Please try again later'});
    }
};

async function Login(req, res) {
    try {        
        result = await userService.Login(req);
        
        if(!result || result === false){
            return res.status(400).json({error:'An error ocurred while logging in. Please try again'});
        }
        return res.status(200).json(result);
        } catch (error) {
        logger.error(error);
        return res.status(500).json({error:'Unable to complete login at the moment. Please try again later'});
    }
};

module.exports = {
    CreateUser,
    Login,
}