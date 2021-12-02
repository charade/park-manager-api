const { companies } = require('../models');
const ErrorOccured = require('../handlers/exception');
const { FORBIDDEN, NOT_FOUND, UNAUTHORIZED } = require('../handlers/status_codes');
const { checkPassword } = require('../utils/pass');

module.exports = {
    register : async(data) => {
        //check if company name already exists
        const company = await companies.findOne({ 
            where : {
                companyName : data.companyName
            }
         });
        if(company){
            return { error : new ErrorOccured(FORBIDDEN, 'this company is already registered') }
        };
        //succesfully created
        return ;
    },

    login : async(data) => {
        const company = await companies.findOne({ 
            where : {
                companyName : data.companyName
            }
        });
        //check password
        if(!company){
            return { error : new ErrorOccured(NOT_FOUND, "this company is not registered") };
        };
        const isPasswordValid = await checkPassword(data.password, company.hash);

        if(isPasswordValid){
            return company;
        };

        return { error : new ErrorOccured(UNAUTHORIZED, 'invalid password') }
    }
}