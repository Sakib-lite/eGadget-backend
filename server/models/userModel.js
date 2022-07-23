const mongoose = require('mongoose'); //
const validator = require('validator');
const bcrypt = require('bcryptjs'); //
const crypto = require('crypto');
const hashedCrypto = require('./../../utils/hashedToken');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter your name'],
      minlength: [4, 'Name must be at least 3 characters long'],
    },
    email: {
      type: String,
      required: [true, 'Please enter your email'],
      unique: [true, 'Email has already been used'],
      lowercase: true,
      validate: [validator.isEmail, 'Please enter a valid email'],
    },
    image: {
      type: String,
      default: 'user.jpg',
    },
    password: {
      type: String,
      required: [true, 'Please enter your password'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: process.env.NODE_ENV === 'development',
    },
    confirmPassword: {
      type: String,
      required: [true, 'Please confirm your password'],
      validate: {
        validator: function (val) {
          return val === this.password;
        },
        message: 'Password does not match',
      },
    },
    role: {
      type: String,
      enum: ['admin', 'user', 'moderator'],
      default: 'user',
      select: false,
    },
    cell: {
      type: Number,
      required: [true, 'Please enter your cell number'],
    },
    dob: Date,
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
    active: { type: Boolean, select: false, default: true },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.index({ email: 1 });

userSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'user',
});

userSchema.virtual('orders',{
  ref: 'Order',
  localField: '_id',
  foreignField: 'user',
})

//if only password is modified this middleware gonna run and hash the password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;

  if (!this.isNew) this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre('/^find/', function (next) {
  this.find({ active: { $ne: false } });
  this.populate({
    select: '-__v -passwordChangedAt -active',
  });
  next();
});

userSchema.methods.comparePassword = async function (
  enteredPassword,
  storedPassword
) {
  return await bcrypt.compare(enteredPassword, storedPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const token = crypto.randomBytes(20).toString('hex');
  this.passwordResetToken = hashedCrypto(token);

  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;

  return token;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
