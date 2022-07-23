const mongoose = require('mongoose');
const slugify = require('slugify');
const upperCaseFirstLetter = require('./../../utils/upperCaseFirstLetter');
const getPercentage = require('../../utils/getPercentage');

const othersSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      maxlength: [50, 'Product name can be more than 50 characters'],
      required: ['true', 'Product name is a required field'],
      trim: true,
      unique: true,
    },
    category: {
      type: 'string',
      default: 'Other',
    },
    brand: {
      type: String,
      required: ['true', 'Product brand name is empty'],
      trim: true,
    },
    model: {
      type: String,
      default: 'CDC N4020',
      uppercase: true,
      trim: true,
    },
    slug: String,

    color: {
      type: String,
      //   required: ['true', 'Product color is required'],
      default: 'Black',
      trim: true,
    },
    origin: {
      type: String,
      default: 'USA',
      uppercase: true,
    },
    price: {
      type: Number,
      required: ['true', 'Product price is a required field'],
    },
    discountPercent: {
      type: Number,
      validate: function () {
        return 100 >= this.discountPercent;
      },
      message: 'Discount price ({VALUE}) should be below 100',
    },
    priceAfterDiscount: {
      type: Number,
    },
    stock: {
      type: Number,
      default: 1,
      min: 0,
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      default: 'product.png',
    },
    orderPlaced: {
      type: Number,
    },
    investedInProducts: {
      type: Number,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

othersSchema.index({ price: 1, ratingsAverage: -1 }); //compound indexing
othersSchema.index({ slug: 1 }); //index for slug

//virtual populating
othersSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'product',
});

othersSchema.virtual('nRating').get(function () {
  return this.reviews?.length;
});

othersSchema.virtual('ratingsAverage').get(function () {
  if (this.reviews?.length) {
    const val = this.reviews.reduce(function (a, b) {
      return a + b['rating'];
    }, 0);
    return (val / this.reviews.length).toFixed(2);
  }
});

othersSchema.pre('save', function (next) {
  this.slug = slugify(this.brand + '-' + this.name, {
    lower: true,
    replacement: '-',
  });

  this.priceAfterDiscount = this.discountPercent
    ? this.price - getPercentage(this.price, this.discountPercent)
    : this.priceAfterDiscount;
  this.name = upperCaseFirstLetter(this.name);
  this.brand = upperCaseFirstLetter(this.brand);
  this.model = upperCaseFirstLetter(this.model);
  this.category = upperCaseFirstLetter(this.category);

  this.investedInProducts = this.priceAfterDiscount
    ? this.priceAfterDiscount * this.stock
    : this.price * this.stock;

  next();
});

const Other = mongoose.model('Other', othersSchema);
module.exports = Other;
