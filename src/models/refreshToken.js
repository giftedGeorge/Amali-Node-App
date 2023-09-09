const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const refreshTokenSchema = new Schema({
    owner: {type: Schema.Types.ObjectId, ref: 'Users'}
});

const RefreshToken = model('RefreshTokens', refreshTokenSchema);

module.exportd = RefreshToken;