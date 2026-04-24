const ContactForm = require('../models/ContactForm')

const contactFormController = {
  // 获取所有咨询表单
  getContactForms: async (req, res) => {
    try {
      const contactForms = await ContactForm.findAll({
        order: [['createdAt', 'DESC']]
      })
      res.json(contactForms)
    } catch (error) {
      res.status(500).json({ error: '获取咨询表单失败' })
    }
  },

  // 获取单个咨询表单
  getContactForm: async (req, res) => {
    try {
      const { id } = req.params
      const contactForm = await ContactForm.findByPk(id)
      if (!contactForm) {
        return res.status(404).json({ error: '咨询表单不存在' })
      }
      res.json(contactForm)
    } catch (error) {
      res.status(500).json({ error: '获取咨询表单失败' })
    }
  },

  // 创建咨询表单
  createContactForm: async (req, res) => {
    try {
      const { name, phone, email, subject, message } = req.body
      const contactForm = await ContactForm.create({
        name,
        phone,
        email,
        subject,
        message
      })
      res.status(201).json(contactForm)
    } catch (error) {
      res.status(500).json({ error: '创建咨询表单失败' })
    }
  },

  // 更新咨询表单状态
  updateContactForm: async (req, res) => {
    try {
      const { id } = req.params
      const { status } = req.body
      const contactForm = await ContactForm.findByPk(id)
      if (!contactForm) {
        return res.status(404).json({ error: '咨询表单不存在' })
      }
      contactForm.status = status
      await contactForm.save()
      res.json(contactForm)
    } catch (error) {
      res.status(500).json({ error: '更新咨询表单失败' })
    }
  },

  // 删除咨询表单
  deleteContactForm: async (req, res) => {
    try {
      const { id } = req.params
      const contactForm = await ContactForm.findByPk(id)
      if (!contactForm) {
        return res.status(404).json({ error: '咨询表单不存在' })
      }
      await contactForm.destroy()
      res.json({ message: '咨询表单删除成功' })
    } catch (error) {
      res.status(500).json({ error: '删除咨询表单失败' })
    }
  }
}

module.exports = contactFormController