const mongoose = require('mongoose');
const { Schema, model } = mongoose;


const signUpSchema = new Schema({
    PhoneNumber: {type: String, length: 14, unique: true, required: [true, 'a phone number must be provided!'], trim: true},
    UserType: {type: Number, required: [true, 'type of user must be provided'], trim: true},
    IsInterestAllowed: {type: Boolean, default: true},
    IsPhoneNumberVerified: {type: Boolean, default: false},
    CreatedAt: {type: Date, default: Date.now},
    ModifiedAt: {type: Date, default: Date.now}
});

const SignUp = model('SignUps', signUpSchema);

module.exports = SignUp;