const mongoose = require("mongoose");

const visitSchema = new mongoose.Schema({
  modelVisitList: Array,
  synced: Boolean,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  image: [],
});

mongoose.model("Visit", visitSchema);
