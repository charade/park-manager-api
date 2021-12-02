const router = require('express').Router();
const { company } = require('../controllers');
const { register } = company
const { generateHash } = require('../utils/pass');
const { CREATED } = require('../handlers/status_codes')
router.post('/register', async(req, res, next) => {
    const { password } = req.body;
    const hash = generateHash(password);
    const response = await register(req.body);
    //if company name already exists
    if(response.error){
        next(response.error);
        return;
    }
    res.status(CREATED);
})

module.exports = router