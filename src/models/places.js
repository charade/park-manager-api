'use strict';
const { Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Places extends Model {
    static associate(models) {
      this.belongsTo(models.companies, { foreignKey : 'companyId', as : 'owner' })
    }
  };
  
  Places.init({
    id : {
      type : DataTypes.UUID,
      primaryKey: true,
      defaultValue : DataTypes.UUIDV4
    },
    floor : DataTypes.INTEGER,
    placeNumber: DataTypes.INTEGER,
    available: {
      type : DataTypes.BOOLEAN, 
      defaultValue : true
    },
    //timeStamp
    occupancyTime: {
      type : DataTypes.FLOAT,
      defaultValue :0
    },
    userId : {
      type : DataTypes.UUID,
      allowNull : true,
      defaultValue : null
    },
    companyId : DataTypes.UUID
 
  }, {
    sequelize,
    modelName: 'places',
  });
  return Places;
};