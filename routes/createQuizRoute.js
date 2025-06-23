const express = require('express');
const router = express.Router();
const { getCreateQuizPage, createQuiz} = require('../controllers/createQuizController');

router.route("/").get(getCreateQuizPage)
router.route("/").post(createQuiz)

module.exports = router;