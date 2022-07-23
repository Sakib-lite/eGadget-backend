const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema(
  {
    price: {
      type: Number,
      require: [true, 'Order must have a price.'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    paid: {
      type: Boolean,
      default: false,
    },
    cart: { type: Object },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Order must belong to a user'],
    },
    address: {
      type: String,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

orderSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name image id',
  });
  next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
