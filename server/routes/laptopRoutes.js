const express = require('express');
const laptopController = require('./../controllers/laptopController');
const router = express.Router();
const reviewRoutes = require('./reviewRoutes');
const multer = require('../../utils/multer');

router.use('/:productId/review', reviewRoutes); //redirected to reviewRoutes for this specific route
router.route('/laptop-statistics').get(laptopController.laptopStatistics);

router
  .route('/')
  .get(laptopController.getAllLaptops)
  .post(
    multer.uploadImage,
    multer.resizeImage,
    laptopController.createLaptopItem
  );
router.route('/:slug').get(laptopController.getLaptop);

router
  .route('/:id')
  .patch(laptopController.updateLaptop)
  .delete(laptopController.deleteLaptop);
module.exports = router;
