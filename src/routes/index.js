const router = require('express').Router();
const userRouter = require('./users');
const { verifyToken } = require('../utils/authentication');

router
.use('/:param/auth', verifyToken)
.use('/users', userRouter)

module.exports = router;