const { sendMessage } = require("../controllers/messageController");
const { protect } = require("../middlewares/authMiddleware");

const router = require("express").Router();



router.route("/").post(protect, sendMessage)
// router.route("/:chatId").get(protect, getMessages)





module.exports = router;
