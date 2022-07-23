const catchError = require('./../../utils/catchError');
const Mobile = require('../models/mobileModel');
const Laptop = require('../models/laptopModel');
const Other = require('../models/othersModel');

exports.getSearchResults = catchError(async (req, res) => {
  const mobile = await Mobile.find({
    name: { $regex: req.query.name, $options: 'i' },
  });
  const laptop = await Laptop.find({
    name: { $regex: req.query.name, $options: 'i' },
  });
  const other = await Other.find({
    name: { $regex: req.query.name, $options: 'i' },
  });
  let data = [];

  if (mobile.length > 0) data = [...data, ...mobile];
  if (laptop.length > 0) data = [...data, ...laptop];
  if (other.length > 0) data = [...data, ...other];

  res.status(201).json({
    status: 'success',
    results: data.length,
    data,
  });
});
