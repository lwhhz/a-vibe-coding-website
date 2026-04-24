const Case = require('../models/Case')
const { logActivity } = require('./activityLogController')

exports.getCases = async (req, res) => {
  try {
    const cases = await Case.findAll({
      order: [['createdAt', 'DESC']]
    })
    res.json(cases)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getCase = async (req, res) => {
  try {
    const caseItem = await Case.findByPk(req.params.id)
    if (!caseItem) {
      return res.status(404).json({ message: '案例不存在' })
    }
    res.json(caseItem)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.createCase = async (req, res) => {
  try {
    const caseData = { ...req.body }
    if (caseData.categoryText && !caseData.category) {
      caseData.category = caseData.categoryText
    }
    const newCase = await Case.create(caseData)
    logActivity('案例', '新增', newCase.title || '新案例', '新增了案例')
    res.status(201).json(newCase)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

exports.updateCase = async (req, res) => {
  try {
    const caseItem = await Case.findByPk(req.params.id)
    if (!caseItem) {
      return res.status(404).json({ message: '案例不存在' })
    }
    const caseData = { ...req.body }
    if (caseData.categoryText && !caseData.category) {
      caseData.category = caseData.categoryText
    }
    await caseItem.update(caseData)
    logActivity('案例', '更新', caseItem.title || '案例', '更新了案例信息')
    res.json(caseItem)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

exports.deleteCase = async (req, res) => {
  try {
    const caseItem = await Case.findByPk(req.params.id)
    if (!caseItem) {
      return res.status(404).json({ message: '案例不存在' })
    }
    await caseItem.destroy()
    logActivity('案例', '删除', caseItem.title || '案例', '删除了案例')
    res.json({ message: '案例删除成功' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}