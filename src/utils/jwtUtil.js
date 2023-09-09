const jwt = require('jsonwebtoken');


function GenerateAccessToken(payload){
    const secretKey = process.env.ACCESS_TOKEN_SECRET_KEY;
    const expirationTimeInMinutes = process.env.ACCESS_TOKEN_EXPIRATION_TIME;

    const options = {
      expiresIn: `${expirationTimeInMinutes}m`,
    };
  
    return jwt.sign(payload, secretKey, options);
}

function GenerateRefreshToken(userId, refreshTokenId){
    const expirationTimeInMinutes = process.env.REFRESH_TOKEN_EXPIRATION_TIME;

    return jwt.sign({
        userId: userId,
        tokenId: refreshTokenId
    }, process.env.REFRESH_TOKEN_SECRET_KEY, {expiresIn: `${expirationTimeInMinutes}d`});
}

module.exports = {
    GenerateAccessToken,
    GenerateRefreshToken
}