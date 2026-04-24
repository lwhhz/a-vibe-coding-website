const CompanyInfo = require('../models/CompanyInfo')
const { logActivity } = require('./activityLogController')

const companyInfoController = {
  getInfo: async (req, res) => {
    try {
      let info = await CompanyInfo.findOne()
      if (!info) {
        const defaultContent = `绿色动力是一家专业的电瓶观光车制造商，位于惠州市惠阳区工业园区。我们致力于为景区、园区、酒店等场所提供高品质的绿色出行解决方案。

公司成立于2010年，拥有10年以上的行业经验，是惠州本地知名的新能源车辆制造商。我们注重产品质量和技术创新，不断推出符合市场需求的新产品。

我们的目标是成为国内领先的电瓶观光车供应商，为客户提供最优质的产品和服务。`

        info = await CompanyInfo.create({
          introTitle: '公司简介',
          introContent: defaultContent,
          footerSubtitle: '专业电瓶观光车制造商'
        })
      }
      res.json(info)
    } catch (error) {
      console.error('获取公司信息失败:', error)
      res.status(500).json({ error: '获取公司信息失败' })
    }
  },

  saveInfo: async (req, res) => {
    try {
      const { introTitle, introContent, image, footerSubtitle } = req.body

      let info = await CompanyInfo.findOne()

      if (info) {
        info.introTitle = introTitle
        info.introContent = introContent
        if (image !== undefined) info.image = image
        if (footerSubtitle !== undefined) info.footerSubtitle = footerSubtitle
        await info.save()
        logActivity('公司信息', '更新', '公司信息', '更新了公司信息')
      } else {
        info = await CompanyInfo.create({
          introTitle: introTitle || '公司简介',
          introContent: introContent,
          image: image || null,
          footerSubtitle: footerSubtitle || '专业电瓶观光车制造商'
        })
      }

      res.json(info)
    } catch (error) {
      console.error('保存公司信息失败:', error)
      res.status(500).json({ error: '保存公司信息失败' })
    }
  }
}

module.exports = companyInfoController