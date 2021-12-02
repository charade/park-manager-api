const router = require('express').Router();
const { users } = require('../controllers');
const { register, login } = users
const { generateToken } = require('../utils/authentication');
const { generateHash } = require('../utils/pass');
const { CREATED, SUCCESS } = require('../handlers/status_codes')

router.post('/register', async(req, res, next) => {
    const { password } = req.body;
    const hash = generateHash(password);
    const response = await register(req.body);
    //if users name already exists
    if(response.error){
        next(response.error);
        return;
    }
    res.status(CREATED);
});

router.post('login', async(req, res, next) => {
    const response = await login(req.body);
    //invalid pass or user doesn't exist
    if(response.error){
        next(response.error);
        return;
    };
    delete response.hash;

    const token = await generateToken(response);
    res.status(SUCCESS).json({auth : token, user: response });
})

module.exports = router