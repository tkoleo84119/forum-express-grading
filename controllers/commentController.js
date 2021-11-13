// 載入所需套件
const db = require('../models')
const Comment = db.Comment

const commentController = {
  postComment: (req, res) => {
    Comment.create({
      text: req.body.text,
      RestaurantId: req.body.restaurantId,
      UserId: req.user.id
    })
      .then(comment => {
        res.redirect(`/restaurants/${req.body.restaurantId}`)
      })
  }
}

// commentController export
module.exports = commentController