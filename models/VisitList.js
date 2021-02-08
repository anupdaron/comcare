const mongoose = require("mongoose");

const visitListSchema = new mongoose.Schema({
  visit: Array,
  user_id: String,
  patientId: String,
});

mongoose.model("VisitList", visitListSchema);
