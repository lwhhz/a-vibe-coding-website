const express = require('express')
const router = express.Router()
const contactFormController = require('../controllers/contactFormController')

router.get('/', contactFormController.getContactForms)
router.get('/:id', contactFormController.getContactForm)
router.post('/', contactFormController.createContactForm)
router.put('/:id', contactFormController.updateContactForm)
router.delete('/:id', contactFormController.deleteContactForm)

module.exports = router