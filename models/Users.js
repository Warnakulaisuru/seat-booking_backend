const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number,
  nic: String,
  gender: String,
  department: String,
  trainerId:Number,
});


const UserModel = mongoose.model("users", UserSchema);
module.exports = UserModel;
