const CompanyLocation = require('../models/CompanyLocation')
const { logActivity } = require('./activityLogController')

const locationController = {
  getLocation: async (req, res) => {
    try {
      const location = await CompanyLocation.findOne()
      if (!location) {
        return res.json({
          name: '绿色动力新能源科技有限公司',
          address: '惠州市惠阳区工业园区',
          phone: '138-0013-8000',
          email: 'info@greenpower.com'
        })
      }
      res.json(location)
    } catch (error) {
      res.status(500).json({ error: '获取公司位置失败' })
    }
  },

  saveLocation: async (req, res) => {
    try {
      const { name, address, phone, email } = req.body
      
      let location = await CompanyLocation.findOne()
      
      if (location) {
        location.name = name
        location.address = address
        location.phone = phone
        location.email = email
        await location.save()
        logActivity('公司信息', '更新', '联系方式', '更新了公司联系方式')
      } else {
        location = await CompanyLocation.create({
          name,
          address,
          phone,
          email
        })
      }
      
      res.json(location)
    } catch (error) {
      console.error('保存公司位置失败:', error)
      res.status(500).json({ error: '保存公司位置失败' })
    }
  }
}

module.exports = locationController
