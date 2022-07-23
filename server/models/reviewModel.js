const mongoose = require('mongoose');
const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review is required'],
      min: 3,
      max: 200,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 4,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'onModel',
      required: [true, 'Review must belong to a tour'],
    },
    onModel: {
      type: String,
      required: true,
      enum: ['Laptop', 'Mobile','Other'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
    createdAt:{
      type:Date,
      default:Date.now()
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// reviewSchema.index({ user: 1, product: 1 }, { unique: true }); 

reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: 'product', select: 'name  image slug' });
  this.populate({
    path: 'user',
    select: 'name image',
  });
  next();
});

// reviewSchema.virtual('mediaType').get(function() { return this.onModel; });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
