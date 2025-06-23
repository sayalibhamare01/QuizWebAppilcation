const asyncHandler = require("express-async-handler");
const Quiz = require("../models/QuizzModal");
const User = require("../models/userModel");

const getQuizzList = asyncHandler(async (req, res) => {
  const isAuthenticated = !!req.user;
  const user = req.user;
  // Get quizzes from the database
  const quizzes = await Quiz.find().lean();

  // If user is authenticated, check liked status for each quiz
  if (isAuthenticated && user) {
    quizzes.forEach(quiz => {
      // Initialize likedBy if it doesn't exist
      if (!quiz.likedBy) {
        quiz.likedBy = [];
      }
      
      // Check if the current user has liked this quiz
      quiz.hasLiked = quiz.likedBy.some(id => 
        id && // Check if id exists
        user.id && // Check if user.id exists
        id.toString && // Check if toString method exists
        user.id.toString && // Check if toString method exists
        id.toString() === user.id.toString()
      );
    });
  }

  // Remove hasLiked from the parameters since it's now part of each quiz object
  res.render('index', {
    quizzes,
    isAuthenticated,
    user
  });
});

const toggleQuizLike = asyncHandler(async (req, res) => {
  try {
    const { quizId } = req.params;
    const userId = req.user.id;

    // Check if user has played the quiz
    const user = await User.findById(userId);
    const hasPlayed = user.playedQuizzes.some(quiz => quiz.quizId.toString() === quizId);

    if (!hasPlayed) {
      return res.status(403).json({ 
        success: false, 
        message: "Please play the quiz before liking it!" 
      });
    }

    const quiz = await Quiz.findById(quizId);
    
    // Initialize likedBy array if it doesn't exist
    if (!quiz.likedBy) {
      quiz.likedBy = [];
    }
    
    const hasLiked = quiz.likedBy.some(id => id && id.toString() === userId.toString());

    if (!hasLiked) {
      // Add like
      quiz.likes = (quiz.likes || 0) + 1;
      quiz.likedBy.push(userId);
    } else {
      // Remove like
      quiz.likes = Math.max(0, (quiz.likes || 1) - 1);
      // Filter out the current user's ID
      quiz.likedBy = quiz.likedBy.filter(id => id && id.toString() !== userId.toString());
    }

    await quiz.save();
    
    res.json({ 
      success: true, 
      likes: quiz.likes, 
      isLiked: !hasLiked // Toggle the state
    });
  } catch (error) {
    console.error("Error in toggleQuizLike:", error);
    res.status(500).json({ success: false, message: "Error updating like" });
  }
});

module.exports = { getQuizzList, toggleQuizLike };
