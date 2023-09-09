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

async function ValidateOtp(req, res) {
    try {
        if(!req){
            return res.status(400).json({error:'Parameter values cannot be empty!'});
        };
        
        result = await authService.ValidateOtp(req);
        
        if(!result){
            return res.status(400).json({error:'An error ocurred while validating OTP. Please try again'});
        }
        return res.status(200).json({msg: 'OTP validated successfully'});
        } catch (error) {
        logger.error(error);
        return res.status(500).json({error:'Unable to complete request at the moment. Please try again later'});
    }
};

async function CreatePin(req, res) {
    try {
        if(!req){
            return res.status(400).json({error:'Parameter values cannot be empty!'});
        };
        
        result = await authService.CreatePin(req);
        
        if(!result){
            return res.status(400).json({error:'An error ocurred while creating Pin. Please try again'});
        }
        return res.status(200).json({msg: 'Pin created successfully'});
        } catch (error) {
        logger.error(error);
        return res.status(500).json({error:'Unable to complete request at the moment. Please try again later'});
    }
};


module.exports = {
    SignUp,
    ValidateOtp,
    CreatePin,
}