// 載入所需套件
const db = require('../models')
const Comment = db.Comment
const helpers = require('../_helpers')

const commentController = {
  postComment: (req, res) => {
    Comment.create({
      text: req.body.text,
      RestaurantId: req.body.restaurantId,
      UserId: helpers.getUser(req).id
    })
      .then(comment => {
        res.redirect(`/restaurants/${req.body.restaurantId}`)
      })
  },

  deleteComment: (req, res) => {
    return Comment.findByPk(req.params.id)
      .then(comment => {
        comment.destroy()
          .then(comment => {
            res.redirect(`/restaurants/${comment.RestaurantId}`)
          })
      })
  },
}

// commentController export
module.exports = commentController