const { places } = require('../models');
const ErrorOccured = require('../handlers/exception')
const { FORBIDDEN, NOT_FOUND } = require('../handlers/status_codes');

module.exports = {
    create : async(data) => {
        //ckeck if place already exists
        const { floor, placeNumber, companyId } = data;

        const place = await places.findOne({
            where : { floor ,placeNumber, companyId }
        });

        if(place){
            return { error : new ErrorOccured(FORBIDDEN, `this place is already registered`) }
        };

        const createdPlace = await places.create(data);
        return createdPlace;
    },

    getAllAvailable : (companyId) => {
        return places.findAll({
            where : { available: true, companyId }
        })
    },
    getAllAvailableByFloor : (data) =>{
        return places.findAll({
            where : { 
                floor : data.floor,
                available : true
            }
        })
    },

    find : async (userId) => {
        const place = await places.findOne({ where : { userId } })
    
        if(!place){
            return { error : new ErrorOccured(NOT_FOUND, 'not found') }
        }
        
        return place;
    },
    reserve : async(data) => {
        try{
            const { userId, id } = data;
            //check if user altready parked before assigning him a place
            const userAlreadyReserved = await places.findOne({ where : { userId } });
            if(userAlreadyReserved){
                return { error : new ErrorOccured(FORBIDDEN, "You are already parked") }
            }

            const place = await places.findOne({ where : { id } });
            place.userId = userId;
            place.available = false
            await place.save();
            return place;
        }
        catch{
            return { error : new Error()}
        }
    },
    free : async (id) => {
        try{
            const place = await places.findOne({ where : { id } });
            place.userId = null;
            place.available = true;
            await place.save();
            return place;
        }
        catch{
            return { error : new Error() }
        }
    }
}