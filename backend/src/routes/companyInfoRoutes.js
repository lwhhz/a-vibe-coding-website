const express = require('express')
const router = express.Router()
const companyInfoController = require('../controllers/companyInfoController')

router.get('/', companyInfoController.getInfo)
router.post('/', companyInfoController.saveInfo)

module.exports = router