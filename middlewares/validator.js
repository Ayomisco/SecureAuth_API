const joi = require('joi');

exports.signupschema = joi.object({
    email: joi.string().min(3).required().email({ tlds: { allow: ['com', 'net', 'org'] } }),
    username: joi.string().min(5).required(),
    password: joi.string().min(8).required().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')),

});

exports.signinschema = joi.object({
    email: joi.string().min(3).required().email({ tlds: { allow: ['com', 'net', 'org'] } }),
    // username: joi.string().min(5).required(),
    password: joi.string().min(8).required().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')),
    
});

exports.acceptVerificationCodeSchema = joi.object({
    email: joi.string().min(3).required().email({ tlds: { allow: ['com', 'net', 'org'] } }),
    providedCode: joi.number().required(),
});


exports.changePasswordSchema = joi.object({
    oldPassword: joi.string().min(3).required().email({ tlds: { allow: ['com', 'net', 'org'] } }),
    newPassword: joi.string().min(8).required().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')),
});

exports.createPostSchema = joi.object({
    title: joi.string().min(3).required(),
    description: joi.string().min(10).required(),
    userId: joi.string().hex().length(24).required(),
});