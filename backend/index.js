const express = require('express');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
dotenv.config();
const connectToDB = require('./lib/db');
const authRoutes = require('./routes/auth.route');
const messageRoutes = require('./routes/message.route');
const cors = require('cors');
const { app, server } = require('./lib/socket');

const PORT = process.env.PORT || 5001;


connectToDB();


const corsOptions = {
    origin: 'http://localhost:5173', // Allow frontend
    credentials: true, // Allow cookies and authentication headers
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight requests


app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
