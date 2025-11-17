const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const connection = async () => {
  try {
    mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected");
  } catch (err) {
    console.log("Error" + err);
  }
};

connection();
