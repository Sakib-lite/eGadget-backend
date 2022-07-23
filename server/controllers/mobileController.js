const Mobile = require('./../models/mobileModel');
const statisticsController = require('./statisticsController');
const productController = require('./handlerController');
// const catchError = require('./../../utils/catchError');

exports.createMobileItem = productController.createDocument(Mobile);
exports.getAllMobiles = productController.getAllDocuments(Mobile);
exports.getMobile = productController.getDocumentById(Mobile, [
  ['reviews', 'review rating createdAt '],
]);
exports.updateMobile = productController.updateDocument(Mobile);
exports.deleteMobile = productController.deleteDocument(Mobile);
exports.mobileStatistics = statisticsController.productsStats(Mobile);
