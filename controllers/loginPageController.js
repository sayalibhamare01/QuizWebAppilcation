const asyncHandler = require("express-async-handler")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const User = require("../models/userModel")

const getloginPage = asyncHandler(async (req, res) => {
    res.render('login', {
        rightPanelActive: false,
    });
});

const loginUser = asyncHandler(async (req,res) =>{
    const {email, password} = req.body;

    if(!email || !password){
        return res.status(400).json({
            message : 'Email and password requires'
        })
    }

    const user = await User.findOne({email});
    if(!user){
        return res.status(400).json({
            message: 'Invalid email or password'
        })
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if(!isPasswordCorrect){
        return res.status(400).json({
            message : "Invalid email  or password"
        })
    }

    const token = jwt.sign(
        { id: user._id, email: user.email, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: '2d' }
    );
    
    // Set the token as an HTTP-only cookie
    res.cookie('token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: 2 * 24 * 60 * 60 * 1000
    });

    // Send success response
    res.status(200).json({
        success: true,
        message: 'Login successful',
        redirectUrl: user.isAdmin ? '/admin/dashboard' : '/quizzes'
    });
})


module.exports = {getloginPage,loginUser} 
