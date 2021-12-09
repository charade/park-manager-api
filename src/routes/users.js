const router = require('express').Router();
const { users } = require('../controllers');
const { register, login, updatePermissions,getColleagues, updateUser } = users
const { generateToken } = require('../utils/authentication');
const { generateHash } = require('../utils/pass');
const { CREATED, SUCCESS, NO_CONTENT } = require('../handlers/status_codes');

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
    const { avatar, firstName, lastName, id, email, companyId, role } = response.dataValues;
    const user = { avatar, firstName, lastName, role, email };
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
});
/**
 * update permissions
 */
router.patch('/auth/permission', async(req, res, next) => {
    const { id, role } = req.body;
    const response = await updatePermissions(id, role);
    if(response.error){
        next(response.error);
        return;
    }
    res.status(SUCCESS).json({status : NO_CONTENT});
});

router.patch('/auth/update-user', async(req, res, next) => {
    const { id } = req;
    req.body.id = id;

    if(req.files){
        const { avatar } = req.files;
        const base64Avatar = avatar.data.toString('base64');
        req.body.avatar = base64Avatar;
    };
    // hash new password
    if(req.body.password){
        const { password } = req.body;
        const hash = await generateHash(password, 10);
        req.body.password = hash;
    };
    const response = await updateUser(req.body);

    if(response.error){
        next(response.error);
        return;
    }
    res.status(SUCCESS).json(response);
});



module.exports = router