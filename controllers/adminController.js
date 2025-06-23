const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Quiz = require("../models/QuizzModal");


const getDashboard = asyncHandler(async(req,res)=>{
    try {
        // Fetch all non-admin users
        const users = await User.find({ isAdmin: false }).select('-password')
        
        res.render('Dashobard', {
            users,
            user: req.user,
            isAuthenticated: true
        })
    } catch (error) {
        console.error('Error fetching users:', error)
        res.status(500).send('Error fetching users')
    }
});

const deleteUser = asyncHandler(async (req, res) => {
    const { userId } = req.params
    console.log(userId)
    try {
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        
        if (user.isAdmin) {
            return res.status(403).json({ message: 'Cannot delete admin user' })
        }
        
        await user.deleteOne()
        res.json({ success: true, message: 'User deleted successfully' })
    } catch (error) {
        console.error('Delete error:', error)
        res.status(500).json({ success: false, message: 'Error deleting user' })
    }
})

const getAllQuizzes = asyncHandler(async(req,res)=>{
    const quizzes = await Quiz.find({});

    res.render('Allquizzes', {
        quizzes,
        isAuthenticated: true,
    });
})

const deleteQuiz = asyncHandler(async (req, res) => {
    const quizId = req.params.quizId;
    
    try {
        const quiz = await Quiz.findById(quizId);
        
        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: "Quiz not found"
            });
        }

        await Quiz.findByIdAndDelete(quizId);
        
        res.json({
            success: true,
            message: "Quiz deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting quiz:", error);
        res.status(500).json({
            success: false,
            message: "Error deleting quiz"
        });
    }
});

const AdminCreateQuiz = asyncHandler(async (req, res) => {
    const isAuthenticated = !!req.user;
    if (!isAuthenticated) {
      return res.redirect('/login');
    }

    res.render('AdminCreateQuizz', {
      isAuthenticated,
    });
  });

const createQuiz = asyncHandler(async (req, res) => { 

    const { title, difficulty, imageurl, language, quizData } = req.body;
    const creator = 'Codingal';
  
    const newQuiz = new Quiz({
      title,
      difficulty,
      imageurl,
      language,
      quizData,
      creator,
      numQuestions: quizData.length,
    });
  
    try {
      const savedQuiz = await newQuiz.save();
      res.status(201).json({ message: 'Quiz created successfully' });
    } catch (error) {
      console.error("Error saving quiz:", error);
      res.status(500).json({ message: 'Failed to create quiz', error });
    }
  });

module.exports = {getDashboard, deleteUser, getAllQuizzes, deleteQuiz, AdminCreateQuiz, createQuiz};