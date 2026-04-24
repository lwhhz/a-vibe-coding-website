const ActivityLog = require('../models/ActivityLog')

const activityLogController = {
  getLogs: async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 20
      const logs = await ActivityLog.findAll({
        order: [['createdAt', 'DESC']],
        limit
      })
      res.json(logs)
    } catch (error) {
      console.error('获取活动日志失败:', error)
      res.status(500).json({ error: '获取活动日志失败' })
    }
  }
}

async function logActivity(type, action, title, description) {
  try {
    await ActivityLog.create({ type, action, title, description })
  } catch (error) {
    console.error('记录活动日志失败:', error)
  }
}

module.exports = { activityLogController, logActivity }
