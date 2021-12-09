'use strict';
const { Model} = require('sequelize');

const { role } = require('../utils/constants');

module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    static associate(models) {
      this.belongsTo(models.companies, { foreignKey : 'companyId', as : 'company' })
    }
  };

  Users.init({
    id : {
      type : DataTypes.UUID,
      primaryKey : true,
      defaultValue : DataTypes.UUIDV4
    },
    email : DataTypes.STRING,
    role : {
      type : DataTypes.STRING(6),
      defaultValue : role.PUBLIC
    },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    password: DataTypes.STRING,
    avatar: DataTypes.TEXT('long'),
    companyId : DataTypes.UUID
  }, {
    sequelize,
    modelName: 'users',
  });
  return Users;
};