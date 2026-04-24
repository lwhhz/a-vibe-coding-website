const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const CompanyInfo = sequelize.define('CompanyInfo', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  introTitle: {
    type: DataTypes.STRING(255),
    allowNull: false,
    defaultValue: '公司简介'
  },
  introContent: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  footerSubtitle: {
    type: DataTypes.STRING(255),
    allowNull: true,
    defaultValue: '专业电瓶观光车制造商'
  }
}, {
  tableName: 'company_info',
  timestamps: true
})

module.exports = CompanyInfo