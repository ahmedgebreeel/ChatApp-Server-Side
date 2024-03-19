const router = require("express").Router();
const { sendMessage } = require("../controllers/messageController");
const { protect } = require("../middlewares/authMiddleware");

router.route("/").post(protect, sendMessage)
// router.route("/:chatId").get(protect, getMessages)

module.exports = router;
