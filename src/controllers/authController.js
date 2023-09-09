const logger = require('../logger');
const {authService}= require('../services');

async function SignUp(req, res) {
    try {
        if(!req){
            return res.status(400).json({error:'Parameter values cannot be empty!'});
        };
        
        result = await authService.SignUp(req);
        
        if(!result){
            return res.status(400).json({error:'An error ocurred while signing up. Please try again'});
        }
        return res.status(200).json(result);
        } catch (error) {
        logger.error(error);
        return res.status(500).json({error:'Unable to complete sign up at the moment. Please try again later'});
    }
};

module.exports = {
    SignUp,
}