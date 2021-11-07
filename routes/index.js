// 載入所需套件
const restController = require('../controllers/restController.js')

module.exports = (app) => {
  // restaurants routes setting
  app.get('/', (req, res) => res.redirect('/restaurants'))
  app.get('/restaurants', restController.getRestaurants)
}
