const Other = require('./../models/othersModel');
const statisticsController = require('./statisticsController');
const productController = require('./handlerController');

exports.createProductItem = productController.createDocument(Other);
exports.getAllProducts= productController.getAllDocuments(Other);
exports.getProduct = productController.getDocumentById(Other, [
  ['reviews', 'review rating createdAt '],
]);
exports.updateProduct = productController.updateDocument(Other);
exports.deleteProduct = productController.deleteDocument(Other);
exports.productStatistics = statisticsController.productsStats(Other);
