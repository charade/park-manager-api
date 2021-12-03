'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Places extends Model {
    static associate(models) {
      this.belongsTo(models.users, { foreignKey : 'userId'});
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
      type : DataTypes.INTEGER,
      defaultValue :0
    },
    userId : {
      type : DataTypes.UUID,
      allowNull : true,
      defaultValue : null
    }
  }, {
    sequelize,
    modelName: 'places',
  });
  return Places;
};