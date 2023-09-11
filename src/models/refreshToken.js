const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const refreshTokenSchema = new Schema({
    Owner: {type: Schema.Types.ObjectId, ref: 'Users'},
    CreatedAt: {type: Date, default: Date.now}
});

const RefreshToken = model('RefreshTokens', refreshTokenSchema);

module.exports = RefreshToken;