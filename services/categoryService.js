// 載入所需套件
const db = require('../models')
const Category = db.Category

const categoryService = {
  getCategories: async (req, res, callback) => {
    try {
      const categories = await Category.findAll({ raw: true, nest: true })
      if (req.params.id) {
        const category = (await Category.findByPk(req.params.id)).toJSON()
        callback({ categories, category })
      } else {
        callback({ categories })
      }
    } catch (err) {
      console.log(err)
    }
  },

  postCategories: async (req, res, callback) => {
    try {
      if (!req.body.name) {
        callback({ status: 'error', message: '未數入類別名稱' })
      } else {
        await Category.create({ name: req.body.name })
        callback({ status: 'success', message: '' })
      }
    } catch (err) {
      console.log(err)
    }
  },
}

// categoryService exports
module.exports = categoryService