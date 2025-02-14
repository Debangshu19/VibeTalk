const express = require('express');
const router = express.Router();
const userController = require('../controllers/auth.controller');
const middleware = require("../middleware/protectRoute");

router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.post("/logout", userController.logout);

router.put("/update-profile", middleware.protectRoute, userController.updateProfile);
router.get("/check", middleware.protectRoute, userController.authCheck);
module.exports = router;