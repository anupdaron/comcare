const mongoose = require("mongoose");

const visitListSchema = new mongoose.Schema({
  visit: Array,
  user: String,
  patient: String,
});

mongoose.model("VisitList", visitListSchema);
