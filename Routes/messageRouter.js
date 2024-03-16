const { sendMessage, getMessages } = require("../Controllers/messageController");
const { protect } = require("../Middleware/authMiddleware");

const router = require("express").Router();



router.route("/").post(protect, sendMessage)
router.route("/:chatId").get(protect, getMessages)





module.exports = router;
