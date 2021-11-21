// 載入所需套件
const categoryService = require('../../services/categoryService')

const categoryController = {
  getCategories: (req, res) => {
    categoryService.getCategories(req, res, data => {
      return res.json(data)
    })
  },

  postCategories: (req, res) => {
    categoryService.postCategories(req, res, data => {
      return res.json(data)
    })
  },

  putCategory: (req, res) => {
    categoryService.putCategory(req, res, data => {
      return res.json(data)
    })
  },
}

// categoryController export
module.exports = categoryController