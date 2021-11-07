// 載入所需套件
const restController = require('../controllers/restController.js')
const adminController = require('../controllers/adminController.js')

module.exports = (app) => {
  // restaurants routes setting
  app.get('/', (req, res) => res.redirect('/restaurants'))
  app.get('/restaurants', restController.getRestaurants)

  // admin routes setting
  app.get('/admin', (req, res) => res.redirect('/admin/restaurants'))
  app.get('/admin/restaurants', adminController.getRestaurants)
}
