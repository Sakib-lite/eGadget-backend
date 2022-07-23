const express = require('express');
const db = require('./utils/db');
// require('dotenv').config();
const cors = require('cors');
const laptopRoutes = require('./server/routes/laptopRoutes');
const mobileRoutes = require('./server/routes/mobileRoutes');
const userRoutes = require('./server/routes/userRoutes');
const reviewRoutes = require('./server/routes/reviewRoutes');
const othersRoutes = require('./server/routes/othersRoutes');
const orderRoutes = require('./server/routes/orderRoutes');
const searchRoutes = require('./server/routes/searchRoutes');
const errorHandler = require('./server/controllers/errorController');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const orderController = require('./server/controllers/orderController');
const xss = require('xss-clean')
const compression=require('compression');
const mongoSanitizer = require('express-mongo-sanitize');
const helmet= require('helmet')

const server = express();
db.connect();
server.use(
  cors({
    origin: 'https://e-gadget-app.herokuapp.com',
    credentials: true,
  })
);

server.post(
  '/webhook-checkout',
  bodyParser.raw({ type: 'application/json' }),
  orderController.webhookCheckout
);

server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cookieParser());
server.use(xss())
server.use(compression())
server.use(mongoSanitizer())
//middlewares
//server.get will only be called for GET requests
//server.use only see whether url starts with specified path;
//server.all will match complete path.

// process.env.NODE_ENV === 'development' ? server.use(morgan('dev')) : '';
server.use(helmet());

//routes
server.use('/api/product/laptop', laptopRoutes);
server.use('/api/product/mobile', mobileRoutes);
server.use('/api/product/other', othersRoutes);
server.use('/api/users', userRoutes);
server.use('/api/search', searchRoutes);
server.use('/api/review', reviewRoutes);
server.use('/api/order', orderRoutes);

server.use(errorHandler);

server.listen(process.env.PORT || 3001, '0.0.0.0', function() {
  console.log(`App is running on localhost:${process.env.PORT || 3001}`)
});
