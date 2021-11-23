// 載入所需套件
const { Comment } = require('../models')
const helpers = require('../_helpers')

const commentService = {
  // 新增留言
  postComment: async (req, res, callback) => {
    try {
      await Comment.create({
        text: req.body.text,
        RestaurantId: req.body.restaurantId,
        UserId: helpers.getUser(req).id
      })
      callback({ status: 'success', message: '' })
    } catch (err) {
      console.log(err)
    }
  },

  // 刪除留言
  deleteComment: async (req, res, callback) => {
    try {
      await Comment.destroy({ where: { id: req.params.id } })
      callback({ status: 'success', message: '' })
    } catch (err) {
      console.log(err)
    }
  },
}

// commentService exports
module.exports = commentService