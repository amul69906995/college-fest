const express = require('express');
const validateUser = require('../middlewares/validateUser');
const requireRole = require('../utils/requireRole');
const catchAsync = require('../error/catchAsync');
const router = express.Router();
const User = require('../models/user.js');
const appError = require('../error/appError');

router.post('/activate-fest', validateUser, requireRole(['admin']), catchAsync(async (req, res) => {
    const user = await User.findById(req.userId)
    if (!user) throw new appError('user not found', 404)
    await User.updateMany({}, { isAllowedForQrData: true })
    res.status(200).json({ message: 'Fest activated' })

}))
router.post('/deactivate-fest', validateUser, requireRole(['admin']), catchAsync(async (req, res) => {
    await User.updateMany({}, { isAllowedForQrData: false, qrData: '', isQrVerified: false })
    res.status(200).json({ message: 'Fest deactivated' })
}))
router.post('/make-vol', validateUser, requireRole(['admin']), catchAsync(async (req, res, next) => {
    const { userEmail } = req.body;
    const user = await User.findOne({ email: userEmail });
    if (!user) throw new appError('user doesnot exist', 404)
    if (user.role !== 'user') throw new appError('user role is already admin or vol')
    user.role = 'vol'
    await user.save();
    res.json({ message: "role changes to vol" })
}))
router.post('/remove-vol', validateUser, requireRole(['admin']), catchAsync(async (req, res, next) => {
    const { userEmail } = req.body;
    const user = await User.findOne({ email: userEmail });
    if (!user) throw new appError('user doesnot exist', 404)
    if (user.role === 'user' || user.role === 'admin') throw new appError('user is not vol')
    user.role = 'user'
    await user.save();
    res.json({ message: "role changes to user" })
}))
router.get('/all-vol', validateUser, requireRole(['admin']), catchAsync(async (req, res, next) => {
    const user = await User.find({ role: 'vol' })
    res.json(user)
}))
module.exports = router;