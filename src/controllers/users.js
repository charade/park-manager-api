const { users, companies } = require('../models');
const ErrorOccured = require('../handlers/exception');
const { FORBIDDEN, NOT_FOUND, UNAUTHORIZED } = require('../handlers/status_codes');
const { checkPassword } = require('../utils/pass');
const { role } = require('../utils/constants');
const { Op } = require('Sequelize');

module.exports = {
    register : async(data) => {
        const { firstName, lastName, email, password, companyName : name } = data ;
        //check if user email already exists
        const user = await users.findOne({ where : { email } });

        if(user){
            return { error : new ErrorOccured(FORBIDDEN, 'email already registered.') }
        };
        /**
         *  need to check if company exists
         */
        const company = await companies.findOne({ where : { name } });
        /**
         * user signing up and creating company is admin
         */
        if(data.role === role.ADMIN){
            if(company){
                return { error : new ErrorOccured(FORBIDDEN, 'Company already registered.')}
            }
            //create company and user at same time with association
            await companies.create({name}).then( async company => {
                await users.create({
                    firstName, 
                    lastName, 
                    email, 
                    role : data.role,
                    password,
                    companyId : company.id 
                });
            });
            return;
        }
        /**
         * user sign up on registered company
         */
        else{
            if(!company){
                return !company && { error : new ErrorOccured(NOT_FOUND, 'Company not Registered') }
            };
            const companyId = company.dataValues.id;
            console.log(companyId)
            await users.create({...data, companyId });
            return ;
        }
    },
    login : async(data) => {
        /**
         * check if unique email exists
         */
        const user = await users.findOne({ 
            where : {
                email : data.email
            }
        });
        if(!user){
            return { error : new ErrorOccured(NOT_FOUND, "User not found.") };
        };
        /**
         * if user/email found
         */
        const isPasswordValid = await checkPassword(data.password, user.password);
        if(!isPasswordValid){
            return { error : new ErrorOccured(UNAUTHORIZED, 'Invalid password') }
        };
        return user;
    },

    getColleagues : (companyId, userId) => users.findAll({ 
        where : { 
            companyId,
            id : {
                [Op.ne] : userId
            }
        },
        attributes : ['id', 'avatar', 'firstName', 'lastName', 'role']
    }),

}