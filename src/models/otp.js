const mongoose = require('mongoose');
const { Schema, model } = mongoose;


const otpSchema = new Schema({
    PhoneNumber: {type: String, length: 14, unique: true, required: [true, 'a phone number must be provided!'], trim: true},
    Code: {type: String, required: true, trim: true},
    SentAt: {type: Date, Default: Date.Now},
});

const Otp = model('Otps', otpSchema);

module.exports = Otp;