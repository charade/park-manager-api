const { users } = require('../models');
const ErrorOccured = require('../handlers/exception');
const { FORBIDDEN, NOT_FOUND, UNAUTHORIZED } = require('../handlers/status_codes');
const { checkPassword } = require('../utils/pass');

module.exports = {
    register : async(data) => {
        //check if company name already exists
        const user = await users.findOne({ 
            where : {
                email : data.email
            }
         });
        if(user){
            return { error : new ErrorOccured(FORBIDDEN, 'this user is already registered') }
        };
        //succesfully created
        return ;
    },

    login : async(data) => {
        const user = await users.findOne({ 
            where : {
                email : data.email
            }
        });
        //check password
        if(!user){
            return { error : new ErrorOccured(NOT_FOUND, "this user is not registered") };
        };
        const isPasswordValid = await checkPassword(data.password, company.hash);

        if(!isPasswordValid){
            return { error : new ErrorOccured(UNAUTHORIZED, 'invalid password') }
        };
        
        return user;
    }
}