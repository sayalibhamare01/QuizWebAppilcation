const express = require('express')
const router = express.Router()
const {quizzArena, saveQuizResult} = require("../controllers/quizArenaController")

// Route for displaying quiz arena
router.get("/:quizzTitle/arena", quizzArena)

// Route for saving quiz results - removed /quiz prefix since we're already under /quizzes
router.post("/save-result", saveQuizResult)


module.exports = router;