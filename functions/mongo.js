const mongoose = require("mongoose");
const {MONGO_URI} = require("../src/config");

const studentSchema = new mongoose.Schema({
  id: {type: String, required: true},
  name: {type: String, required: true},
  level: {type: Number, required: true},
 });

async function connectToMongoDB() {
  try {
    // Connect to the MongoDB cluster
    await mongoose.connect(MONGO_URI, {useNewUrlParser: true});
    
    // Log a message indicating successful connection
    console.log('Connected to MongoDB');
  } catch (error) {
    console.log('Error connecting to MongoDB', error);
  }
}

module.exports = {connectToMongoDB, studentSchema};
