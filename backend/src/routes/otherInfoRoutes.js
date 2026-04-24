const express = require('express')
const router = express.Router()
const otherInfoController = require('../controllers/otherInfoController')

router.get('/', otherInfoController.getInfo)
router.post('/', otherInfoController.saveInfo)

module.exports = router
