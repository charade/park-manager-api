/*
 *  admin users
 */
const router = require('express').Router();
const { places } = require('../controllers');
const { CREATED, SUCCESS, NO_CONTENT } = require('../handlers/status_codes');
const { create, getAllAvailable, getAllAvailableByFloor, reserve } = places ;

//create a place
router.post('/auth', async(req, res, next) => {
    const response = await create(req.body);
    if(response.error){
        next(response.error);
        return;
    }
    res.status(CREATED).json(response);
});

// get all available places
router.get('/auth', async(req, res) => {
    const response = await getAllAvailable();
    res.status(SUCCESS).json(response);
});

//git available places by floor
router.get('/auth/:floor', async(req, res) => {
    const { floor } = req.params;
    const response = await getAllAvailableByFloor(floor);
    res.status(CREATED).status(response);
});

router.patch('/auth', async(req, res, next) => {
    const { id } = req;
    req.body.userId = id;
    const response =  await reserve(req.body);

    if(response.error){
        next(response.error);
        return;
    }
    res.status(NO_CONTENT);
})

module.exports = router;