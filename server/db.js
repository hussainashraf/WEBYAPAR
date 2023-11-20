const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://hussain:0Bi9m2K6d56aOcUV@cluster0.0gy9nw5.mongodb.net/';
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

db.once('open', () => {
  console.log('Connected to MongoDB using Mongoose');
});
module.exports = mongoose;