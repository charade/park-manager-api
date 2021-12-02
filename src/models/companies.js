'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Companies extends Model {
    static associate(models) {
      this.hasMany(models.places, { foreignKey : 'companyId', as : 'places' });
      this.hasMany(models.users, { foreignKey :'companyId', as : 'users' });
    }
  };
  Companies.init({
    id : {
      type : DataTypes.UUID,
      primaryKey : true,
      defaultValue : DataTypes.UUIDV4
    },
    hash : DataTypes.STRING,
    companyName: DataTypes.STRING(50),
    logo: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'companies',
  });
  return Companies;
};