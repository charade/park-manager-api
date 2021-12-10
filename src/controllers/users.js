const { users, companies, places } = require('../models');
const ErrorOccured = require('../handlers/exception');
const { FORBIDDEN, NOT_FOUND, UNAUTHORIZED } = require('../handlers/status_codes');
const { checkPassword } = require('../utils/pass');
const { role } = require('../utils/constants');
const { Op } = require('Sequelize');

module.exports = {
    register : async(data) => {
        const { firstName, lastName, email, password, companyName : name } = data ;
        const user = await users.findOne({ where : { email } });
        const company = await companies.findOne({ where : { name } });
        
        //check if user email already exists
        if(user){
            return { error : new ErrorOccured(FORBIDDEN, 'email already registered.') }
        };
        
        /**
         * admin user created by another already registred admin
         */
        if(data.createdByExisting){
            console.log(company)
            const newUser = await users.create(data);
            // return newUser;
        };
        /**
         *  for self creating user we 
         *  need to check if company exists
         */
        
        /**
         * self created user creating company is admin
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
                return !company && { error : new ErrorOccured(NOT_FOUND, 'Company not Registered yet') }
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
        const { email } = data;
        const user = await users.findOne({ 
            where : { email : data.email },
            include: {
                as :'company',
                model : companies,
                attributes : ['name']
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
    /**
     */
    getColleagues : (companyId, userId) => users.findAll({ 
        where : { 
            companyId,
            id : {
                [Op.ne] : userId
            }
        },
        attributes : ['id', 'avatar', 'firstName', 'lastName', 'role', 'email']
    }),
    /**
     * admin update others users permission
     */
    updatePermissions: async(id, role) => {
        try{
            const response = await users.update(
                { role }, 
                { where :  { id } }
            );
            return response;
        }
        catch{
            return { error : new Error() }
        }
    },
    updateUser : async(data) => {
        try{
         //check if new email is already in use
        if(data.email){
            const { email } = data
            const usingEmail = await users.findOne({ where : { email } });

            if(usingEmail){
                return { error : new ErrorOccured(FORBIDDEN,'this email is already registered') }
            }
        };
        const { id } = data;
        const user = await users.findOne(
            { where : { id } ,
            include: {
                as :'company',
                model : companies,
                attributes : ['name']
            }
        });

        Object.keys(data).forEach(el => {
            user[el] = data[el];
        });
        await user.save();
        delete user.dataValues.password;
        return user;

        }
        catch{
            return {error : new Error()}
        }
        
    },
    createNewAccount : async(data) => {
        const { email } = data;
        //check if email exist
        const emailExist = await users.findOne({ where : { email } });
        if(emailExist){
            return { error : new ErrorOccured(FORBIDDEN, 'email already exists.') }
        }
        const newAccount = users.create(data).catch(() => ({ error : new Error() }))
        return newAccount;
    }
}