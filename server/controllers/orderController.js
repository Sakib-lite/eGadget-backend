const User = require('../models/userModel');
const Order = require('../models/orderModel');
const catchError = require('../../utils/catchError');
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.getCheckoutSessions = async (req, res) => {

try{
  const { cartItems, totalPrice } = req.body;
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: cartItems.map((item) => {
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
          },
          unit_amount: totalPrice,
        },
        quantity: item.quantity,
      };
    }),

    mode: 'payment',
    success_url: 'https://e-gadget.vercel.app/',

    cancel_url: 'https://e-gadget.vercel.app/cart',

    customer_email: req.user.email,
  });
  req.sessionId = session.id;
  res.status(200).json({
    status: 'success',
    message: 'Orders Completed',
    session,
    url: session.url,
  });
}catch(err){

res.status(500).json({
  err
})

}

}

const createBookingCheckout = async (session, cart) => {
  const user = (await User.findOne({ email: session.customer_email })).id;
  const price = session.amount_total;

  await Order.create({ user, price, cart, paid: true });
};

exports.webhookCheckout = async (req, res) => {
  const signature = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}  ${process.env.STRIPE_WEBHOOK_SECRET}`);
  }

  // if (event.type === 'checkout.session.completed') {
  //   const session = event.data.object;
  //   const { line_items } = await stripe.checkout.sessions.retrieve(session.id, {
  //     expand: ['line_items'],
  //   });
  //   createBookingCheckout(event.data.object, line_items);
  // }

  res.status(200).json({ received: true });
};
