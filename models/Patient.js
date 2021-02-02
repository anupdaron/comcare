const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  patient: Array,
  patient_id: String,
  user: String,
});

mongoose.model("Patient", patientSchema);
