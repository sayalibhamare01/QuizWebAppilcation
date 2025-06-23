const express = require('express')
const router = express.Router()
const { getUserQuizzes, deleteQuiz, getPlayedQuizzes } = require("../controllers/userQuizzesController")

router.route("/").get(getUserQuizzes)
router.route("/delete/:quizId").delete(deleteQuiz)
router.route("/playedQuizzes").get(getPlayedQuizzes)

module.exports = router
