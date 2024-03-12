const router = require("express").Router();
const { singup, login } = require("../Controllers/userController")

router.route("/signup").post(singup)

router.route("/login").post(login)




module.exports = router;
