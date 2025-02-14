const { Server } = require('socket.io');
const http = require('http');
const express = require("express");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "https://vibe-talk-two.vercel.app", // Allow frontend connection
        methods: ["GET", "POST"], // Allow WebSocket handshakes
        credentials: true // Allow authentication cookies
    },
});

const getReceiverSocketId = (userId) => {
    return userSocketMap[userId];
};
//used to store online users
const userSocketMap = {}; //{userId: socketId}

io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    const userId = socket.handshake.query.userId; //get userId from frontend that is authUser._id
    if(userId)  userSocketMap[userId] = socket.id;

    //io.emit() is used to send events to all the connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap)); //online

    socket.on("disconnect", () => {
        console.log("A user disconnected", socket.id);
        delete userSocketMap[userId]; //offline
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

module.exports = { io, app, server, getReceiverSocketId };
