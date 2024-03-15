const router = require("express").Router();
const { singup, login, getusers, getUserByID } = require("../Controllers/userController")

router.route("/signup").post(singup)
router.route("/login").post(login)
router.route("/").get(getusers)
router.route("/:id").get(getUserByID)






module.exports = router;
