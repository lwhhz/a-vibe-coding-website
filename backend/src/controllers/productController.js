const Product = require('../models/Product')
const { logActivity } = require('./activityLogController')

// 获取所有产品
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.findAll()
    const formattedProducts = products.map(product => {
      const productData = product.toJSON()
      productData.range = productData.range_km
      delete productData.range_km
      // 确保images是数组格式
      if (!Array.isArray(productData.images)) {
        productData.images = productData.images ? [productData.images] : []
      }
      // 向后兼容：提供image字段（第一张图）
      productData.image = productData.images.length > 0 ? productData.images[0] : ''
      return productData
    })
    res.json(formattedProducts)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// 获取单个产品
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id)
    if (!product) {
      return res.status(404).json({ message: '产品不存在' })
    }
    const productData = product.toJSON()
    productData.range = productData.range_km
    delete productData.range_km
    // 确保images是数组格式
    if (!Array.isArray(productData.images)) {
      productData.images = productData.images ? [productData.images] : []
    }
    // 向后兼容：提供image字段（第一张图）
    productData.image = productData.images.length > 0 ? productData.images[0] : ''
    res.json(productData)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// 创建产品
exports.createProduct = async (req, res) => {
  try {
    const productData = { ...req.body }
    if (productData.range) {
      productData.range_km = productData.range
      delete productData.range
    }
    // 处理images字段
    if (typeof productData.images === 'string') {
      try {
        productData.images = JSON.parse(productData.images)
      } catch (e) {
        // 如果解析失败且不是数组，转为数组
        if (productData.images) {
          productData.images = [productData.images]
        } else {
          productData.images = []
        }
      }
    }
    if (!Array.isArray(productData.images)) {
      productData.images = productData.images ? [productData.images] : []
    }
    
    const savedProduct = await Product.create(productData)
    const formattedProduct = savedProduct.toJSON()
    formattedProduct.range = formattedProduct.range_km
    delete formattedProduct.range_km
    formattedProduct.image = formattedProduct.images.length > 0 ? formattedProduct.images[0] : ''
    logActivity('产品', '新增', formattedProduct.name || '新产品', '新增了产品')
    res.status(201).json(formattedProduct)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// 更新产品
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id)
    if (!product) {
      return res.status(404).json({ message: '产品不存在' })
    }
    
    const productData = { ...req.body }
    if (productData.range) {
      productData.range_km = productData.range
      delete productData.range
    }
    // 处理images字段
    if (typeof productData.images === 'string') {
      try {
        productData.images = JSON.parse(productData.images)
      } catch (e) {
        if (productData.images) {
          productData.images = [productData.images]
        } else {
          productData.images = []
        }
      }
    }
    if (!Array.isArray(productData.images)) {
      productData.images = productData.images ? [productData.images] : []
    }
    
    await product.update(productData)
    const formattedProduct = product.toJSON()
    formattedProduct.range = formattedProduct.range_km
    delete formattedProduct.range_km
    formattedProduct.image = formattedProduct.images.length > 0 ? formattedProduct.images[0] : ''
    logActivity('产品', '更新', formattedProduct.name || '产品', '更新了产品信息')
    res.json(formattedProduct)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// 删除产品
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id)
    if (!product) {
      return res.status(404).json({ message: '产品不存在' })
    }
    await product.destroy()
    logActivity('产品', '删除', product.name || '产品', '删除了产品')
    res.json({ message: '产品删除成功' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}