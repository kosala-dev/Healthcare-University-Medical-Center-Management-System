const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

//database connection part
const connection = async () => {
  try {
    mongoose.connect(process.env.MONGO_URL);
    console.log("db connected");
  } catch (err) {
    console.log("Error" + err);
  }
};

connection();
