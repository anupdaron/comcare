const mongoose = require("mongoose");

const visitSchema = new mongoose.Schema({
  visit: Array,
  synced: Boolean,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

mongoose.model("Visit", visitSchema);
