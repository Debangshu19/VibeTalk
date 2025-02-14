const User = require('../models/user.model');
const bcryptjs = require('bcryptjs');
const {generateTokenAndSetCookie} = require("../lib/generateToken");
const cloudinary = require("../lib/cloudinary");

module.exports.signup = async (req, res) => {
    try{
        const {email, fullName, password} = req.body;
        if(!email || !fullName || !password){
            return res.status(400).json({success: false, message: "All fields are required"});
        }
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({success: false, message: "Please enter a valid email address"});
        }
        if(password.length < 6){
            return res.status(400).json({success: false, message: "Password must be at least 6 characters long"});
        }
        const existingUserByEmail = await User.findOne({email: email});
        if(existingUserByEmail){
            return res.status(400).json({success: false, message: "User with this email already exists"});
        }
        const existingUserByfullName = await User.findOne({fullName: fullName});
        if(existingUserByfullName){
            return res.status(400).json({ success: false, message: "User with this username already exists" });
        }
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const newUser = new User({
            email,
            fullName,
            password: hashedPassword
        });

        if(newUser){
            const token = generateTokenAndSetCookie(newUser._id, res);
            await newUser.save();
            res.status(201).json({
                success: true,
                token,
                user: {
                    ...newUser._doc,
                    password: "",
                },
            });
        }
    }catch(err){
        console.error("Error in signup controller: ", err);
        res.status(500).json({success: false, message: "Internal server error"});
    }
}
module.exports.login = async (req, res) => {  
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Please fill in all fields" });
        }

        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        const token = generateTokenAndSetCookie(user._id, res);
        res.status(200).json({
            success: true,
            token, // Send the token in the response
            user: {
                ...user._doc,
                password: "", // Exclude password
            },
        });
    } catch (err) {
        console.error("Error in login controller: ", err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}
module.exports.logout = async (req, res) => {
    try {
        res.clearCookie('jwt-vibetalk');
        res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (err) {
        console.error("Error in logout controller: ", err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}
module.exports.updateProfile = async (req,res) => {
    try{
        const {profilePic} = req.body;
        const userId = req.user._id;

        if(!profilePic){
            return res.status(400).json({message: "Profile pic is required" });
        }
        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(userId, {profilePic:uploadResponse.secure_url}, {new:true});
        res.status(200).json(updatedUser);
    }catch(err){
        console.log("error in update profile", err);
        res.status(500).json({message: "Internal server error"});
    }
}
module.exports.authCheck = async (req, res) => {
    try {
        res.status(200).json({ success: true, user: req.user });
    } catch (err) {
        console.error("Error in authCheck controller: ", err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};