const express = require('express')
const connectDb = require('./config/dcConnection')
const cookieParser = require('cookie-parser');
const verifyToken = require('./middelware/Authorization');
const dotenv = require('dotenv').config()
const path = require('path')
const port = process.env.PORT || 2002
const app = express();
connectDb();

app.use(express.json())
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');  // Corrected this line


app.use("/login", require("./routes/loginRoute"))
app.use("/register", require("./routes/registerRoute"))
app.use("/logout", require("./routes/logoutRoute"))

app.use("/quizzes", verifyToken, require("./routes/quizzListRoute"));
app.use("/quizzes", verifyToken, require("./routes/quizArena"))
app.use("/createquizz", verifyToken, require("./routes/createQuizRoute"))

app.use("/accountSettings", verifyToken, require("./routes/accountSettingsRoute"))
app.use("/userQuizzes", verifyToken, require("./routes/userQuizzesRoute"))
app.use("/admin", verifyToken, require("./routes/adminRoute"))


app.listen(port, () => {
  console.log("Server is Listening on port", port);
});
