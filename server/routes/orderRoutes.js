const express = require('express');
const router= express.Router()
const authController= require('../controllers/authController')
const orderController= require('../controllers/orderController')

router.use(authController.protectedRoute)
router.route('/').get( authController.rescricRouteTo('admin', 'moderator'),orderController.getAllOrders)
router.route('/:slug').get( authController.rescricRouteTo('admin', 'moderator'),orderController.getOrder);
router.route('/checkout-session').post(orderController.getCheckoutSessions)

module.exports = router;