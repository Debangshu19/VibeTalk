const mongoose = require('mongoose');
function connectToDB() {
    const MONGO_URI = process.env.MONGO_URI;
    mongoose.connect(MONGO_URI).then(() => {
        console.log("Connected to the database");
    }).catch((error) => {  
        console.log("Error connecting to the database: ", error);
    });
}
module.exports = connectToDB;