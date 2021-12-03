const router = require('express').Router();
const usersRouter = require('./users');
const placesRoute = require('./places');
const { verifyToken } = require('../utils/authentication');

router
.use('/:param/auth', verifyToken)
.use('/users', usersRouter)
.use('/places', placesRoute)

module.exports = router;