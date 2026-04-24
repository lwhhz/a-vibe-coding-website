const { Sequelize } = require('sequelize')

// 使用MCP提供的数据库连接
const sequelize = new Sequelize(
  'callduck',  // 数据库名称
  'root',      // 用户名
  '13502264233Aa',  // 密码
  {
    host: 'localhost',
    dialect: 'mysql',
    logging: console.log
  }
)

// 测试数据库连接
sequelize.authenticate()
  .then(() => {
    console.log('数据库连接成功')
  })
  .catch(err => {
    console.error('数据库连接失败:', err)
  })

module.exports = sequelize