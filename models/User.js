const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  user_id: Number,
  address: {
    type: String,
  },
  dateofbirth: {
    type: String,
  },
});

mongoose.model("User", userSchema);
