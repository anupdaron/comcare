const mongoose = require("mongoose");

const visitListSchema = new mongoose.Schema({
  visit: Array,
  synced: Boolean,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
});

mongoose.model("VisitList", visitListSchema);
