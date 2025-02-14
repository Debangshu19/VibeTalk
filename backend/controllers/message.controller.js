const Message = require("../models/message.model");
const User = require("../models/user.model");
const cloudinary = require("../lib/cloudinary.js");
const { getReceiverSocketId, io } = require('../lib/socket.js');

module.exports.getUsersForSidebar = async (req,res) => {
    try{
        const loggedInUser = req.user._id;
        const filteredUsers = await User.find({_id: {$ne: loggedInUser}}).select("-password");
        res.status(200).json(filteredUsers);
    }catch(err){
        console.error("Error in getUsersForSidebar: ", err.message);
        res.status(500).json({error: "Internal Server Error"});
    }
};
module.exports.getMessages = async (req,res) => { //only to see the chats
    try{
        const {id:userToChatId} = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                {senderId: myId, recieverId: userToChatId},
                {senderId: userToChatId, recieverId: myId},
            ],
        });
        res.status(200).json(messages);
    }catch(err){
        console.error("Error in getMessages: ", err.message);
        res.status(500).json({error: "Internal Server Error"});
    }
};
module.exports.sendMessages = async (req,res) => { //actually sending messages
    try{
        const {text, image} = req.body;
        const {id: recieverId} = req.params;
        const senderId = req.user._id;

        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            recieverId,
            text,
            image: imageUrl,
        });
        await newMessage.save();

        const receiverSocketId = getReceiverSocketId(recieverId); //realtime message sharing
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage); //specifically to(socketId) is used for private chat
        }
        res.status(201).json(newMessage);
    }catch(err){
        console.error("Error in sendMessages: ", err.message);
        res.status(500).json({error: "Internal Server Error"});
    }
}