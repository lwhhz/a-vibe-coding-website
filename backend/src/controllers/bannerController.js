const Banner = require('../models/Banner')
const { logActivity } = require('./activityLogController')

exports.getBanners = async (req, res) => {
  try {
    const banners = await Banner.findAll({
      where: { isActive: true },
      order: [['sortOrder', 'ASC'], ['createdAt', 'DESC']]
    })
    res.json(banners)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.findAll({
      order: [['sortOrder', 'ASC'], ['createdAt', 'DESC']]
    })
    res.json(banners)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getBanner = async (req, res) => {
  try {
    const banner = await Banner.findByPk(req.params.id)
    if (!banner) {
      return res.status(404).json({ message: '轮播图不存在' })
    }
    res.json(banner)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.createBanner = async (req, res) => {
  try {
    const banner = await Banner.create(req.body)
    logActivity('轮播图', '新增', banner.title || '新轮播图', '新增了轮播图')
    res.status(201).json(banner)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

exports.updateBanner = async (req, res) => {
  try {
    const banner = await Banner.findByPk(req.params.id)
    if (!banner) {
      return res.status(404).json({ message: '轮播图不存在' })
    }
    await banner.update(req.body)
    logActivity('轮播图', '更新', banner.title || '轮播图', '更新了轮播图信息')
    res.json(banner)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

exports.deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findByPk(req.params.id)
    if (!banner) {
      return res.status(404).json({ message: '轮播图不存在' })
    }
    await banner.destroy()
    logActivity('轮播图', '删除', banner.title || '轮播图', '删除了轮播图')
    res.json({ message: '删除成功' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}