const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const OtherInfo = sequelize.define('OtherInfo', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  advantages: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  history: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  certifications: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  services: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  homeAdvantages: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  }
}, {
  tableName: 'other_info',
  timestamps: true
})

module.exports = OtherInfo
