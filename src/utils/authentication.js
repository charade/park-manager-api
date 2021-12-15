require('dotenv').config();
const jwt = require('jsonwebtoken');
const ErrorOccured = require('../handlers/exception');
const { UNAUTHORIZED } = require('../handlers/status_codes');

module.exports = {

    verifyToken : async(req, res, next) => {
        try{
            const token = req.headers.authorization.split(' ')[1];
            const payload = await jwt.verify(token, process.env.SECRET);
            //invalid token
            if(payload.expDate < Date.now()){
                return new Error();
            };
            req.companyId = payload.companyId;
            req.id = payload.id;
            next();
        }
        catch{
            next(new ErrorOccured(UNAUTHORIZED, 'authentication failed'));
        }
    },

    generateToken : (payload) =>{
        //24h token container user id and company id
        return jwt.sign({...payload, expDate : Date.now() + 60 * 60 * 24 * 1000}, process.env.SECRET);
    }
}