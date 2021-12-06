const router = require('express').Router();
const { users } = require('../controllers');
const { register, login } = users
const { generateToken } = require('../utils/authentication');
const { generateHash } = require('../utils/pass');
const { CREATED, SUCCESS } = require('../handlers/status_codes');
const { getColleagues } = require('../controllers/users');

router.post('/register', async(req, res, next) => {
    const { password, email, companyName } = req.body;
    const hash = await generateHash(password);
    req.body.password = hash;
    /**
     *  simplify for later comparison
     */
    req.body.email = email.toLowerCase();
    req.body.companyName = companyName.toLowerCase();
    /**
     * 
     */
    const response = await register(req.body);
    if(response && response.error){
        next(response.error);
        return;
    }
    res.status(CREATED).json({status : CREATED});
});

router.post('/login', async(req, res, next) => {
    const response = await login(req.body);
    //invalid pass or user doesn't exist
    if(response.error){
        next(response.error);
        return;
    }; 
    const { avatar, firstName, lastName, id, companyId, role } = response.dataValues;
    const user = { avatar, firstName, lastName, role };
    const token = await generateToken({id, companyId});
    res.status(SUCCESS).json({auth : token, user});
});
/**
 *  allow Admin user to see users from same company
 */
router.get('/auth/colleagues', async(req, res) => {
    const { companyId, id } = req;
    /**
     * we need to filter in order to not include user in his colleagues list
     */
    const colleagues = await getColleagues(companyId, id);
    res.status(SUCCESS).json(colleagues);
})

module.exports = router