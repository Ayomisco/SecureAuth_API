const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        // lowercase: true,
        minLength: [3, 'Username must be at least 3 characters long'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: [true, 'Email must be unique'],
        lowercase: true,
        trim: true,
        minLength: [5, 'Email must be at least 5 characters long'],
    },
    password: {
        type: String,
        required: [true, 'Password must be provided'],
        minLength: [8, 'Password must be at least 8 characters long'],
        select: false,
    },
    verified: {
        type: Boolean,
        default: false,
    },

    verificationCode: {
        type: String,
        select: false,
    },

    verificationCodeValidation: {
        type: Number,
        select: false,
    },

    forgotPasswordCode: {
        type: String,
        select: false,
    },

    forgotPasswordCodeValidation: {
        type: Number,
        select: false,
    },

  
}, {
    timestamps: true,
}

);

module.exports = mongoose.model('User', userSchema);    