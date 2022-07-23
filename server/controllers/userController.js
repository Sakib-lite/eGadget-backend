const User = require('../models/userModel');
const userController = require('./handlerController');
const catchError = require('./../../utils/catchError');
const Error = require('./../../utils/appError');

const excludingItems = (obj, ...exclude) => {
  let newObj = {};
  Object.keys(obj).forEach((el) => {
    if (!exclude.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.updateUser = catchError(async (req, res, next) => {
  if (req.body.password || req.body.confirmPassword) {
    return next(
      new Error(
        'Password and Confirm Password cannot be updated. Please use /changePassword  route',
        400
      )
    );
  }
  const filteredBody = excludingItems(req.body, 'role', 'email', 'password');
  if (req.file) filteredBody.image = req.file.fileName;
  const user = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    runValidators: true,
    new: true,
  });
  res.status(201).json({
    status: 'success',
    message: 'User updated successfully',
    user,
  });
});
exports.getAllUsers = userController.getAllDocuments(User);

exports.createUser = catchError((req, res) => {
  res.status(500).json({
    status: 'error',
    message: ' Please use /signup route',
  });
});

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.getUser = userController.getDocumentById(User, [
  ['reviews', 'review rating onModel -user'],
  ['orders', 'cart price createdAt -user'],
]); //virtual poputating reviews

exports.getUserbyId=catchError(async (req,res,next)=>{

  const user=await User.findById(req.params.id).select('+role')
  if(!user) return next(new Error('User not found',404))
  res.status(200).json({
    status:'success',
    user
  })
})