const appError = require("../error/appError");
const catchAsync = require("../error/catchAsync");
require('dotenv').config()
const jwt = require('jsonwebtoken')
const validateUser = catchAsync(async (req, res, next) => {
const User=require('../models/user.js')
    console.log('Cookies: ', req.cookies)
    const { jwtToken } = req.cookies;
    if (!jwtToken) throw new appError("jwtToken is missing")
    const data = jwt.verify(jwtToken, process.env.JWT_SECRET);
    if (!data) throw new appError("token is invalid", 400)
    const user = await User.findById(data.id)
    if(!user)throw new appError("user not found",400)
    if(!user.isVerified)throw new appError("you need to verify your account")
    req.userId = data.id;
    req.userRole=user.role;
    next();
})

module.exports = validateUser;