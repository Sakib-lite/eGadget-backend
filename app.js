const express = require('express');
const helmet = require('helmet');
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
const mongoSanitize=require('express-mongo-sanitize')
const xss = require('xss-clean');
const compression = require('compression');


const app = express();
app.use(
  cors({
    origin: 'http://localhost:3001',
    credentials: true,
  })
);

app.use(mongoSanitize());
app.use(xss());
app.use(compression())
app.post(
  '/webhook-checkout',
  bodyParser.raw({ type: 'application/json' }),
  orderController.webhookCheckout
  );
  
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  
  //middlewares
  //app.get will only be called for GET requests
  //app.use only see whether url starts with specified path;
  //app.all will match complete path.
  
  // process.env.NODE_ENV === 'development' ? app.use(morgan('dev')) : '';
  app.use(helmet());
  
//routes
app.use('/api/product/laptop', laptopRoutes);
app.use('/api/product/mobile', mobileRoutes);
app.use('/api/product/other', othersRoutes);
app.use('/api/users', userRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/review', reviewRoutes);
app.use('/api/order', orderRoutes);


app.use(errorHandler);

module.exports=app


