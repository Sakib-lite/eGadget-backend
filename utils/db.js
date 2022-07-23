const mongoose = require('mongoose');

const connections = {};

const connect = async () => {
  try {
    if (connections.isConnected) {
      console.log('already connected');
      return;
    }
    if (mongoose.connections.length > 0) {
      connections.isConnected = mongoose.connections[0].readyState;
      if (connections.isConnected) {
        console.log('use previous connection');
        return;
      }
    }

    const URI = process.env.DATABASE_URI.replace(
      '<password>',
      process.env.DATABASE_PASSWORD
    );
    const db = await mongoose.connect(URI, {
      useNewUrlParser: true,
    });
    console.log('Database Connected...');
    connections.isConnected = db.connection.readyState;
  } catch (err) {
    console.error(err.message);
    //exit process with failure
    process.exit(1);
  }
};

const disconnect = async () => {
  if (process.env.NODE_ENV === 'production') {
    await mongoose.disconnect();
    connections.isConnected = false;
    console.log('Database Disconnected...');
  } else console.log('Database is not disconnected...');
};

const db={connect,disconnect}
module.exports=db