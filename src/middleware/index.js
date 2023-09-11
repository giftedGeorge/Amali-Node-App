const jwt = require('jsonwebtoken');
const logger = require('../logger');

function ValidateAccessToken(req, res, next) {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];
  
    if (!token) {
        res.status(400).send('Error! Token is missing from the request!');
    }
  
    try {
        const decodedToken =  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
        req.userId = decodedToken.userId;
        next();
    } catch (error) {
        logger.error(error);
        res.status(401).send('Error! Invalid access token!');
    }
  };

  module.exports = {
    ValidateAccessToken,
  }