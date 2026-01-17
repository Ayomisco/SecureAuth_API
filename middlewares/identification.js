const jwt = require('jsonwebtoken');


exports.identifier = (req, res, next) => {
    let token;
    if (req.headers.client === 'not-browser') {
        token = req.headers.authorization

    }
    else {
        token = req.cookies['Authorization'];
    
    }
    if (!token) {
        return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    }
    
    try {
        const userToken = token.split(' ')[1];
        const jwtverified = jwt.verify(userToken, process.env.TOKEN_SECRET);
        if (jwtverified) {
            req.user = jwtverified;
            next();
        }
        else {
            throw new Error('Invalid token');
        }

    } catch (error) {
        return res.status(400).json({ success: false, message: 'Invalid token.' });
    }
};