/* eslint-disable no-unused-vars */
const User = require('../models/userModel');
const catchError = require('./../../utils/catchError');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const Error = require('./../../utils/appError');
const sendEmail = require('./../../utils/sendEmail');
const hashedCrypto = require('./../../utils/hashedToken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES * 24 * 60 * 60 * 1000,
  });
};

const createTokenAndSendIt = (user, statusCode, res, message = 'Completed') => {
  const token = generateToken(user._id);
  user.password = undefined;
  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.JWT_EXPIRES * 24 * 60 * 60 * 1000
    ),
    domain: process.env.NODE_ENV === 'development' ? '.localhost' : 'https://e-gadget.vercel.app' ,
    httpOnly: false,
    secure: false,
  });
  res.status(statusCode).json({
    status: 'success',
    message,
    token,
    user,
  });
};

exports.signup = catchError(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    dob: req.body.dob,
    cell: req.body.cell,
  });

  createTokenAndSendIt(user, 201, res, 'User created successfully');
});

exports.login = catchError(async (req, res, next) => {
  const { email, password } = req.body;
  //convert password to string
  if (!email || !password)
    return next(new Error('Please login with email and password'), 400);

  const user = await User.findOne({ email }).select('+password');
  if (!user) return next(new Error('Invalid email or password', 401));
  const matchedPassword = await user.comparePassword(password, user.password);
  if (!matchedPassword || !user)
    return next(new Error('Invalid email or password', 401));

  createTokenAndSendIt(user, 200, res, 'You are now logged in');
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success', message: 'You are logged out' });
};
exports.protectedRoute = catchError(async (req, res, next) => {
  let token;
  console.log('  req.cookies.jwt', req.cookies.jwt)
  if (req.cookies.jwt) {
    token = req.cookies.jwt; //getting token from cookie parsed by cookie parser
  }
  if (!token)
    return next(new Error('You are not logged in. Please login', 401));

  let decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET); //docoding the token like jwt debugger

  const currentUser = await User.findById(decoded.id).select('+role'); //getting the current user

  if (!currentUser)
    return next(new Error('Invalid token. Please login again', 401));

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    //checking if password changed or not
    return next(
      new Error('User recently changed password! Please log in again.', 401)
    );
  }
  //giving acces to user
  if (!req.user) req.user = currentUser;
  res.locals.user = currentUser; //giving access to user in client side
  next();
});

//its for restricting router for admin and moderator
exports.rescricRouteTo = (...roles) => {
  return async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new Error('You are not authorized to access this route', 401)
      );
    }
    next();
  };
};

exports.forgotPassword = catchError(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) return next(new Error('There is no user with this email', 404));

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/users/reset-password/${resetToken}`;

  const message = `Forgot your password? Follow the link \n ${resetURL}`;
  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset token will be expired within 10 minuts',
      text: message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    user.save({ validateBeforeSave: false });
    return next(new Error('Token cant be sent to email.Please try again', 500));
  }
});

exports.resetPassword = catchError(async (req, res, next) => {
  const token = req.params.token;

  const resetToken = hashedCrypto(token);

  const user = await User.findOne({
    resetToken,
    passwordResetTokenExpires: { $gte: Date.now() },
  });

  if (!user) return next(new Error('Invalid token. Please login again', 401));
  const { confirmPassword, password } = req.body;

  user.password = password;
  user.confirmPassword = confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;
  await user.save();

  createTokenAndSendIt(user, 200, res, 'Token Sent to your email');
});

exports.changePassword = catchError(async (req, res, next) => {
  const id = req.user.id;
  const user = await User.findById(id).select('+password');

  const { currentPassword, password, confirmPassword } = req.body;
  const matchedCurrentPassword = await user.comparePassword(
    currentPassword,
    user.password
  );
  if (!matchedCurrentPassword)
    return next(
      new Error('Current password is not correct.Please try again', 401)
    );
  user.password = password;
  user.confirmPassword = confirmPassword;

  await user.save();

  createTokenAndSendIt(user, 200, res, 'Password has Changed Succesfully');
});
