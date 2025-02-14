const jwt = require("jsonwebtoken");

module.exports.generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: '14d'});
    res.cookie('jwt-vibetalk', token, {
        maxAge: 14 * 24 * 60 * 60 * 1000,
        httpOnly: true, //prevent XSS attacks cross-site scripting attacks
        secure: process.env.NODE_ENV === 'production',  // Secure only in production
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',  // 'None' for cross-origin in production
    });
    return token;
};