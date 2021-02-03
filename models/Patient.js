const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  patient: Array,
  patient_id: String,
  user: String,
});
// patientSchema.pre("save", function (next) {
//   var self = this;
//   Patient.find({ visit_id: self.visit_id }, function (err, docs) {
//     if (!docs.length) {
//       next();
//     } else {
//       console.log("visit exists: ", self.visit_id);
//       next(new Error("User exists!"));
//     }
//   });
// });

mongoose.model("Patient", patientSchema);
