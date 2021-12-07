/*
 *  admin users
 */
const router = require('express').Router();
const { places } = require('../controllers');
const { create, getAllAvailable, getAllAvailableByFloor, reserve, find, free } = places ;
const { CREATED, SUCCESS, NO_CONTENT } = require('../handlers/status_codes');

//create a place
router.post('/auth', async(req, res, next) => {
    const { companyId } = req;
    req.body.companyId = companyId;

    const response = await create(req.body);
    if(response.error){
        next(response.error);
        return;
    }
    res.status(CREATED).json(response);
});
//find where user parked
router.get('/auth/parked', async(req, res, next) => {
    const { id } = req;
    const place = await find(id);
    
    if(place.error){
        next(place.error);
        return;
    }
    res.status(SUCCESS).json(place);
});

// get all available places
router.get('/auth', async(req, res) => {
    //assume users can only fetch available place from their company;
    const { companyId } = req;
    const response = await getAllAvailable(companyId);
    res.status(SUCCESS).json(response);
});

//git available places by floor
router.get('/auth/:floor', async(req, res) => {
    //floor is the only one param
    const response = await getAllAvailableByFloor(req.params);
    res.status(SUCCESS).json(response);
});

//update
router.patch('/auth', async(req, res, next) => {
    const { id } = req;
    req.body.userId = id;
    const response =  await reserve(req.body);
    if(response.error){
        next(response.error);
        return;
    };
    res.status(SUCCESS).json(response);
});

router.patch('/auth/free', async (req, res, next) => {
    const { id } = req.body;
    const response = await free(id);

    if(response.error){
        next(response.error);
        return;
    };
    res.status(SUCCESS).json(response);
})

module.exports = router;