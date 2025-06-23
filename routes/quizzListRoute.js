const express = require('express')
const router = express.Router()
const {getQuizzList, toggleQuizLike} = require("../controllers/QuizzListController")

router.route("/").get(getQuizzList)
router.post("/:quizId/toggle-like", toggleQuizLike)

module.exports = router;