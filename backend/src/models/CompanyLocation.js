const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const CompanyLocation = sequelize.define('CompanyLocation', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  address: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  tableName: 'company_location',
  timestamps: true
})

module.exports = CompanyLocation