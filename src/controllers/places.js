const { places } = require('../models');
const ErrorOccured = require('../handlers/exception')
const { FORBIDDEN } = require('../handlers/status_codes');

module.exports = {
    create : async(data) => {
        //ckeck if place already exists
        const place = await places.findOne({
            where : {
                floor : data.floor,
                placeNumber : data.placeNumber
            }
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

    reserve : async(data) => {
        try{
            const response = await places.update({ 
                available : false,
                userId : data.userId
            },
            {
                where :{
                    id: data.id
                } 
            })
            //nb of updated rows
            return response;
        }
        catch{
            return { error : new Error() }
        }
    }
}