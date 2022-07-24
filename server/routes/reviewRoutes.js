const express = require('express');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');

const router = express.Router({ mergeParams: true });

router.route('/review-stats').get(reviewController.reviewStats)

// router.use(authController.protectedRoute);

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(reviewController.getUserAndProductId, reviewController.getOnModel,reviewController.createReview);

router
  .route('/:id')
  .get(reviewController.getReviewById)
  .delete(reviewController.deleteReview)
  .patch(reviewController.updateReview);

module.exports = router;

//nested route
// POST: /api/product/laptop/627bc1190223f1612f1531b0/review 
//       /api/product/mobile/627bc1190223f1612f1531b0/review 