const router = require("express").Router();
const { accessChat, getChats, createGroupChat, addToGroup } = require("../Controllers/chatController");
const { protect } = require("../Middleware/authMiddleware");

router.route("/").post(protect, accessChat).get(protect, getChats)
router.route("/group").post(protect, createGroupChat)
router.route("/groupadd/:id").patch(protect, addToGroup)



module.exports = router;
