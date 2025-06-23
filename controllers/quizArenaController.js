const asyncHandler = require("express-async-handler")
const Quiz = require("../models/QuizzModal")
const User = require("../models/userModel")

const quizzArena = asyncHandler(async (req, res) => {
    const { quizzTitle } = req.params;
    const isAuthenticated = !!req.user;
    
    try {
        // Find the quiz and increment plays count in one operation using findOneAndUpdate
        const quiz = await Quiz.findOneAndUpdate(
            { title: quizzTitle },
            { $inc: { plays: 1 } },
            { new: true }
        );

        if (!quiz) {
            return res.status(404).send("Quiz not found");
        }

        const quizData = quiz.quizData;

        res.render("QuizArena", {
            quizzTitle,
            quizData,
            quizId: quiz._id,
            quiz: quiz,
            isAuthenticated
        });
    } catch (error) {
        console.error("Error loading quiz:", error);
        res.status(500).send("Error loading quiz");
    }
});

const saveQuizResult = asyncHandler(async (req, res) => {
    const isAuthenticated = !!req.user || false;
    if (!isAuthenticated) {
        return res.status(401).json({ message: "User not authenticated" });
    }

    const { quizId, score, timeTaken } = req.body;
    const userId = req.user.id;

    try {
        // Find the user and the quiz
        const [user, quiz] = await Promise.all([
            User.findById(userId),
            Quiz.findById(quizId)
        ]);

        if (!user || !quiz) {
            return res.status(404).json({ message: "User or Quiz not found" });
        }

        // Add score to user's playedQuizzes
        const existingQuizIndex = user.playedQuizzes.findIndex(
            quiz => quiz.quizId.toString() === quizId
        );

        if (existingQuizIndex !== -1) {
            user.playedQuizzes[existingQuizIndex] = {
                quizId,
                score,
                timeTaken
            };
        } else {
            user.playedQuizzes.push({
                quizId,
                score,
                timeTaken
            });
        }

        // Add score to quiz's scores array without modifying the quiz's creator
        const scoreEntry = {
            userId: user._id,
            userName: user.name,
            score: score,
            timeTaken: timeTaken,
            date: new Date()
        };

        // Use $push to add the score without triggering full document validation
        await Quiz.findByIdAndUpdate(
            quizId,
            { $push: { scores: scoreEntry } },
            { runValidators: false }
        );

        // Save user updates
        await user.save();
        
        res.status(200).json({ message: "Quiz result saved successfully" });
    } catch (error) {
        console.error("Error saving quiz result:", error);
        res.status(500).json({ message: "Error saving quiz result" });
    }
});

module.exports = { quizzArena, saveQuizResult } 