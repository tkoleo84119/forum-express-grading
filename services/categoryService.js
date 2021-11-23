// 載入所需套件
const { Category } = require('../models')

const categoryService = {
  // 後台瀏覽全部餐廳分類
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

  // 後台新增餐廳分類
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

  // 後台修改餐廳分類
  putCategory: async (req, res, callback) => {
    try {
      if (!req.body.name) {
        callback({ status: 'error', message: '未輸入分類名稱' })
      } else {
        await Category.update({ name: req.body.name }, { where: { id: req.params.id } })
        callback({ status: 'success', message: '' })
      }
    } catch (err) {
      console.log(err)
    }
  },

  // 後台刪除餐廳分類
  deleteCategory: async (req, res, callback) => {
    try {
      await Category.destroy({ where: { id: req.params.id } })
      callback({ status: 'success', message: '' })
    } catch (err) {
      console.log(err)
    }
  }
}

// categoryService exports
module.exports = categoryService