'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    static associate(models) {
      this.belongsTo(models.companies, { foreignKey : 'companyId' });
      this.hasOne(models.places, { foreignKey : 'userId' })
    }
  };
  Users.init({
    id : {
      type : DataTypes.UUID,
      primaryKey : true,
      defaultValue : DataTypes.UUIDV4
    },
    email : DataTypes.STRING,
    role : DataTypes.STRING(7),
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    password: DataTypes.STRING,
    avatar: DataTypes.STRING,
    companyId : DataTypes.UUID
  }, {
    sequelize,
    modelName: 'users',
  });
  return Users;
};