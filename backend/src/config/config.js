require('dotenv').config()

module.exports = {
  port: process.env.PORT || 5000,
  database: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'callduck'
  },
  secretKey: process.env.SECRET_KEY || 'your-secret-key'
}