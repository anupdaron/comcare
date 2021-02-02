const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  patient: Array,
  patient_id: String,
  synced: Boolean,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

mongoose.model("Patient", patientSchema);
