const express = require('express')
const router = express.Router()
const bannerController = require('../controllers/bannerController')

router.get('/active', bannerController.getBanners)
router.get('/', bannerController.getAllBanners)
router.get('/:id', bannerController.getBanner)
router.post('/', bannerController.createBanner)
router.put('/:id', bannerController.updateBanner)
router.delete('/:id', bannerController.deleteBanner)

module.exports = router