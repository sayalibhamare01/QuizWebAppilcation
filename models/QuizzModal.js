const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    numQuestions: {
      type: Number,
      default: 0,
    },
    plays: {
      type: Number,
      default: 0,
      min: 0,
    },
    difficulty: {
      type: String,
      enum: ["Beginner level", "Intermediate level", "Expert level"],
      default: "Intermediate level",
    },
    imageurl: {
      type: String,
      default: null,
    },
    quizData: [
      {
        question: {
          type: String,
          required: true,
          trim: true,
        },
        answers: {
          type: [String],
          required: true,
          validate: {
            validator: (answers) => answers.length > 0,
            message: "Answers array must contain at least one answer.",
          },
        },
        correct: {
          type: Number,
          required: true,
          validate: {
            validator: (value) => value >= 0,
            message: "Correct answer index must be a non-negative integer.",
          },
        },
      },
    ],
    creator: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: (email) =>
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
        message: "Invalid email address format.",
      },
    },
    likes: {
      type: Number,
      default: 0,
    },
    likedBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    scores: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      userName: {
        type: String,
        required: true
      },
      score: {
        type: Number,
        required: true,
        min: 0
      },
      timeTaken: {
        type: String,
        required: true
      },
      date: {
        type: Date,
        default: Date.now
      }
    }]
  },
  {
    timestamps: true,
    collection: "Quiz",
  }
);

module.exports = mongoose.model("Quiz", quizSchema);
