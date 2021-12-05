'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Companies extends Model {
    static associate(models) {
      this.hasMany(models.users, {foreignKey : 'companyId', as : 'employees' });
      this.hasMany(models.places, { foreignKey : 'companyId', as : 'places' });
    }
  };
  Companies.init({
    id : {
      type : DataTypes.UUID,
      primaryKey : true,
      defaultValue : DataTypes.UUIDV4
    },
    name: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'companies',
  });
  return Companies;
};