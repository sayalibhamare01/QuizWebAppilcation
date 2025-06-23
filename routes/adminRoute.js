const express = require("express");
const router = express.Router();
const {getDashboard,deleteUser,getAllQuizzes,deleteQuiz,AdminCreateQuiz,createQuiz} = require("../controllers/adminController");
const adminAuth = require("../middelware/adminAuth");
const verifyToken = require("../middelware/Authorization");

router.use(verifyToken,adminAuth);

router.get("/dashboard", getDashboard);
router.delete("/deleteUser/:userId", deleteUser);
router.get("/allQuizzes", getAllQuizzes);
router.delete("/deleteQuiz/:quizId", deleteQuiz);
router.get("/adminCreateQuizPage", AdminCreateQuiz);
router.post("/adminCreateQuiz", createQuiz);

module.exports = router;