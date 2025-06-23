const asyncHandler = require("express-async-handler");
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const userValidationSchema = require('../validation/userValidationSchema');

const getAccountSettings = asyncHandler(async (req, res) => {
    const isAuthenticated = !!req.user;
    if(!isAuthenticated){
        return res.redirect('/login');
    }else{
        const user = req.user;
        res.render("accountSettings",{
            user,
            isAuthenticated,
        })
    }
})

const updateAccountSettings = asyncHandler(async (req, res) => {
    const { username, email, currentPassword, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordCorrect) {
        return res.status(400).json({ message: 'Current password is incorrect' });
    }

    if (newPassword) {
        const validation = userValidationSchema.pick({ password: true }).safeParse({ password: newPassword });
        if (!validation.success) {
            return res.status(400).json({ errors: validation.error.errors });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
    }

    user.name = username;
    await user.save();

    res.status(200).json({ message: 'Account settings updated successfully' });
})

module.exports = { getAccountSettings, updateAccountSettings };

