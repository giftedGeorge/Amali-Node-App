const mongoose = require('mongoose');
const { Schema, model } = mongoose;


const userLoginSchema = new Schema({
    Pin: {type: String, required: [true, 'a pin must be provided!'], trim: true},
    CreatedAt: {type: Date, default: Date.now},
    ModifiedAt: {type: Date, default: Date.now}
});

const UserLogin = model('UserLogins', userLoginSchema);

module.exports = UserLogin;