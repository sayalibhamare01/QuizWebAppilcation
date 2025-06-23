const asyncHandler = require("express-async-handler");
const Quiz = require("../models/QuizzModal");

const getUserQuizzes = asyncHandler(async (req, res) => {
    const user = req.user;
    const quizzes = await Quiz.find({ creator: user.name });

    res.render('userQuizzes', {
        quizzes,
        isAuthenticated: true,
        user
    });
});

const deleteQuiz = asyncHandler(async (req, res) => {
    const quizId = req.params.quizId;
    const user = req.user;

    try {
        // Find the quiz
        const quiz = await Quiz.findById(quizId);

        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: "Quiz not found"
            });
        }

        // Check if the logged-in user is the creator of the quiz
        if (quiz.creator !== user.name) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this quiz"
            });
        }

        // Delete the quiz
        await Quiz.findByIdAndDelete(quizId);

        res.json({
            success: true,
            message: "Quiz deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting quiz:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Error deleting quiz"
        });
    }
});

const getPlayedQuizzes = asyncHandler(async (req, res) => {
    const user = req.user;
    try {
        // Check if user has playedQuizzes array
        if (!user || !user.playedQuizzes || user.playedQuizzes.length === 0) {
            return res.render('playedQuizzes', { 
                quizzes: [],
                isAuthenticated: true, 
                user 
            });
        }

        // Get the IDs of all played quizzes from user data
        const playedQuizIds = user.playedQuizzes.map(quiz => quiz.quizId);

        // Fetch the full quiz details for each played quiz
        const quizzes = await Quiz.find({
            '_id': { $in: playedQuizIds }
        });

        // Combine quiz details with user's play data
        const playedQuizzes = quizzes.map(quiz => {
            const playData = user.playedQuizzes.find(
                played => played.quizId.toString() === quiz._id.toString()
            );
            return {
                title: quiz.title,
                numQuestions: quiz.numQuestions,
                score: playData.score,
                timeTaken: playData.timeTaken,
                date: playData.playedAt
            };
        });

        // Sort by most recent first
        playedQuizzes.sort((a, b) => new Date(b.date) - new Date(a.date));

        res.render('playedQuizzes', { 
            quizzes: playedQuizzes,
            isAuthenticated: true, 
            user 
        });
    } catch (error) {
        console.error("Error fetching played quizzes:", error);
        res.status(500).send("Error fetching played quizzes");
    }
});

module.exports = { getUserQuizzes, deleteQuiz, getPlayedQuizzes };