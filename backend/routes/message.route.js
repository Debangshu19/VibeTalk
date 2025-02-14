const express = require("express");
const router = express.Router();
const messageController = require('../controllers/message.controller');
const middleware = require('../middleware/protectRoute');

router.get("/users", middleware.protectRoute, messageController.getUsersForSidebar);
router.get("/:id", middleware.protectRoute, messageController.getMessages);
router.post("/send/:id", middleware.protectRoute, messageController.sendMessages);

module.exports = router;