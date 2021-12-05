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
            return { error : new ErrorOccured(FORBIDDEN, 'This e-mail already exists.') }
        };
        //succesfully created
        await users.create(data);
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
            return { error : new ErrorOccured(NOT_FOUND, "User not found.") };
        };
        const isPasswordValid = await checkPassword(data.password, user.password);

        if(!isPasswordValid){
            return { error : new ErrorOccured(UNAUTHORIZED, 'Invalid password') }
        };
        
        return user;
    }
}