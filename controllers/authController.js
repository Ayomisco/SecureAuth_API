const doHash = require('../utils/hashing').doHash; 
const doHashValidation = require('../utils/hashing').doHashValidation;
const signupschema = require('../middlewares/validator').signupschema;
const jwt = require('jsonwebtoken');
const User = require('../models/usersModel');
const signinschema = require('../middlewares/validator').signinschema;
const transporter = require('../middlewares/sendMail');
const hmacProcess = require('../utils/hashing').hmacProcess;
const acceptVerificationCodeSchema = require('../middlewares/validator').acceptVerificationCodeSchema;

exports.signup = async (req, res) => {
    // Signup logic here
    const { username, email, password } = req.body;
    try {

        // Validate input data using the middileware schema
        const {error, value} = signupschema.validate({ username, email, password });
        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message });
        }

        const existingUser = await User.findOne({ $or: [ { email: value.email }, { username: value.username } ] });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User with given email or username already exists' });
        }

        // Hashing the password
        const hashedPassword = await doHash(value.password, 10);

        const newUser = new User({
            username: value.username,
            email: value.email,
            password: hashedPassword,
        });

        const result = await newUser.save();
        result.password = undefined; // Hide password in response

        res.status(201).json({ success: true, message: 'User created successfully', user: result });

    } catch (error) {
        console.error('Signup error:', error);
        return res.status(500).json({ success: false, message: error.details[0].message });
    }

    res.json({ success: true, message: 'User signed up successfully' });
}


exports.login = async (req, res) => {
    // Login logic here
    const { email, password } = req.body;

    try {
        const {error, value} = signinschema.validate({ email, password });
        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message });
        }

        const existingUser = await User.findOne({ email: value.email }).select('+password');
        if (!existingUser) {
            return res.status(400).json({ success: false, message: 'User does not exist' });
        }

        const result = await doHashValidation(value.password, existingUser.password);
        if (!result) {
            return res.status(400).json({ success: false, message: 'Invalid email or password' });
        }

        existingUser.password = undefined; // Hide password in response

        const token = jwt.sign({ id: existingUser._id, email: existingUser.email, username: existingUser.username

         }, process.env.TOKEN_SECRET);

         res.cookie('Authorization', 'Bearer ' + token, { expires: new Date(Date.now() + 3600000), httpOnly: process.env.NODE_ENV === 'production', secure: process.env.NODE_ENV === 'production' });
        res.status(200).json({ success: true, token, message: 'Login successful', user: existingUser });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ success: false, message: error.details[0].message });
    }

};


exports.logout = async (req, res) => {
    res.clearCookie('Authorization');
    res.status(200).json({ success: true, message: 'Logout successful' });
}


// OTP Verification

exports.sendverificationCode = async (req, res) => {

    const { email } = req.body;

    try {
        // Validate email and confirm if it exist
        const existingUser = await User.findOne({ email: email });
        if (!existingUser) {
            return res.status(400).json({ success: false, message: 'User does not exist' });
        }

        if (existingUser.verified) {
            return res.status(400).json({ success: false, message: 'User is already verified' });
        }
        
        // Generate verification code and its validation time
        const codeValue = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
        const codeValueValidation = Date.now() + 15 * 60 * 1000; // 15 minutes from now

        let info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: existingUser.email,
            subject: 'Your Verification Code',
            text: `Your verification code is: ${codeValue}. It is valid for 15 minutes.`
        });

        if(info.accepted[0] === existingUser.email) {
            
            const hashedCodeValue = hmacProcess(codeValue, process.env.HMAC_VERIFICATION_KEY);


            existingUser.verificationCode = hashedCodeValue;
            existingUser.verificationCodeValidation = codeValueValidation;
            await existingUser.save();
            return res.status(200).json({ success: true, message: 'Verification code sent successfully' });
        }
        return res.status(500).json({ success: false, message: 'Failed to send verification code' });

    } catch (error) {
        console.error('Send verification code error:', error);
        return res.status(500).json({ success: false, message: error.details[0].message });
    }


};

// OTP CODE VERIFICATION

exports.verifyVerificationCode = async (req, res) => {
    const { email, providedCode } = req.body;

    try {
        // Validate email and confirm if it exist
        const { error, value } = acceptVerificationCodeSchema.validate({ email, providedCode });
        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message });
        }

        const codeValue = providedCode.toString();

        const existingUser = await User.findOne({ email: value.email }).select('+verificationCode +verificationCodeValidation');

        if (!existingUser) {
            return res.status(400).json({ success: false, message: 'User does not exist' });
        }

        if (existingUser.verified) {
            return res.status(400).json({ success: false, message: 'User is already verified' });
        }

        if (Date.now() > existingUser.verificationCodeValidation) {
            return res.status(400).json({ success: false, message: 'Verification code has expired' });
        }

        if (Date.now() - existingUser.verificationCodeValidation > 15 * 60 * 1000) {
            return res.status(400).json({ success: false, message: 'Verification code has expired' });
        }

        if (!existingUser.verificationCode || !existingUser.verificationCodeValidation) {
            return res.status(400).json({ success: false, message: 'No verification code found. Please request a new one.' });
        }

        const hashedCodeValue = hmacProcess(codeValue, process.env.HMAC_VERIFICATION_KEY);

        if (hashedCodeValue !== existingUser.verificationCode) {
            return res.status(400).json({ success: false, message: 'Invalid verification code' });
        }
        
        existingUser.verified = true;
        existingUser.verificationCode = undefined;
        existingUser.verificationCodeValidation = undefined;
        await existingUser.save();

        return res.status(200).json({ success: true, message: 'User verified successfully' });
    }   
    catch (error) {
        console.error('Verification code error:', error);
        return res.status(500).json({ success: false, message: error.details[0].message });
    }
};


exports.changePassword = async (req, res) => {
    const {userId, verified} = req.user;
    const {oldPassword, newPassword} = req.body;

    try {
        const {error, value} = changepasswordschema.validate({ oldPassword, newPassword });
        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message });
        }

        if (!verified) {
            return res.status(400).json({ success: false, message: 'User is not verified' });
        }
        
        const existingUser = await User.findById(userId).select('+password');
        
        if (!existingUser) {
            return res.status(400).json({ success: false, message: 'User does not exist' });
        }

        const result = await doHashValidation(value.oldPassword, existingUser.password);
        if (!result) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        const hashedNewPassword = await doHash(value.newPassword, 10);

        existingUser.password = hashedNewPassword;
        await existingUser.save();

        return res.status(200).json({ success: true, message: 'Password changed successfully' });


    } catch (error) {
        console.error('Change password error:', error);
        return res.status(500).json({ success: false, message: error.details[0].message });
    }
};

