const express = require('express')
const router = express.Router()
const {getloginPage,loginUser} = require("../controllers/loginPageController")

router.route("/").get(getloginPage).post(loginUser)

module.exports = router;