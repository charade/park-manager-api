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
    number: DataTypes.STRING,
    availability: DataTypes.BOOLEAN,
    occupancyTime: DataTypes.STRING,
    userId : DataTypes.UUID
  }, {
    sequelize,
    modelName: 'places',
  });
  return Places;
};