const asyncHandler = require("express-async-handler");
const Quiz = require("../models/QuizzModal");

const getCreateQuizPage = asyncHandler(async (req, res) => {
  const isAuthenticated = !!req.user;
  if (!isAuthenticated) {
    return res.redirect('/login');
  }
  const user = req.user;
  res.render('createQuizz', {
    user,
    isAuthenticated,
  });
});

const createQuiz = asyncHandler(async (req, res) => { 

  const { title, difficulty, imageurl, language, quizData } = req.body;
  const creator = req.user.name;

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

module.exports = { getCreateQuizPage, createQuiz};