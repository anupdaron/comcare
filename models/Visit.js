const mongoose = require("mongoose");

const visitSchema = new mongoose.Schema({
  AppUserList: Array,
  synced: Boolean,
  user: String,
});

mongoose.model("Visit", visitSchema);
