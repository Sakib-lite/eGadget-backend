const Laptop = require('./../models/laptopModel');
const statisticsController = require('./statisticsController');
const productController = require('./handlerController');


exports.createLaptopItem = productController.createDocument(Laptop);
exports.getAllLaptops = productController.getAllDocuments(Laptop);
exports.getLaptop = productController.getDocumentById(Laptop,[['reviews','review rating createdAt ']]);
exports.updateLaptop = productController.updateDocument(Laptop);
exports.deleteLaptop = productController.deleteDocument(Laptop);
exports.laptopStatistics = statisticsController.productsStats(Laptop)