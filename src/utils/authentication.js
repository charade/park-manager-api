require('dotenv').config();
const jwt = require('jsonwebtoken');
const ErrorOccured = require('../handlers/exception');
const { UNAUTHORIZED } = require('../handlers/status_codes');

module.exports = {
    verifyToken : async(req, res, next) => {
        const token = req.headers.authorization;
        const payload = await jwt.verify(token, process.env.SECRET);
        //invalid token
        if(!payload || payload.expDate < Date.now()){
            next(new ErrorOccured(UNAUTHORIZED, 'authentication failed'));
            return;
        }
        req.token = payload;
        next();
    },

    generateToken : ( payload ) =>{
        //24h token
        return jwt.sign({payload, expDate : Date.now() + 60 * 60 * 24 * 1000}, process.env.SECRET);
    }
}