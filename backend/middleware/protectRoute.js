const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

module.exports.protectRoute = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1] || req.cookies['jwt-vibetalk'];
    console.log("Token received in protectRoute: ", token);

    if (!token) {
        return res.status(401).json({ success: false, message: "No token provided, access denied" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded JWT:", decoded);

        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        req.user = user;
        next(); 
    } catch (err) {
        console.error("Error in protectRoute:", err);
        res.status(401).json({ success: false, message: "Invalid token" });
    }
};