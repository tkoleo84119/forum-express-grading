// 載入所需套件
const categoryService = require('../../services/categoryService')

const categoryController = {
  // 後台瀏覽全部餐廳分類
  getCategories: (req, res) => {
    categoryService.getCategories(req, res, data => {
      return res.json(data)
    })
  },

  // 後台新增餐廳分類
  postCategories: (req, res) => {
    categoryService.postCategories(req, res, data => {
      return res.json(data)
    })
  },

  // 後台修改餐廳分類
  putCategory: (req, res) => {
    categoryService.putCategory(req, res, data => {
      return res.json(data)
    })
  },

  // 後台刪除餐廳分類
  deleteCategory: (req, res) => {
    categoryService.deleteCategory(req, res, data => {
      return res.json(data)
    })
  }
}

// categoryController export
module.exports = categoryController