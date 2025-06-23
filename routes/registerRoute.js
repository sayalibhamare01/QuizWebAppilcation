const express = require('express')
const router = express.Router()
const {registerUser,SignupPage} = require("../controllers/signupController")

router.route("/").post(registerUser).get(SignupPage)

module.exports = router;