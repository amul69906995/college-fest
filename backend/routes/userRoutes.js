const express = require('express')
const router = express.Router()
const catchAsync = require('../error/catchAsync')
const appError = require('../error/appError')
const User = require('../models/user.js')
const validateUserSchema = require('../utils/validateUserSchema.js')
const jwt = require('jsonwebtoken')
const {sendVerificationEmail} = require('../utils/sendVerificationEmail.js')
const validateUser = require('../middlewares/validateUser.js')
const sendQrToMail = require('../utils/sendQrToMail.js')

router.post('/sign-in', catchAsync(async (req, res, next) => {
    const { email, password } = req.body
    const { error } = await validateUserSchema.validateAsync(req.body)
    if (error) throw new appError(error.details[0].message, 400)
    const emailExists = await User.findOne({ email })
    if (emailExists) throw new appError("email already exist", 400)
    const user = new User({ email, password })
    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' })
    const verifyUrl = `${process.env.FRONTEND_URL}/emailverification/?token=${jwtToken}`
    await sendVerificationEmail(verifyUrl)
    await user.save()
    // res.json({ jwtToken, verifyUrl })
    res.json({ "message": "please verify you email then login" })
}))
router.post('/log-in', catchAsync(async (req, res, next) => {
    const logic = async () => {
        const { email, password } = req.body;
        const { error } = await validateUserSchema.validateAsync({ email, password })
        if (error) throw new appError(error.details[0].message, 400);
        const user = await User.findOne({ email })
        if (!user) throw new appError("email doenot exist", 400)
        const isPasswordCorrect = await user.comparePassword(password)
        if (!isPasswordCorrect) throw new appError("password is incorrect", 400)
        if (!user.isVerified) throw new appError("user is not verified", 400)
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' })
        res.cookie('jwtToken', token, { maxAge: 24 * 60 * 60 * 1000, sameSite: 'none', secure: true })
        res.json({ "message": "login successfully", jwtToken: token, user })
    }
    const { jwtToken } = req.cookies;
    if (jwtToken) {
        jwt.verify(jwtToken, process.env.JWT_SECRET, function (err, data) {
            if (data) throw new appError('you already have token no need to login again', 400)
            if (err) {
                logic()
            }
        });
    }
    else {
        await logic();
    }

}))

router.post('/verify-user', catchAsync(async (req, res, next) => {
    const { token } = req.body;
    if (!token) throw new appError("jwt is required", 400)
    const data = jwt.verify(token, process.env.JWT_SECRET)
    if (!data) throw new appError("token is invalid", 400)
    const user = await User.findById(data.id)
    if (!user) throw new appError('token is expired/invalid token', 400)
    if (user.isVerified) throw new appError('user already verified', 400)
    user.isVerified = true;
    await user.save()
    res.json({ message: "user is verified", user })
}))
router.post('/auto-login', catchAsync(async (req, res) => {
    const { jwtToken } = req.body;
    if (!jwtToken) throw new appError("jwt is required", 400)
    console.log(jwtToken)
    const data = jwt.verify(jwtToken, process.env.JWT_SECRET)
    if (!data) throw new appError("token is invalid", 400)
    console.log(data)
    const user = await User.findById(data.id)
    if (!user) throw new appError("user not found", 400)
    res.json({ "message": "logged in successfully", user })
}))
router.get('/generate-qr', validateUser, catchAsync(async (req, res) => {
    const { userId } = req;
    const user = await User.findById(userId);
    if (!user) throw new appError('user not found', 404)
    if (!user.isAllowedForQrData) throw new appError('currently we donot have any ongoing fest', 400);
    if (user.qrData) throw new appError('you have already generated qr', 400)
    const qrData = jwt.sign(userId,process.env.JWT_QR_SECRET);
    user.qrData = qrData;
    sendQrToMail(user,qrData)
    await user.save();
    res.json({ message: 'qr data generated and sent to mail', qrData })
}))
router.get('/view-qr', validateUser, catchAsync(async (req, res, next) => {
    const { userId } = req;
    const user = await User.findById(userId);
    if (!user) throw new appError('user not found', 404)
    res.json(user.qrData)
}))

module.exports = router;