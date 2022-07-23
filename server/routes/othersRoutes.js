const express = require('express');
const authController = require('../controllers/authController');
const othersController = require('./../controllers/othersController');
const router = express.Router();
const reviewRoutes = require('./reviewRoutes');
const multer = require('./../../utils/multer')

router.use('/:productId/review', reviewRoutes); //redirected to reviewRoutes for this specific route

router.route('/other-statistics').get(othersController.productStatistics);

router
  .route('/')
  .get(othersController.getAllProducts)
  .post(
    multer.uploadImage,
    multer.resizeImage,
    othersController.createProductItem
  );

router.route('/:slug').get(othersController.getProduct);

router
  .route('/:id')
  .patch(othersController.updateProduct)
  .delete(
    authController.protectedRoute,
    authController.rescricRouteTo('admin', 'moderator'),
    othersController.deleteProduct
  );
module.exports = router;
