const logger = require('../logger');
const {authService}= require('../services');
const {OtpValidationError} = require('../errors');

async function SignUp(req, res) {
    try {
        ValidateReqParameters(req, res);
        
        result = await authService.SignUp(req);
        
        if(!result || result === false){
            return res.status(400).json({error:'An error ocurred while signing up. Please check your values and try again'});
        }
        return res.status(200).json(result);
        } catch (error) {
        logger.error(error);
        return res.status(500).json({error:'Unable to complete sign up at the moment. Please try again later'});
    }
};

async function ValidateOtp(req, res) {
    try {
        ValidateReqParameters(req, res);

        result = await authService.ValidateOtp(req);
        
        if(!result || result === false){
            return res.status(400).json({error:'An error ocurred while validating OTP. Please check your values and try again'});
        }
        return res.status(200).json({msg: 'OTP validated successfully'});
        } catch (error) {
            if (error instanceof OtpValidationError) {
                return res.status(400).json({ message: 'An Error occurred while validating the OTP. Either the OTP is incorrect, or its validity period has expired. Please try again, or request for another OTP' });
              } else {
                return res.status(500).json({ message: 'Unable to complete request at the moment. Please try again later' });
              }
    }
};

async function CreatePin(req, res) {
    try {
        ValidateReqParameters(req, res);

        result = await authService.CreatePin(req);
        
        if(!result || result === false){
            return res.status(400).json({error:'An error ocurred while creating Pin. Please check your values and try again'});
        }
        return res.status(200).json({msg: 'Pin created successfully'});
        } catch (error) {
        logger.error(error);
        return res.status(500).json({error:'Unable to complete request at the moment. Please try again later'});
    }
};

function ValidateReqParameters(req, res){
    const requestBody = req.body;

    for (const key in requestBody) {
        if (requestBody.hasOwnProperty(key)) {
          const value = requestBody[key];
      
          if (value === undefined || value === null) {
            return res.status(400).json({ error: `${key} is missing or empty` });
          }
        }
      }
}

module.exports = {
    SignUp,
    ValidateOtp,
    CreatePin,
}