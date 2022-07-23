const express = require('express');
const authController = require('../controllers/authController');
const mobileController = require('./../controllers/mobileController');
const router = express.Router();
const reviewRoutes = require('./reviewRoutes');
const multer = require('./../../utils/multer')

router.use('/:productId/review', reviewRoutes); //redirected to reviewRoutes for this specific route

router.route('/mobile-statistics').get(mobileController.mobileStatistics);

router
  .route('/')
  .get(mobileController.getAllMobiles)
  .post(
    multer.uploadImage,
    multer.resizeImage,
    mobileController.createMobileItem
  );

router.route('/:slug').get(mobileController.getMobile);

router
  .route('/:id')
  .patch(mobileController.updateMobile)
  .delete(
    authController.protectedRoute,
    authController.rescricRouteTo('admin', 'moderator'),
    mobileController.deleteMobile
  );
module.exports = router;
