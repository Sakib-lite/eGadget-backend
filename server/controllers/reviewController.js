const handlerController = require('./handlerController');
const Review = require('../models/reviewModel');
const uppercaseFirstLetter = require('../../utils/uppercaseFirstLetter');
const statisticsController = require('./statisticsController');
exports.getUserAndProductId = (req, res, next) => {
  req.body.user = req.user.id;
  req.body.product = req.params.productId;
next()
};

exports.getOnModel = (req, res, next) => {
    // /api/product/laptop/627bc1190223f1612f1531b0/review
  const url = req.originalUrl.split('/')[3]; //laptop
  const onModel = uppercaseFirstLetter(url);
  req.body.onModel = onModel;
  next();
};

exports.getAllReviews = handlerController.getAllDocuments(Review);
exports.createReview = handlerController.createDocument(Review);
exports.getReviewById = handlerController.getDocumentById(Review);
exports.updateReview = handlerController.updateDocument(Review);
exports.deleteReview = handlerController.deleteDocument(Review);
exports.reviewStats= statisticsController.reviewStatistics(Review)