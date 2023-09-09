const mongoose = require('mongoose');
const { Schema, model } = mongoose;


const userSchema = new Schema({
    FirstName: {type: String, maxLength: [20, 'first name cannot exceed 20 characters!'], trim: true},
    LastName: {type: String, maxLength: [20, 'last name cannot exceed 20 characters!'], trim: true},
    PhoneNumber: {type: String, length: 14, unique: true, required: [true, 'a phone number must be provided!'], trim: true},
    Email: {type: String, unique: true, trim: true},
    Bvn: {type: Number, length: [11, 'BVN must be 11 numbers!'], unique: true, trim: true},
    UserType: {type: Number},
    IsInterestAllowed: {type: Boolean, default: true},
    CreatedAt: {type: Date, default: Date.now},
    ModifiedAt: {type: Date, default: Date.now}
});

const User = model('Users', userSchema);

module.exports = User;