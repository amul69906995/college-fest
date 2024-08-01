const express = require('express');
const validateUser = require('../middlewares/validateUser');
const requireRole = require('../utils/requireRole');
const catchAsync = require('../error/catchAsync');
const router = express.Router();
const User = require('../models/user.js');
const appError = require('../error/appError');
const jwt = require('jsonwebtoken')

router.post('/verify-qr', validateUser, requireRole(['vol','admin']), catchAsync(async (req, res) => {
    const { qrCodeData } = req.body
    const data = jwt.verify(qrCodeData, process.env.JWT_QR_SECRET)
    if (!data) throw new appError('invalid qr', 404)
    const user = await User.findById(data);
    console.log(user,data)
    if (!user) throw new appError('invalid qr/user not found', 404)
    if(user.isQrVerified)  throw new appError('user is one time already verified',400)
        user.isQrVerified = true;
    await user.save()
    res.status(200).json({ message: 'qr verified successfully' })
}))

module.exports = router;