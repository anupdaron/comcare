const mongoose = require("mongoose");

const visitListSchema = new mongoose.Schema({
  visit_id: String,
});

mongoose.model("VisitList", visitListSchema);
