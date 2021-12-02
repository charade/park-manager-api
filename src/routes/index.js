const router = require('express').Router();
const userRouter = require('./users');
const companiesRouter = require('./companies');

router.use('/company', companiesRouter);
router.use('/users', userRouter);

module.exports = router;