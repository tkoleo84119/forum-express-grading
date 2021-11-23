// 載入所需套件
const commentService = require('../../services/commentService')

const commentController = {
  // 新增留言
  postComment: (req, res) => {
    commentService.postComment(req, res, data => {
      return res.json(data)
    })
  },

  // 刪除留言
  deleteComment: (req, res) => {
    commentService.deleteComment(req, res, data => {
      return res.json(data)
    })
  },
}

// commentController export
module.exports = commentController