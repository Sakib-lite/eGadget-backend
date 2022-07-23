const db = require('../utils/db');
require('dotenv').config();
const app = require('./../app');
const PORT = process.env.PORT || 3001;
// const dev = process.env.NODE_ENV !== 'production';

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION!');
  console.log(err.name, err.message);
  process.exit(1);
});

db.connect();

const server = app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`> Server running at http://localhost:${PORT}`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION!');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('SIGTERM RECEIVED.');
  server.close(() => {
    console.log('Process terminated!');
  });
});