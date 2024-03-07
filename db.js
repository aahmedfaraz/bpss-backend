const mongoose = require('mongoose');

const mongoUsername = process.env.MONGODB_USERNAME;
const mongoPassword = process.env.MONGODB_PASSWORD;
const db = `mongodb+srv://${mongoUsername}:${mongoPassword}@bpss-cluster.2mfvi7z.mongodb.net/?retryWrites=true&w=majority&appName=BPSS-Cluster`;

const connectDB = async () => {
  try {
    await mongoose.connect(db);
    console.log('MongoDB is connected');
  } catch(err) {
    console.error(err.message);
    process.exit(1);
  };
};

module.exports = connectDB;
