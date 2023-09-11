const mongoose = require('mongoose');
const { Schema, model } = mongoose;


const userLoginSchema = new Schema({
    UserId: {type: Schema.Types.ObjectId, ref: 'Users'},
    PhoneNumber: {type: String, length: 14, unique: true, required: [true, 'a phone number must be provided!']},
    Pin: {type: String, required: [true, 'a pin must be provided!'], trim: true},
    CreatedAt: {type: Date, default: Date.now},
    ModifiedAt: {type: Date, default: Date.now}
});

const UserLogin = model('UserLogins', userLoginSchema);

module.exports = UserLogin;