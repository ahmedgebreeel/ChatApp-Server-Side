const router = require("express").Router();
const { singup, login, getusers, getUserByID } = require("../controllers/userController")
const { protect } = require("../middlewares/authMiddleware");

router.route("/signup").post(singup)
router.route("/login").post(login)
router.route("/").get(protect, getusers)
router.route("/:id").get(protect, getUserByID)

module.exports = router;
