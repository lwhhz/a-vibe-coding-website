const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const config = require('./config/config')
const sequelize = require('./config/database')
const Product = require('./models/Product')
const Case = require('./models/Case')
const ContactForm = require('./models/ContactForm')
const CompanyLocation = require('./models/CompanyLocation')
const CompanyInfo = require('./models/CompanyInfo')
const Banner = require('./models/Banner')
const OtherInfo = require('./models/OtherInfo')
const ActivityLog = require('./models/ActivityLog')
const productRoutes = require('./routes/productRoutes')
const caseRoutes = require('./routes/caseRoutes')
const contactFormRoutes = require('./routes/contactFormRoutes')
const locationRoutes = require('./routes/locationRoutes')
const companyInfoRoutes = require('./routes/companyInfoRoutes')
const bannerRoutes = require('./routes/bannerRoutes')
const otherInfoRoutes = require('./routes/otherInfoRoutes')
const activityLogRoutes = require('./routes/activityLogRoutes')

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/api/products', productRoutes)
app.use('/api/cases', caseRoutes)
app.use('/api/contact-forms', contactFormRoutes)
app.use('/api/location', locationRoutes)
app.use('/api/company-info', companyInfoRoutes)
app.use('/api/banners', bannerRoutes)
app.use('/api/other-info', otherInfoRoutes)
app.use('/api/activity-logs', activityLogRoutes)

sequelize.sync({ alter: true })
  .then(() => {
    console.log('数据库同步成功')
  })
  .catch(err => {
    console.error('数据库同步失败:', err)
  })

app.listen(config.port, () => {
  console.log(`服务器运行在端口 ${config.port}`)
})

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})