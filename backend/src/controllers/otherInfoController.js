const OtherInfo = require('../models/OtherInfo')
const { logActivity } = require('./activityLogController')

const otherInfoController = {
  getInfo: async (req, res) => {
    try {
      let info = await OtherInfo.findOne()
      if (!info) {
        const defaultAdvantages = [
          { icon: '🏭', title: '本地制造', description: '惠州本土企业，拥有现代化生产基地，品质可控' },
          { icon: '🚚', title: '同城配送', description: '惠州本地24小时内送达，快速响应客户需求' },
          { icon: '🛠️', title: '上门售后', description: '专业技术团队上门服务，及时解决客户问题' },
          { icon: '💡', title: '技术创新', description: '持续投入研发，不断推出新产品和新技术' },
          { icon: '🔧', title: '定制服务', description: '根据客户需求提供个性化定制解决方案' },
          { icon: '📞', title: '贴心服务', description: '7×24小时客服热线，随时为客户解答疑问' }
        ]

        const defaultHistory = [
          { date: '2010年', title: '公司成立', description: '绿色动力在惠州成立，开始生产电瓶观光车' },
          { date: '2015年', title: '扩大生产', description: '建立现代化生产基地，扩大生产规模' },
          { date: '2020年', title: '技术升级', description: '引入先进生产设备和技术，提升产品质量' },
          { date: '2025年', title: '市场拓展', description: '产品远销全国各地，成为行业知名品牌' }
        ]

        const defaultCertifications = [
          { icon: '🏆', title: 'ISO9001质量认证' },
          { icon: '⚡', title: '新能源产品认证' },
          { icon: '🛡️', title: '国家安全认证' },
          { icon: '🌱', title: '环保产品认证' }
        ]

        const defaultServices = [
          { icon: '🚚', title: '同城配送', description: '惠州本地24小时内送达，快速响应您的需求' },
          { icon: '🛠️', title: '上门售后', description: '专业技术团队上门服务，及时解决您的问题' },
          { icon: '📞', title: '24小时服务', description: '全天候客服热线，随时为您解答疑问' },
          { icon: '🔧', title: '免费维修', description: '一年内免费上门维修，让您无后顾之忧' }
        ]

        const defaultHomeAdvantages = [
          { icon: '🚚', title: '同城配送', description: '惠州本地24小时内送达，快速响应您的需求' },
          { icon: '🛠️', title: '上门售后', description: '专业技术团队上门服务，及时解决您的问题' },
          { icon: '🏭', title: '本地制造', description: '惠州本土企业，品质保证，售后无忧' }
        ]

        info = await OtherInfo.create({
          advantages: defaultAdvantages,
          history: defaultHistory,
          certifications: defaultCertifications,
          services: defaultServices,
          homeAdvantages: defaultHomeAdvantages
        })
      } else {
        if (!info.homeAdvantages) {
          info.homeAdvantages = [
            { icon: '🚚', title: '同城配送', description: '惠州本地24小时内送达，快速响应您的需求' },
            { icon: '🛠️', title: '上门售后', description: '专业技术团队上门服务，及时解决您的问题' },
            { icon: '🏭', title: '本地制造', description: '惠州本土企业，品质保证，售后无忧' }
          ]
          await info.save()
        }
      }
      res.json(info)
    } catch (error) {
      console.error('获取其他信息失败:', error)
      res.status(500).json({ error: '获取其他信息失败' })
    }
  },

  saveInfo: async (req, res) => {
    try {
      const { advantages, history, certifications, services, homeAdvantages } = req.body

      let info = await OtherInfo.findOne()

      if (info) {
        if (advantages !== undefined) info.advantages = advantages
        if (history !== undefined) info.history = history
        if (certifications !== undefined) info.certifications = certifications
        if (services !== undefined) info.services = services
        if (homeAdvantages !== undefined) info.homeAdvantages = homeAdvantages
        await info.save()
        logActivity('其他信息', '更新', '其他信息', '更新了其他信息')
      } else {
        info = await OtherInfo.create({
          advantages: advantages || [],
          history: history || [],
          certifications: certifications || [],
          services: services || [],
          homeAdvantages: homeAdvantages || []
        })
      }

      res.json(info)
    } catch (error) {
      console.error('保存其他信息失败:', error)
      res.status(500).json({ error: '保存其他信息失败' })
    }
  }
}

module.exports = otherInfoController
