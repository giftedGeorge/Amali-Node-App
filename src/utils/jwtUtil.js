const jwt = require('jsonwebtoken');


function GenerateAccessToken(payload, expiresIn){
    const secretKey = process.env.ACCESS_TOKEN_SECRET_KEY;
    const expirationTimeInMinutes = expiresIn;

    const options = {
      expiresIn: `${expirationTimeInMinutes}m`,
    };
  
    return jwt.sign(payload, secretKey, options);
}

function GenerateRefreshToken(userId, refreshTokenDocId){
    const expirationTimeInMinutes = process.env.REFRESH_TOKEN_EXPIRATION_TIME;

    return jwt.sign({
        userId: userId,
        tokenId: refreshTokenDocId
    }, process.env.REFRESH_TOKEN_SECRET_KEY, {expiresIn: `${expirationTimeInMinutes}d`});
}

function DecodeAccessToken(req) {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];
  
    if (!token) {
        throw new Error('Error! Token is missing from the request!');
    }
  
    const decodedToken =  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
    return decodedToken;
  };


module.exports = {
    GenerateAccessToken,
    GenerateRefreshToken,
    DecodeAccessToken,
}